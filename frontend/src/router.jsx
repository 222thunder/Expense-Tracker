import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Layout = lazy(() => import("./components/Layout"));
const Overview = lazy(() => import("./pages/dashboard/Overview"));
const TransactionsLedger = lazy(() => import("./pages/dashboard/TransactionsLedger"));
const Analytics = lazy(() => import("./pages/dashboard/Analytics"));
import ProtectedRoute from "./components/ProtectedRoute";

const Fallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--color-brutal-bg)]">
    <div className="text-2xl font-black uppercase tracking-widest animate-pulse">
      LOADING SYSTEM...
    </div>
  </div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={
      <Suspense fallback={<Fallback />}>
        <Outlet />
      </Suspense>
    }>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="transactions" element={<TransactionsLedger />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Route>
    </Route>
  )
);

export default router;
