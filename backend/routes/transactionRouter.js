import express from "express";

import {
  postTransaction,
  getTransaction,
  getTransactions,
  getSummary,
  getMonthlySummary,
  getCategorySummary,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transcationController.js";

import { authenticate } from "../middleware/authentication.js";

const transactionRouter = express.Router();

transactionRouter.get("/hello", (req, res) => {
  res.json({ message: "Hello" });
});

transactionRouter.post("/", authenticate, postTransaction);
transactionRouter.get("/", authenticate, getTransactions);

// Summary routes (must be placed before /:id)
transactionRouter.get("/summary", authenticate, getSummary);
transactionRouter.get("/monthly-summary", authenticate, getMonthlySummary);
transactionRouter.get("/category-summary", authenticate, getCategorySummary);

transactionRouter.get("/:id", authenticate, getTransaction);
transactionRouter.patch("/:id", authenticate, updateTransaction);
transactionRouter.delete("/:id", authenticate, deleteTransaction);

export default transactionRouter;
