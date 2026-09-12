import { useState } from "react";
import { BarChart3, PieChart, Calendar } from "lucide-react";
import { useTransactions } from "../../context/TransactionContext";

export default function Analytics() {
  const { summary, monthlySummary, categorySummary, transactions } = useTransactions();
  const selectedYear = "2026";
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Find max monthly value to scale bars
  const maxMonthlyVal = Math.max(
    ...monthlySummary.map((m) => Math.max(m.income, m.expense)),
    1000
  );

  const savingsRate = summary.income > 0 
    ? (((summary.income - summary.expense) / summary.income) * 100).toFixed(1) 
    : 0;

  const avgExpensePerDay = (summary.expense / 30).toFixed(2);

  const highestExpenseTx = transactions
    .filter((t) => t.type === "expense")
    .sort((a, b) => b.amount - a.amount)[0];

  const categoryColors = [
    "bg-[var(--color-brutal-accent)]",
    "bg-[var(--color-brutal-blue)]",
    "bg-[var(--color-brutal-black)]",
    "bg-amber-400",
    "bg-emerald-500",
    "bg-purple-600",
    "bg-pink-500",
    "bg-sky-400",
    "bg-stone-500",
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-3 border-black pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-black/60 block mb-1">
            // TERMINAL // SECTOR 03
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Capital Telemetry
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border-3 border-black bg-white px-3 py-1.5 brutal-shadow text-xs font-black uppercase">
            <Calendar size={16} strokeWidth={2.5} />
            <span>AUDIT YEAR: {selectedYear}</span>
          </div>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border-3 border-black p-5 brutal-shadow stagger-enter stagger-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/60 block mb-1">
            SAVINGS VELOCITY
          </span>
          <div className="text-3xl font-black tracking-tight text-[var(--color-brutal-blue)]">
            {savingsRate}%
          </div>
          <p className="text-xs font-bold text-black/70 uppercase mt-1">
            OF INFLOW RETAINED
          </p>
        </div>

        <div className="bg-white border-3 border-black p-5 brutal-shadow stagger-enter stagger-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/60 block mb-1">
            DAILY BURN ESTIMATE
          </span>
          <div className="text-3xl font-black tracking-tight text-[var(--color-brutal-accent)]">
            ${avgExpensePerDay}
          </div>
          <p className="text-xs font-bold text-black/70 uppercase mt-1">
            PROJECTED DAILY OUTFLOW
          </p>
        </div>

        <div className="bg-white border-3 border-black p-5 brutal-shadow stagger-enter stagger-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/60 block mb-1">
            LARGEST DEBIT EVENT
          </span>
          <div className="text-3xl font-black tracking-tight text-black truncate">
            ${highestExpenseTx ? highestExpenseTx.amount.toLocaleString() : "0"}
          </div>
          <p className="text-xs font-bold text-black/70 uppercase mt-1 truncate">
            {highestExpenseTx ? highestExpenseTx.title : "NO RECORD"}
          </p>
        </div>

        <div className="bg-[var(--color-brutal-black)] text-white border-3 border-black p-5 brutal-shadow stagger-enter stagger-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/70 block mb-1">
            NET CAPITAL RATIO
          </span>
          <div className="text-3xl font-black tracking-tight text-white">
            {summary.income > 0 ? (summary.balance / summary.income * 100).toFixed(1) : 0}%
          </div>
          <p className="text-xs font-bold text-white/70 uppercase mt-1">
            BALANCE VS GROSS
          </p>
        </div>
      </div>

      {/* Bespoke 12-Month Inflow vs Burn Chart */}
      <div className="bg-white border-3 border-black brutal-shadow p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-3 border-black pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={24} strokeWidth={3} />
            <h2 className="text-2xl font-black uppercase tracking-tight">
              12-Month Inflow vs Outflow Histogram
            </h2>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-6 text-xs font-black uppercase">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[var(--color-brutal-blue)] border border-black inline-block"></span>
              <span>INFLOW (CREDIT)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[var(--color-brutal-accent)] border border-black inline-block"></span>
              <span>OUTFLOW (BURN)</span>
            </div>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="pt-8 pb-4">
          <div className="grid grid-cols-12 gap-2 md:gap-4 items-end h-64 border-b-3 border-black px-2 relative">
            
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-0 border-b border-dashed border-black/20"></div>
            <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-black/20"></div>

            {monthlySummary.map((m) => {
              const incomeHeight = Math.max(4, Math.round((m.income / maxMonthlyVal) * 100));
              const expenseHeight = Math.max(4, Math.round((m.expense / maxMonthlyVal) * 100));
              const isHovered = hoveredMonth === m.month;

              return (
                <div
                  key={m.month}
                  onMouseEnter={() => setHoveredMonth(m.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className="flex flex-col items-center justify-end h-full group relative cursor-pointer"
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-20 z-30 bg-black text-white p-2 border-2 border-white shadow-xl text-center whitespace-nowrap text-[10px] font-mono pointer-events-none">
                      <div className="font-black border-b border-white/20 pb-1 mb-1 uppercase">
                        {m.month} 2026
                      </div>
                      <div className="text-[var(--color-brutal-blue)]">
                        +${m.income.toLocaleString()}
                      </div>
                      <div className="text-[var(--color-brutal-accent)]">
                        -${m.expense.toLocaleString()}
                      </div>
                      <div className="font-bold pt-0.5 border-t border-white/20 text-white">
                        NET: ${m.balance.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {/* Dual Bars Container */}
                  <div className="flex items-end gap-1 w-full justify-center h-full">
                    {/* Income Bar */}
                    <div
                      style={{ height: `${incomeHeight}%` }}
                      className="w-1/2 max-w-[20px] bg-[var(--color-brutal-blue)] border-2 border-black group-hover:brightness-110 transition-all"
                    />

                    {/* Expense Bar */}
                    <div
                      style={{ height: `${expenseHeight}%` }}
                      className="w-1/2 max-w-[20px] bg-[var(--color-brutal-accent)] border-2 border-black group-hover:brightness-110 transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-Axis Month Labels */}
          <div className="grid grid-cols-12 gap-2 md:gap-4 pt-3 px-2 text-center">
            {monthlySummary.map((m) => (
              <span
                key={m.month}
                className={`text-[10px] md:text-xs font-mono font-black ${
                  hoveredMonth === m.month ? "text-[var(--color-brutal-accent)]" : "text-black/60"
                }`}
              >
                {m.month.slice(0, 3).toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div className="text-right text-[11px] font-mono text-black/50 uppercase">
          PEAK AMPLITUDE CAPACITY: ${maxMonthlyVal.toLocaleString()}
        </div>
      </div>

      {/* Category Breakdown & Distribution Section */}
      <div className="bg-white border-3 border-black brutal-shadow p-6 md:p-8 space-y-8">
        <div className="flex items-center justify-between border-b-3 border-black pb-4">
          <div className="flex items-center gap-2">
            <PieChart size={24} strokeWidth={3} />
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Categorical Outflow Distribution
            </h2>
          </div>
          <span className="text-xs font-black uppercase text-black/60">
            TOTAL BURN: ${categorySummary.total.toLocaleString()}
          </span>
        </div>

        {/* Segmented Distribution Bar */}
        <div className="space-y-2">
          <div className="text-xs font-black uppercase tracking-wider text-black/70">
            COMPOSITE EXPENSE SPECTRUM (100% SCALE)
          </div>
          <div className="h-10 w-full border-3 border-black bg-[var(--color-brutal-bg)] flex overflow-hidden p-0.5">
            {categorySummary.categories.map((cat, idx) => {
              const colorClass = categoryColors[idx % categoryColors.length];
              return (
                <div
                  key={cat.category}
                  style={{ width: `${cat.percentage}%` }}
                  title={`${cat.category}: ${cat.percentage}% ($${cat.total.toLocaleString()})`}
                  className={`${colorClass} h-full border-r border-black last:border-r-0 hover:brightness-125 transition-all cursor-pointer`}
                />
              );
            })}
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="overflow-x-auto border-2 border-black">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-xs font-black uppercase">
                <th className="p-3">INDEX</th>
                <th className="p-3">SECTOR / CATEGORY</th>
                <th className="p-3 text-right">TOTAL ALLOCATION</th>
                <th className="p-3 text-right">VOLUME</th>
                <th className="p-3 text-right">SHARE OF OUTFLOW</th>
              </tr>
            </thead>
            <tbody className="divide-y border-black/10 text-xs font-bold uppercase">
              {categorySummary.categories.map((cat, idx) => {
                const colorClass = categoryColors[idx % categoryColors.length];
                return (
                  <tr key={cat.category} className="hover:bg-[var(--color-brutal-bg)] transition-colors">
                    <td className="p-3 font-mono text-black/50">
                      // 0{idx + 1}
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      <span className={`w-3 h-3 border border-black ${colorClass}`}></span>
                      <span className="font-black text-sm">{cat.category}</span>
                    </td>
                    <td className="p-3 text-right font-black text-sm">
                      ${cat.total.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-black/70">
                      {cat.count} {cat.count === 1 ? "TX" : "TXS"}
                    </td>
                    <td className="p-3 text-right font-black">
                      <span className="px-2 py-0.5 border border-black bg-white">
                        {cat.percentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
