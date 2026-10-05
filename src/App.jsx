import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
// import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminProducts from "./pages/admin/products/AdminProducts";
import AdminCategories from "./pages/admin/categories/AdminCategories";
import AdminCustomers from "./pages/admin/customers/AdminCustomers";
import AdminOrders from "./pages/admin/orders/AdminOrders";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ==================== */}
        {/* PUBLIC ROUTES */}
        {/* ==================== */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/shop" element={<Shop />} />

        <Route
          path="/category/:category"
          element={<Shop />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetail />}
        />

        <Route path="/cart" element={<Cart />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* ==================== */}
        {/* CUSTOMER PROTECTED */}
        {/* ==================== */}

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />

          <Route path="/checkout" element={<Checkout />} />

          {/* We'll add these later */}
          {/* <Route path="/orders" element={<Orders />} /> */}
          {/* <Route path="/wishlist" element={<Wishlist />} /> */}
        </Route>

        {/* ==================== */}
        {/* ADMIN PROTECTED */}
        {/* ==================== */}

       <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
        {/* ==================== */}
        {/* 404 */}
        {/* ==================== */}

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-5xl font-bold mb-3">
                  404
                </h1>

                <p className="text-neutral-500">
                  Page not found.
                </p>
              </div>
            </div>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;