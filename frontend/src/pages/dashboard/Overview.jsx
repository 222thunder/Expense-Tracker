import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Flame, ArrowRight, Plus, ExternalLink, ShieldCheck } from "lucide-react";
import { useTransactions } from "../../context/TransactionContext";

export default function Overview() {
  const { summary, transactions, categorySummary, openCreateDrawer, openEditDrawer } = useTransactions();

  const recentTransactions = transactions.slice(0, 5);
  const burnRate = summary.income > 0 
    ? ((summary.expense / summary.income) * 100).toFixed(1) 
    : 100;



  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-3 border-black pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-black/60 block mb-1">
            // TERMINAL // SECTOR 01
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Capital Command
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-white border-3 border-black text-xs font-black uppercase brutal-shadow">
            CYCLE // SEPT 2026
          </div>
          <button
            onClick={openCreateDrawer}
            className="px-4 py-2 bg-[var(--color-brutal-accent)] text-white border-3 border-black font-black uppercase text-sm brutal-shadow hover:bg-black transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} strokeWidth={3} />
            <span>DISPATCH ENTRY</span>
          </button>
        </div>
      </div>

      {/* Hero Metric Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Net Balance */}
        <div className="bg-[var(--color-brutal-black)] text-white border-3 border-black p-6 md:p-8 brutal-shadow flex flex-col justify-between relative overflow-hidden stagger-enter stagger-1">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-white/70">
              NET CAPITAL POOL
            </span>
            <div className="w-10 h-10 border-2 border-white flex items-center justify-center">
              <Wallet size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2">
              ${summary.balance.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-white/80">
              <span className={`w-2 h-2 ${summary.balance >= 0 ? "bg-emerald-400" : "bg-red-500"}`}></span>
              <span>{summary.balance >= 0 ? "SOLVENT // SURPLUS" : "WARNING // DEFICIT"}</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Monthly Inflow */}
        <div className="bg-[var(--color-brutal-blue)] text-white border-3 border-black p-6 md:p-8 brutal-shadow flex flex-col justify-between stagger-enter stagger-2">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-white/80">
              TOTAL INFLOW (MONTH)
            </span>
            <div className="w-10 h-10 border-2 border-white flex items-center justify-center">
              <TrendingUp size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2">
              ${summary.income.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-white/80">
              <ArrowUpRight size={14} strokeWidth={3} className="text-emerald-300" />
              <span>POSITIVE TRAJECTORY</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Monthly Burn */}
        <div className="bg-[var(--color-brutal-accent)] text-white border-3 border-black p-6 md:p-8 brutal-shadow flex flex-col justify-between stagger-enter stagger-3">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-white/80">
              TOTAL BURN (MONTH)
            </span>
            <div className="w-10 h-10 border-2 border-white flex items-center justify-center">
              <Flame size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2">
              ${summary.expense.toLocaleString()}
            </div>
            <div className="text-xs font-bold uppercase text-white/90">
              BURN VELOCITY: {burnRate}% OF INFLOW
            </div>
          </div>
        </div>
      </div>

      {/* Dual Column Command Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Activity Log (7 Cols) */}
        <div className="lg:col-span-7 bg-white border-3 border-black brutal-shadow flex flex-col">
          <div className="p-6 border-b-3 border-black flex justify-between items-center bg-[var(--color-brutal-bg)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-black"></span>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                Transmission Stream
              </h2>
            </div>
            <Link
              to="/dashboard/transactions"
              className="text-xs md:text-sm font-black uppercase text-black hover:text-[var(--color-brutal-accent)] flex items-center gap-1 transition-colors"
            >
              <span>LEDGER</span>
              <ArrowRight size={14} strokeWidth={3} />
            </Link>
          </div>

          <div className="divide-y-3 divide-black flex-1">
            {recentTransactions.map((tx) => {
              const isIncome = tx.type === "income";
              const formattedDate = new Date(tx.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={tx._id}
                  onClick={() => openEditDrawer(tx)}
                  className="p-4 md:p-5 flex items-center justify-between hover:bg-[var(--color-brutal-bg)] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 border-2 border-black flex items-center justify-center shrink-0 ${
                        isIncome
                          ? "bg-[var(--color-brutal-blue)] text-white"
                          : "bg-[var(--color-brutal-accent)] text-white"
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownRight size={20} strokeWidth={3} />
                      ) : (
                        <ArrowUpRight size={20} strokeWidth={3} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-base md:text-lg uppercase tracking-tight truncate group-hover:text-[var(--color-brutal-accent)] transition-colors">
                        {tx.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold text-black/60 uppercase">
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <span className="px-1.5 py-0.5 border border-black bg-white">
                          {tx.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <div
                      className={`text-lg md:text-xl font-black uppercase tracking-tight ${
                        isIncome ? "text-[var(--color-brutal-blue)]" : "text-black"
                      }`}
                    >
                      {isIncome ? "+" : "-"}${tx.amount.toLocaleString()}
                    </div>
                    <span className="text-[10px] font-bold text-black/40 uppercase hidden sm:inline">
                      CLICK TO EDIT
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t-3 border-black bg-[var(--color-brutal-bg)] text-center">
            <Link
              to="/dashboard/transactions"
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider hover:text-[var(--color-brutal-blue)] transition-colors"
            >
              <span>Inspect All {transactions.length} Ledger Transmissions</span>
              <ExternalLink size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Right Column: Category Burn & Quick Meter (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Category Expenditure Meter */}
          <div className="bg-white border-3 border-black brutal-shadow p-6">
            <div className="flex justify-between items-center border-b-3 border-black pb-4 mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight">
                Burn Concentration
              </h2>
              <span className="text-xs font-black uppercase text-black/50">
                TOP CATEGORIES
              </span>
            </div>

            <div className="space-y-5">
              {categorySummary.categories.slice(0, 4).map((cat, idx) => {
                const colors = [
                  "bg-[var(--color-brutal-accent)]",
                  "bg-[var(--color-brutal-blue)]",
                  "bg-[var(--color-brutal-black)]",
                  "bg-amber-400",
                ];
                const colorClass = colors[idx % colors.length];

                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-black uppercase">
                      <span>{cat.category}</span>
                      <span>${cat.total.toLocaleString()} ({cat.percentage}%)</span>
                    </div>

                    {/* Brutalist Progress Bar */}
                    <div className="h-6 w-full border-2 border-black bg-[var(--color-brutal-bg)] p-0.5">
                      <div
                        className={`h-full ${colorClass} border border-black transition-[width] duration-300 ease-[cubic-bezier(0.77,0,0.175,1)]`}
                        style={{ width: `${Math.min(100, Math.max(8, cat.percentage))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t-2 border-black/20 text-xs font-bold uppercase text-black/60 flex justify-between items-center">
              <span>ACTIVE CATEGORIES: {categorySummary.categories.length}</span>
              <Link to="/dashboard/analytics" className="font-black text-black hover:text-[var(--color-brutal-blue)]">
                VIEW FULL BREAKDOWN →
              </Link>
            </div>
          </div>

          {/* Tactical Status Card */}
          <div className="bg-[var(--color-brutal-bg)] border-3 border-black brutal-shadow p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black text-white border-2 border-black flex items-center justify-center">
                <ShieldCheck size={18} strokeWidth={3} />
              </div>
              <span className="text-xs font-black uppercase tracking-wider">
                LEDGER INTEGRITY
              </span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
              All Parameters Nominal
            </h3>
            <p className="text-sm font-bold text-black/70 uppercase leading-relaxed mb-6">
              Total liquid reserves remain positive. Regular audit scheduled for next payroll cycle.
            </p>
            <button
              onClick={openCreateDrawer}
              className="w-full bg-white text-black border-3 border-black py-3 text-base font-black uppercase brutal-shadow hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              + QUICK TRANSACTION
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
