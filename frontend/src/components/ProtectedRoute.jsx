import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-brutal-bg)] flex flex-col items-center justify-center p-6 text-[var(--color-brutal-black)]">
        <div className="w-16 h-16 border-4 border-black bg-white brutal-shadow flex items-center justify-center mb-6">
          <Loader2 size={32} strokeWidth={3} className="animate-spin text-[var(--color-brutal-accent)]" />
        </div>
        <div className="text-xl font-black uppercase tracking-widest text-center">
          <span className="block mb-2">Establishing Secure Connection</span>
          <span className="text-xs text-black/50">VERIFYING CREDENTIALS...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
