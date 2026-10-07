import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ChevronRight,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase/firebase";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        if (!currentUser) {
          setOrders([]);
          setLoading(false);
          return;
        }

        try {
          const ordersRef = collection(db, "orders");

          const ordersQuery = query(
            ordersRef,
            where("userId", "==", currentUser.uid)
          );

          const snapshot = await getDocs(ordersQuery);

          const fetchedOrders = snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

          // Sort newest orders first
          fetchedOrders.sort((a, b) => {
            const dateA =
              a.createdAt?.toDate?.() || new Date(0);

            const dateB =
              b.createdAt?.toDate?.() || new Date(0);

            return dateB - dateA;
          });

          setOrders(fetchedOrders);
        } catch (error) {
          console.error(
            "Error fetching orders:",
            error
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!loading && !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <Package
            size={48}
            className="mx-auto mb-5 text-neutral-400"
          />

          <h1 className="text-2xl font-semibold text-neutral-900">
            Sign in to view your orders
          </h1>

          <p className="mt-3 text-neutral-500">
            Your orders will appear here after you
            sign in to your account.
          </p>

          <Link
            to="/login"
            className="inline-block px-6 py-3 mt-6 text-white transition bg-black rounded-lg hover:bg-neutral-800"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="mx-auto animate-spin text-neutral-700"
          />

          <p className="mt-4 text-neutral-500">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // EMPTY ORDERS
  // =====================================================

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100">
            <ShoppingBag
              size={36}
              className="text-neutral-500"
            />
          </div>

          <h1 className="text-2xl font-semibold text-neutral-900">
            No orders yet
          </h1>

          <p className="mt-3 text-neutral-500">
            You haven't placed any orders yet.
            Start shopping and your orders will
            appear here.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 mt-6 text-white transition bg-black rounded-lg hover:bg-neutral-800"
          >
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================
  // ORDERS
  // =====================================================

  return (
    <div className="min-h-screen py-10 bg-neutral-50 sm:py-14">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl text-neutral-900">
            My Orders
          </h1>

          <p className="mt-2 text-neutral-500">
            View and track your recent orders.
          </p>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {orders.map((order) => {
            const orderDate =
              order.createdAt?.toDate?.();

            const formattedDate = orderDate
              ? orderDate.toLocaleDateString(
                  "en-NG",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
              : "Date unavailable";

            const paymentStatus =
              order.paymentStatus || "pending";

            const orderStatus =
              order.orderStatus || "pending";

            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block p-5 transition bg-white border border-neutral-200 rounded-xl sm:p-6 hover:border-neutral-400 hover:shadow-sm"
              >
                <div className="flex flex-col gap-5">

                  {/* Top */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-xs tracking-wider uppercase text-neutral-400">
                        Order
                      </p>

                      <h2 className="mt-1 font-semibold text-neutral-900">
                        {order.orderNumber ||
                          order.id}
                      </h2>

                      <p className="mt-1 text-sm text-neutral-500">
                        {formattedDate}
                      </p>
                    </div>

                    <ChevronRight
                      size={22}
                      className="hidden sm:block text-neutral-400"
                    />
                  </div>

                  {/* Bottom */}
                  <div className="flex flex-col gap-4 pt-4 border-t border-neutral-100 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-sm text-neutral-500">
                        Total
                      </p>

                      <p className="font-semibold text-neutral-900">
                        ₦
                        {Number(
                          order.amount || 0
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">

                      {/* Payment */}
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                          paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        Payment:{" "}
                        {paymentStatus}
                      </span>

                      {/* Order */}
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                          orderStatus === "delivered"
                            ? "bg-green-100 text-green-700"
                            : orderStatus ===
                              "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : orderStatus ===
                              "processing"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Mobile arrow */}
                  <div className="flex items-center justify-between text-sm font-medium sm:hidden text-neutral-700">
                    <span>
                      View order details
                    </span>

                    <ChevronRight size={18} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;