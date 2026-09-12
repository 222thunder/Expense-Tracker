import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import DashboardNav from "./Dashboard/DashboardNav";
import TransactionDrawer from "./Dashboard/TransactionDrawer";
import { TransactionProvider } from "../context/TransactionContext";

function Layout() {
  return (
    <TransactionProvider>
      <div className="min-h-screen flex flex-col bg-[var(--color-brutal-bg)] text-[var(--color-brutal-black)] font-body">
        <Header />
        <DashboardNav />
        <main className="flex-1">
          <Outlet />
        </main>
        <TransactionDrawer />
        <Footer />
      </div>
    </TransactionProvider>
  );
}

export default Layout;
