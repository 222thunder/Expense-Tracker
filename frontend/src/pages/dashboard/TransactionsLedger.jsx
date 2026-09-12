import { useState } from "react";
import { Search, Filter, Plus, Edit2, Trash2, ArrowUpRight, ArrowDownRight, RotateCcw, AlertTriangle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTransactions, CATEGORIES } from "../../context/TransactionContext";

export default function TransactionsLedger() {
  const {
    paginatedTransactions,
    filteredTransactions,
    filters,
    setFilters,
    resetFilters,
    totalPages,
    openCreateDrawer,
    openEditDrawer,
    deleteTransaction,
  } = useTransactions();

  const [txToDelete, setTxToDelete] = useState(null);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleTypeChange = (newType) => {
    setFilters((prev) => ({ ...prev, type: newType, page: 1 }));
  };

  const handleCategoryChange = (e) => {
    setFilters((prev) => ({ ...prev, category: e.target.value, page: 1 }));
  };

  const handleStartDateChange = (e) => {
    setFilters((prev) => ({ ...prev, startDate: e.target.value, page: 1 }));
  };

  const handleEndDateChange = (e) => {
    setFilters((prev) => ({ ...prev, endDate: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const confirmDelete = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete._id);
      setTxToDelete(null);
    }
  };

  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.startDate ||
    filters.endDate;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      
      {/* Top Header & Quick Add */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-3 border-black pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-black/60 block mb-1">
            // TERMINAL // SECTOR 02
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            General Ledger
          </h1>
        </div>

        <button
          onClick={openCreateDrawer}
          className="px-5 py-3 bg-[var(--color-brutal-accent)] text-white border-3 border-black font-black uppercase text-base brutal-shadow hover:bg-black transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus size={20} strokeWidth={3} />
          <span>RECORD TRANSACTION</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border-3 border-black brutal-shadow p-6 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-black/70">
            <Filter size={16} strokeWidth={3} />
            <span>Telemetry & Query Parameters</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-black uppercase text-[var(--color-brutal-accent)] hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} strokeWidth={2.5} />
              <span>RESET PARAMETERS</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search
              size={18}
              strokeWidth={3}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40"
            />
            <input
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="SEARCH BY TITLE OR DESCRIPTION..."
              className="w-full bg-[var(--color-brutal-bg)] border-2 border-black pl-10 pr-4 py-2.5 text-sm font-bold placeholder:text-black/30 focus:outline-none focus:border-[var(--color-brutal-blue)] uppercase"
            />
          </div>

          {/* Mechanical Type Toggle Pills */}
          <div className="md:col-span-4 flex">
            {["all", "expense", "income"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`flex-1 py-2.5 border-2 border-black text-xs font-black uppercase transition-all -ml-[2px] first:ml-0 ${
                  filters.type === t
                    ? "bg-[var(--color-brutal-black)] text-white z-10"
                    : "bg-white text-black hover:bg-black/5"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={filters.category}
              onChange={handleCategoryChange}
              className="w-full bg-[var(--color-brutal-bg)] border-2 border-black px-3 py-2.5 text-xs font-black uppercase focus:outline-none focus:border-[var(--color-brutal-blue)] cursor-pointer"
            >
              <option value="all">ALL CATEGORIES</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Date Range Row */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold uppercase">
          <span className="text-black/60">DATE RANGE:</span>
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-black/50">FROM:</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={handleStartDateChange}
              className="border-2 border-black px-2 py-1 bg-[var(--color-brutal-bg)] font-bold text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-black/50">TO:</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={handleEndDateChange}
              className="border-2 border-black px-2 py-1 bg-[var(--color-brutal-bg)] font-bold text-xs"
            />
          </div>
        </div>

      </div>

      {/* Ledger Table */}
      <div className="bg-white border-3 border-black brutal-shadow overflow-hidden">
        
        {/* Table Head Info */}
        <div className="p-4 bg-[var(--color-brutal-bg)] border-b-3 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-black"></span>
            <span className="text-xs font-black uppercase tracking-wider">
              TOTAL MATCHES: {filteredTransactions.length} ENTRIES
            </span>
          </div>
          <span className="text-xs font-bold uppercase text-black/60">
            SHOWING PAGE {filters.page} OF {totalPages}
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 border-3 border-black bg-[var(--color-brutal-bg)] mx-auto flex items-center justify-center">
              <X size={32} strokeWidth={3} className="text-black/40" />
            </div>
            <h3 className="text-2xl font-black uppercase">NO TRANSMISSIONS DETECTED</h3>
            <p className="text-sm font-bold text-black/60 uppercase max-w-md mx-auto">
              No ledger records match the active query parameters. Adjust filters or register a new record.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-black text-white border-2 border-black font-black uppercase text-xs hover:bg-[var(--color-brutal-accent)] transition-colors"
            >
              CLEAR ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-3 border-black bg-black text-white text-xs font-black uppercase tracking-wider">
                  <th className="p-4">DATE</th>
                  <th className="p-4">TRANSACTION DETAILS</th>
                  <th className="p-4">CATEGORY</th>
                  <th className="p-4">TYPE</th>
                  <th className="p-4 text-right">AMOUNT</th>
                  <th className="p-4 text-center">COMMANDS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {paginatedTransactions.map((tx) => {
                  const isIncome = tx.type === "income";
                  const dateStr = new Date(tx.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr
                      key={tx._id}
                      className="hover:bg-[var(--color-brutal-bg)] transition-colors group"
                    >
                      {/* Date */}
                      <td className="p-4 text-xs font-bold font-mono text-black/70 whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Title & Description */}
                      <td className="p-4">
                        <div className="font-black text-base uppercase tracking-tight text-black group-hover:text-[var(--color-brutal-accent)] transition-colors">
                          {tx.title}
                        </div>
                        {tx.description && (
                          <div className="text-xs font-bold text-black/50 line-clamp-1 mt-0.5">
                            {tx.description}
                          </div>
                        )}
                      </td>

                      {/* Category Badge */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 border-2 border-black text-xs font-black uppercase bg-white">
                          {tx.category}
                        </span>
                      </td>

                      {/* Type Badge */}
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 border text-xs font-black uppercase ${
                            isIncome
                              ? "bg-[var(--color-brutal-blue)] text-white border-black"
                              : "bg-[var(--color-brutal-accent)] text-white border-black"
                          }`}
                        >
                          {isIncome ? (
                            <ArrowDownRight size={14} strokeWidth={3} />
                          ) : (
                            <ArrowUpRight size={14} strokeWidth={3} />
                          )}
                          {tx.type}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <span
                          className={`text-lg font-black tracking-tight ${
                            isIncome ? "text-[var(--color-brutal-blue)]" : "text-black"
                          }`}
                        >
                          {isIncome ? "+" : "-"}${tx.amount.toLocaleString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditDrawer(tx)}
                            title="Edit Record"
                            className="w-8 h-8 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                          >
                            <Edit2 size={14} strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setTxToDelete(tx)}
                            title="Purge Record"
                            className="w-8 h-8 border-2 border-black bg-white hover:bg-[var(--color-brutal-accent)] hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t-3 border-black bg-[var(--color-brutal-bg)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs font-bold uppercase text-black/60">
            PAGE NAVIGATION // {filters.page} OF {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page <= 1}
              className="px-3 py-1.5 border-2 border-black bg-white text-xs font-black uppercase flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} strokeWidth={3} />
              <span>PREV</span>
            </button>

            <div className="px-4 py-1.5 border-2 border-black bg-black text-white text-xs font-black">
              {filters.page}
            </div>

            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= totalPages}
              className="px-3 py-1.5 border-2 border-black bg-white text-xs font-black uppercase flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <span>NEXT</span>
              <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Dialog Modal */}
      {txToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border-3 border-black brutal-shadow p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 text-[var(--color-brutal-accent)]">
              <div className="w-10 h-10 border-2 border-black bg-[var(--color-brutal-accent)] text-white flex items-center justify-center">
                <AlertTriangle size={24} strokeWidth={3} />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-black/50 block">CONFIRMATION</span>
                <h3 className="text-xl font-black uppercase text-black">Purge Record?</h3>
              </div>
            </div>

            <p className="text-sm font-bold uppercase text-black/80 leading-relaxed">
              Are you sure you want to permanently purge{" "}
              <span className="text-black underline font-black">"{txToDelete.title}"</span> (${txToDelete.amount}) from the ledger? This operation is irreversible.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setTxToDelete(null)}
                className="py-3 border-2 border-black text-sm font-black uppercase hover:bg-black/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="py-3 bg-[var(--color-brutal-accent)] text-white border-2 border-black text-sm font-black uppercase hover:bg-black transition-colors brutal-shadow cursor-pointer"
              >
                Yes, Purge
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
