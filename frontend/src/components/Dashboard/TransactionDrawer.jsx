import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Tag, Calendar, FileText, Check } from "lucide-react";
import { useTransactions } from "../../context/TransactionContext";
import { CATEGORIES } from "../../constants/categories";

function TransactionForm({ editingTransaction, closeDrawer, addTransaction, updateTransaction }) {
  const [type, setType] = useState(editingTransaction?.type || "expense");
  const [amount, setAmount] = useState(editingTransaction?.amount?.toString() || "");
  const [title, setTitle] = useState(editingTransaction?.title || "");
  const [category, setCategory] = useState(editingTransaction?.category || "Food");
  const [date, setDate] = useState(
    editingTransaction?.date
      ? new Date(editingTransaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState(editingTransaction?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      description: description.trim(),
    };

    setLoading(true);
    setError(null);
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, payload);
      } else {
        await addTransaction(payload);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 flex-1">
      {/* Type Switcher */}
      <div className="space-y-2">
        <label className="block text-sm font-black uppercase tracking-wider text-black/70">
          Transaction Classification
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`py-4 border-3 border-black text-xl font-black uppercase transition-all flex items-center justify-center gap-2 ${
              type === "expense"
                ? "bg-[var(--color-brutal-accent)] text-white shadow-[4px_4px_0px_0px_#000] translate-x-1 translate-y-1"
                : "bg-white text-black hover:bg-black/5 brutal-shadow"
            }`}
          >
            <span>EXPENSE</span>
            {type === "expense" && <Check size={20} strokeWidth={3} />}
          </button>

          <button
            type="button"
            onClick={() => setType("income")}
            className={`py-4 border-3 border-black text-xl font-black uppercase transition-all flex items-center justify-center gap-2 ${
              type === "income"
                ? "bg-[var(--color-brutal-blue)] text-white shadow-[4px_4px_0px_0px_#000] translate-x-1 translate-y-1"
                : "bg-white text-black hover:bg-black/5 brutal-shadow"
            }`}
          >
            <span>INCOME</span>
            {type === "income" && <Check size={20} strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="block text-sm font-black uppercase tracking-wider text-black/70" htmlFor="tx-amount">
          Monetary Value (USD)
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-3xl font-black text-black">
            $
          </span>
          <input
            id="tx-amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-white border-3 border-black py-4 pl-12 pr-4 text-3xl md:text-4xl font-black placeholder:text-black/30 focus:outline-none focus:border-[var(--color-brutal-blue)] focus:ring-0 brutal-shadow transition-all"
          />
        </div>
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <label className="block text-sm font-black uppercase tracking-wider text-black/70" htmlFor="tx-title">
          Designation / Title
        </label>
        <input
          id="tx-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.G. DATA CENTER EXPENSE"
          className="w-full bg-white border-3 border-black p-4 text-lg font-bold placeholder:text-black/30 focus:outline-none focus:border-[var(--color-brutal-blue)] focus:ring-0 brutal-shadow transition-all uppercase"
        />
      </div>

      {/* Category & Date Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-black uppercase tracking-wider text-black/70 flex items-center gap-2" htmlFor="tx-category">
            <Tag size={16} strokeWidth={3} />
            Category
          </label>
          <select
            id="tx-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white border-3 border-black p-4 text-base font-bold focus:outline-none focus:border-[var(--color-brutal-blue)] focus:ring-0 brutal-shadow transition-all uppercase cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="block text-sm font-black uppercase tracking-wider text-black/70 flex items-center gap-2" htmlFor="tx-date">
            <Calendar size={16} strokeWidth={3} />
            Timestamp / Date
          </label>
          <input
            id="tx-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white border-3 border-black p-4 text-base font-bold focus:outline-none focus:border-[var(--color-brutal-blue)] focus:ring-0 brutal-shadow transition-all cursor-pointer"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-black uppercase tracking-wider text-black/70 flex items-center gap-2" htmlFor="tx-desc">
          <FileText size={16} strokeWidth={3} />
          Operational Notes (Optional)
        </label>
        <textarea
          id="tx-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="SPECIFY INVOICE DETAILS OR TRANSACTION CONTEXT..."
          className="w-full bg-white border-3 border-black p-4 text-base font-bold placeholder:text-black/30 focus:outline-none focus:border-[var(--color-brutal-blue)] focus:ring-0 brutal-shadow transition-all"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500 text-white border-3 border-black font-bold uppercase">
          {error}
        </div>
      )}

      {/* Submit & Cancel CTA */}
      <div className="pt-4 space-y-3">
        <button
          type="submit"
          className="w-full bg-[var(--color-brutal-black)] text-white border-3 border-black p-5 text-2xl font-black uppercase flex items-center justify-between group brutal-shadow hover:bg-[var(--color-brutal-accent)] transition-colors cursor-pointer"
          disabled={loading}
        >
          <span>{loading ? "EXECUTING..." : (editingTransaction ? "Save Modifications" : "Commit Record")}</span>
          <ArrowRight size={28} strokeWidth={3} className="transform group-hover:translate-x-2 transition-transform" />
        </button>

        <button
          type="button"
          onClick={closeDrawer}
          className="w-full bg-white text-black border-3 border-black p-3 text-sm font-bold uppercase hover:bg-black/5 transition-colors cursor-pointer"
          disabled={loading}
        >
          Cancel & Abort
        </button>
      </div>
    </form>
  );
}

export default function TransactionDrawer() {
  const { isDrawerOpen, editingTransaction, closeDrawer, addTransaction, updateTransaction } = useTransactions();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ transform: "translateX(100%)" }}
            animate={{ transform: "translateX(0%)" }}
            exit={{ transform: "translateX(100%)" }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} /* iOS drawer curve */
            className="relative w-full max-w-xl bg-[var(--color-brutal-bg)] border-l-3 border-black h-full shadow-2xl flex flex-col z-10 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="p-6 md:p-8 border-b-3 border-black bg-white flex justify-between items-center sticky top-0 z-20">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-black/50 block mb-1">
                  // {editingTransaction ? "RECORD REVISION" : "NEW ENTRY PROTOCOL"}
                </span>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                  {editingTransaction ? "Update Record" : "Add Transaction"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeDrawer}
                className="w-12 h-12 border-3 border-black bg-[var(--color-brutal-bg)] brutal-shadow flex items-center justify-center hover:bg-[var(--color-brutal-accent)] hover:text-white transition-colors cursor-pointer"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            {/* Keyed Form to eliminate cascading effect renders */}
            <TransactionForm
              key={editingTransaction?._id || "new"}
              editingTransaction={editingTransaction}
              closeDrawer={closeDrawer}
              addTransaction={addTransaction}
              updateTransaction={updateTransaction}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
