import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { CartProvider } from "@/contexts/CartContext";
import { RootLayout } from "@/routes/RootLayout";
import Home from "@/pages/Home";
import BlogIndexPage from "@/pages/blog/BlogIndexPage";
import BlogPostPage from "@/pages/blog/BlogPostPage";
import StoreIndexPage from "@/pages/store/StoreIndexPage";
import ProductDetailPage from "@/pages/store/ProductDetailPage";
import CheckoutPage from "@/pages/store/CheckoutPage";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import ProfilePage from "@/pages/dashboard/ProfilePage";
import OrdersPage from "@/pages/dashboard/OrdersPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminRoute from "@/routes/AdminRoute";
import AdminVerificationsPage from "@/pages/admin/AdminVerificationsPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminBlogPage from "@/pages/blog/AdminBlogPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="blog" element={<BlogIndexPage />} />
                <Route path="blog/:slug" element={<BlogPostPage />} />
                <Route path="store" element={<StoreIndexPage />} />
                <Route path="store/:slug" element={<ProductDetailPage />} />
                <Route
                  path="checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="orders" element={<OrdersPage />} />
                </Route>
                <Route
                  path="admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<Navigate to="verifications" replace />} />
                  <Route path="verifications" element={<AdminVerificationsPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="blog" element={<AdminBlogPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
