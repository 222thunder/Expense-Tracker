import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const postTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date,
      description,
    });

    res.status(200).json({
      message: "Transaction done successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const { type, category, search, startDate, endDate } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 20, 100));
    const skip = (page - 1) * limit;
    const filter = { user: req.user._id };

    if (type && ["income", "expense"].includes(type)) {
      filter.type = type;
    }

    if (typeof category === "string" && category.trim()) {
      filter.category = category.trim();
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate && !isNaN(new Date(startDate).getTime())) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate && !isNaN(new Date(endDate).getTime())) {
        filter.date.$lte = new Date(endDate);
      }
      if (Object.keys(filter.date).length === 0) {
        delete filter.date;
      }
    }

    if (typeof search === "string" && search.trim()) {
      const sanitized = escapeRegex(search.trim());
      filter.$or = [
        { title: { $regex: sanitized, $options: "i" } },
        { description: { $regex: sanitized, $options: "i" } },
      ];
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + transactions.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json({ transaction });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const { title, amount, type, category, date, description } = req.body;

    transaction.title = title ?? transaction.title;
    transaction.amount = amount ?? transaction.amount;
    transaction.type = type ?? transaction.type;
    transaction.category = category ?? transaction.category;
    transaction.date = date ?? transaction.date;
    transaction.description = description ?? transaction.description;

    await transaction.save();

    res.json({
      message: "Transaction updated",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json({
      message: "Transaction deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const match = {
      user: new mongoose.Types.ObjectId(req.user._id),
    };

    if (startDate || endDate) {
      match.date = {};
      if (startDate && !isNaN(new Date(startDate).getTime())) {
        match.date.$gte = new Date(startDate);
      }
      if (endDate && !isNaN(new Date(endDate).getTime())) {
        match.date.$lte = new Date(endDate);
      }
      if (Object.keys(match.date).length === 0) {
        delete match.date;
      }
    }

    const stats = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let income = 0;
    let expense = 0;

    stats.forEach((item) => {
      if (item._id === "income") {
        income = item.total;
      } else if (item._id === "expense") {
        expense = item.total;
      }
    });

    const balance = Number((income - expense).toFixed(2));

    res.status(200).json({
      income: Number(income.toFixed(2)),
      expense: Number(expense.toFixed(2)),
      balance,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlySummary = async (req, res, next) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    const match = {
      user: new mongoose.Types.ObjectId(req.user._id),
      date: {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31, 23, 59, 59, 999),
      },
    };

    const stats = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: monthNames[i],
      monthNumber: i + 1,
      income: 0,
      expense: 0,
      balance: 0,
    }));

    stats.forEach((item) => {
      const mIndex = item._id.month - 1;
      const amount = Number(item.total.toFixed(2));
      if (item._id.type === "income") {
        monthlyData[mIndex].income = amount;
      } else if (item._id.type === "expense") {
        monthlyData[mIndex].expense = amount;
      }
      monthlyData[mIndex].balance = Number(
        (monthlyData[mIndex].income - monthlyData[mIndex].expense).toFixed(2),
      );
    });

    res.status(200).json({
      year,
      monthlySummary: monthlyData,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategorySummary = async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;

    const match = {
      user: new mongoose.Types.ObjectId(req.user._id),
    };

    if (type && ["income", "expense"].includes(type)) {
      match.type = type;
    }

    if (startDate || endDate) {
      match.date = {};
      if (startDate && !isNaN(new Date(startDate).getTime())) {
        match.date.$gte = new Date(startDate);
      }
      if (endDate && !isNaN(new Date(endDate).getTime())) {
        match.date.$lte = new Date(endDate);
      }
      if (Object.keys(match.date).length === 0) {
        delete match.date;
      }
    }

    const stats = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            type: "$type",
            category: "$category",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    stats.forEach((item) => {
      if (item._id.type === "income") {
        totalIncome += item.total;
      } else if (item._id.type === "expense") {
        totalExpense += item.total;
      }
    });

    const categorySummary = {
      income: [],
      expense: [],
    };

    stats.forEach((item) => {
      const itemType = item._id.type;
      const baseTotal = itemType === "income" ? totalIncome : totalExpense;
      const total = Number(item.total.toFixed(2));
      const percentage =
        baseTotal > 0 ? Number(((item.total / baseTotal) * 100).toFixed(2)) : 0;

      categorySummary[itemType].push({
        category: item._id.category,
        total,
        count: item.count,
        percentage,
      });
    });

    if (type && ["income", "expense"].includes(type)) {
      return res.status(200).json({
        type,
        total: Number(
          (type === "income" ? totalIncome : totalExpense).toFixed(2),
        ),
        categories: categorySummary[type],
      });
    }

    res.status(200).json({
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpense: Number(totalExpense.toFixed(2)),
      categories: categorySummary,
    });
  } catch (error) {
    next(error);
  }
};

