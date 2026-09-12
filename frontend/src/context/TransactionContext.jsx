import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { CATEGORIES } from "../constants/categories";

export { CATEGORIES };
export const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [categorySummary, setCategorySummary] = useState({ type: "expense", total: 0, categories: [] });
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 6,
  });

  const fetchData = useCallback(async () => {
    try {
      // Build query string
      const queryParams = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
      });

      if (filters.search) queryParams.append("search", filters.search);
      if (filters.type !== "all") queryParams.append("type", filters.type);
      if (filters.category !== "all") queryParams.append("category", filters.category);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);

      const [txRes, sumRes, catRes, monthRes] = await Promise.all([
        api.get(`/transaction?${queryParams.toString()}`),
        api.get("/transaction/summary"),
        api.get("/transaction/category-summary?type=expense"), // Need to pass type=expense to match the frontend shape
        api.get("/transaction/monthly-summary"),
      ]);

      setTransactions(txRes.data.transactions || []);
      setTotalPages(txRes.data.pagination?.totalPages || 1);
      
      setSummary({
        income: sumRes.data.income || 0,
        expense: sumRes.data.expense || 0,
        balance: sumRes.data.balance || 0,
      });
      
      setCategorySummary({
        type: catRes.data.type || "expense",
        total: catRes.data.total || 0,
        categories: catRes.data.categories || [],
      });
      
      setMonthlySummary(monthRes.data.monthlySummary || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      // Fallback in case of error
      setTransactions([]);
      setSummary({ income: 0, expense: 0, balance: 0 });
      setCategorySummary({ type: "expense", total: 0, categories: [] });
      setMonthlySummary([]);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateDrawer = () => {
    setEditingTransaction(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (tx) => {
    setEditingTransaction(tx);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingTransaction(null);
  };

  const addTransaction = async (data) => {
    try {
      await api.post("/transaction", data);
      await fetchData();
      closeDrawer();
    } catch (error) {
      console.error("Failed to add transaction", error);
      throw error;
    }
  };

  const updateTransaction = async (id, updatedFields) => {
    try {
      await api.patch(`/transaction/${id}`, updatedFields);
      await fetchData();
      closeDrawer();
    } catch (error) {
      console.error("Failed to update transaction", error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transaction/${id}`);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete transaction", error);
      throw error;
    }
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "all",
      category: "all",
      startDate: "",
      endDate: "",
      page: 1,
      limit: 6,
    });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        filteredTransactions: transactions,
        paginatedTransactions: transactions,
        summary,
        categorySummary,
        monthlySummary,
        filters,
        setFilters,
        resetFilters,
        totalPages,
        isDrawerOpen,
        editingTransaction,
        openCreateDrawer,
        openEditDrawer,
        closeDrawer,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
}
