
import { Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import PaymentSuccess from "./pages/PaymentSuccess";
import About from "./pages/About";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import OrderDetails from "./pages/OrderDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminProducts from "./pages/admin/products/AdminProducts";
import AdminCategories from "./pages/admin/categories/AdminCategories";
import AdminCustomers from "./pages/admin/customers/AdminCustomers";
import AdminOrders from "./pages/admin/orders/AdminOrders";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import Orders from "./pages/Orders";

/* ========================= */
/* WEBSITE LAYOUT */
/* ========================= */

const WebsiteLayout = () => {
  return (
    <>
      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
};

/* ========================= */
/* APP */
/* ========================= */

function App() {
  return (
    <Routes>
      {/* ================================= */}
      {/* NORMAL WEBSITE */}
      {/* ================================= */}

      <Route element={<WebsiteLayout />}>
        {/* PUBLIC ROUTES */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/shop" element={<Shop />} />

        <Route
          path="/category/:category"
          element={<Shop />}
        />
        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetail />}
        />

        <Route path="/cart" element={<Cart />} />

        {/* AUTHENTICATION */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* CUSTOMER PROTECTED */}

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/orders"
            element={<Orders />}
          />
          <Route
            path="/orders/:orderId"
            element={<OrderDetails />}
          />
        </Route>
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      {/* ================================= */}
      {/* ADMIN */}
      {/* ================================= */}

      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="categories"
            element={<AdminCategories />}
          />

          <Route
            path="customers"
            element={<AdminCustomers />}
          />

          <Route
            path="orders"
            element={<AdminOrders />}
          />
        </Route>
      </Route>

      {/* ================================= */}
      {/* 404 */}
      {/* ================================= */}

      <Route
        path="*"
        element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="mb-3 text-5xl font-bold">
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
  );
}

export default App;