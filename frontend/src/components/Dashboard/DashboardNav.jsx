import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, BarChart3, Plus } from "lucide-react";
import { useTransactions } from "../../context/TransactionContext";

export default function DashboardNav() {
  const { openCreateDrawer } = useTransactions();

  const navItems = [
    { to: "/dashboard", label: "01. OVERVIEW", icon: LayoutDashboard, end: true },
    { to: "/dashboard/transactions", label: "02. LEDGER", icon: Receipt, end: false },
    { to: "/dashboard/analytics", label: "03. ANALYTICS", icon: BarChart3, end: false },
  ];

  return (
    <div className="hidden md:block border-b-3 border-black bg-white sticky top-[73px] z-40 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-4 py-2 border-3 border-black text-sm md:text-base font-black uppercase flex items-center gap-2 transition-all ${
                    isActive
                      ? "bg-[var(--color-brutal-black)] text-white shadow-[4px_4px_0px_0px_var(--color-brutal-accent)] translate-x-0.5 translate-y-0.5"
                      : "bg-[var(--color-brutal-bg)] text-black hover:bg-black/10 brutal-shadow"
                  }`
                }
              >
                <Icon size={18} strokeWidth={2.5} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Action button & Status */}
        <div className="flex items-center gap-4 justify-between md:justify-end">
          <div className="hidden lg:flex items-center gap-2 text-xs font-black uppercase text-black/60 tracking-wider">
            <span className="w-2.5 h-2.5 bg-emerald-500 border border-black animate-pulse inline-block"></span>
            <span>SYSTEM // READY</span>
          </div>

          <button
            type="button"
            onClick={openCreateDrawer}
            className="px-4 py-2 bg-[var(--color-brutal-accent)] text-white border-3 border-black text-sm md:text-base font-black uppercase flex items-center gap-2 brutal-shadow hover:bg-black transition-colors cursor-pointer"
          >
            <Plus size={18} strokeWidth={3} />
            <span>+ NEW RECORD</span>
          </button>
        </div>
      </div>
    </div>
  );
}
