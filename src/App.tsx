
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";
import CustomerProfile from "./pages/customer/Profile";
import StoreOwnerRegister from "./pages/customer/StoreOwnerRegister";
import Dashboard from "./pages/Dashboard";
import POSIndex from "./pages/pos";
import Terminal from "./pages/pos/Terminal";
import Inventory from "./pages/pos/Inventory";
import Shifts from "./pages/pos/Shifts";
import DashboardUsers from "./pages/dashboard/Users";
import DashboardSales from "./pages/dashboard/Sales";
import DashboardShifts from "./pages/dashboard/Shifts";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";

const queryClient = new QueryClient();

const App = () => {
  const basename = window.location.hostname === 'localhost' ? '' : window.location.pathname.split('/')[1];

  return (
    <BrowserRouter basename={basename}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/register" element={<CustomerRegister />} />
            <Route path="/profile" element={<CustomerProfile />} />
            <Route path="/store-owner-register" element={<StoreOwnerRegister />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/users" element={<DashboardUsers />} />
            <Route path="/admin/sales" element={<DashboardSales />} />
            <Route path="/admin/shifts" element={<DashboardShifts />} />
            
            {/* POS Routes */}
            <Route path="/pos" element={<POSIndex />} />
            <Route path="/pos/terminal" element={<Terminal />} />
            <Route path="/pos/inventory" element={<Inventory />} />
            <Route path="/pos/shifts" element={<Shifts />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
