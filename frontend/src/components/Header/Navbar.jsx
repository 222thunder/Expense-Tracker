import { useState, useContext, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, LogOut, User, Plus, Menu, X, LayoutDashboard, Receipt, BarChart3 } from "lucide-react";
import { TransactionContext } from "../../context/TransactionContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.startsWith("/dashboard");

  const txContext = useContext(TransactionContext);
  const openCreateDrawer = txContext?.openCreateDrawer;
  const { user, logout } = useAuth();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", label: "01. OVERVIEW", icon: LayoutDashboard, end: true },
    { to: "/dashboard/transactions", label: "02. LEDGER", icon: Receipt, end: false },
    { to: "/dashboard/analytics", label: "03. ANALYTICS", icon: BarChart3, end: false },
  ];

  return (
    <>
      <nav className={`border-b-3 flex justify-between items-center px-4 md:px-6 py-4 sticky top-0 z-[70] transition-colors ${isMenuOpen ? "bg-transparent border-transparent" : "bg-[var(--color-brutal-bg)] border-black"}`}>
        <Link to="/" className="flex items-center gap-3 group">
          <div className={`w-10 h-10 border-3 border-black flex items-center justify-center transition-colors ${isMenuOpen ? "bg-white" : "bg-[var(--color-brutal-blue)] group-hover:bg-[var(--color-brutal-accent)]"}`}>
            <Wallet className={isMenuOpen ? "text-black" : "text-white"} size={20} strokeWidth={3} />
          </div>
          <span className={`text-2xl font-black uppercase tracking-tighter transition-colors ${isMenuOpen ? "text-white" : "text-black"}`}>
            X-PENSE
          </span>
        </Link>

        {isDashboard ? (
          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop User Pill */}
            {user && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border-3 border-black bg-white text-sm font-black uppercase brutal-shadow">
                <User size={16} strokeWidth={3} className="text-[var(--color-brutal-blue)]" />
                <span>OP // {user.username}</span>
              </div>
            )}

            {/* Desktop Logout button */}
            <button
              onClick={handleLogout}
              className="hidden md:flex px-4 py-2 border-3 border-black font-black uppercase text-base bg-white text-black hover:bg-black hover:text-white transition-colors brutal-shadow items-center gap-1.5 cursor-pointer"
              title="Terminate Session"
            >
              <LogOut size={18} strokeWidth={2.5} />
              <span>EXIT</span>
            </button>

            {/* Mobile Actions: Quick Add & Menu Toggle */}
            <div className="flex md:hidden items-center gap-2">
              {!isMenuOpen && (
                <button
                  onClick={openCreateDrawer}
                  className="w-10 h-10 bg-[var(--color-brutal-accent)] text-white border-3 border-black flex items-center justify-center brutal-shadow"
                >
                  <Plus size={20} strokeWidth={3} />
                </button>
              )}
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`w-10 h-10 border-3 border-black flex items-center justify-center transition-colors ${isMenuOpen ? "bg-white text-black" : "bg-black text-white brutal-shadow"} cursor-pointer`}
              >
                {isMenuOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/login"
              className={`px-4 md:px-6 py-2 border-3 border-black font-bold uppercase transition-colors brutal-shadow ${isMenuOpen ? "bg-white text-black hidden md:block" : "bg-white text-black hover:bg-black hover:text-white"}`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 border-3 border-black font-bold uppercase bg-[var(--color-brutal-accent)] text-white hover:bg-black transition-colors brutal-shadow hidden md:block"
            >
              Initialize
            </Link>
          </div>
        )}
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-60 bg-[var(--color-brutal-blue)] md:hidden flex flex-col pt-24 pb-8 px-6 overflow-y-auto"
          >
            {/* Abstract Grid Noise */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 2px, transparent 2px)", backgroundSize: "32px 32px" }}></div>
            
            <div className="relative z-10 flex-1 flex flex-col">
              
              {/* Status / Ident */}
              {user && (
                <div className="mb-8 border-b-3 border-white/20 pb-6 stagger-enter stagger-1">
                  <div className="text-xs font-black uppercase text-white/60 mb-2 tracking-widest">
                    CURRENT OPERATOR
                  </div>
                  <div className="text-2xl font-black uppercase text-white flex items-center gap-3">
                    <User size={24} strokeWidth={3} />
                    {user.username}
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex flex-col gap-4 mb-auto stagger-enter stagger-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `p-4 border-3 border-black font-black uppercase text-xl flex items-center gap-4 transition-transform active:scale-95 ${
                          isActive
                            ? "bg-[var(--color-brutal-accent)] text-white shadow-[6px_6px_0px_0px_#0a0a0a] translate-x-1 translate-y-1 shadow-[2px_2px_0px_0px_#0a0a0a]"
                            : "bg-white text-black shadow-[6px_6px_0px_0px_#0a0a0a]"
                        }`
                      }
                    >
                      <Icon size={28} strokeWidth={3} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="mt-12 space-y-4 stagger-enter stagger-3">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openCreateDrawer();
                  }}
                  className="w-full p-5 bg-[var(--color-brutal-accent)] text-white border-3 border-black text-2xl font-black uppercase flex justify-between items-center shadow-[6px_6px_0px_0px_#0a0a0a] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_#0a0a0a] transition-all cursor-pointer"
                >
                  <span>NEW RECORD</span>
                  <Plus size={28} strokeWidth={4} />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full p-4 bg-white text-black border-3 border-black text-xl font-black uppercase flex justify-center items-center gap-3 shadow-[6px_6px_0px_0px_#0a0a0a] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_#0a0a0a] transition-all cursor-pointer"
                >
                  <LogOut size={24} strokeWidth={3} />
                  <span>TERMINATE SESSION</span>
                </button>
              </div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
