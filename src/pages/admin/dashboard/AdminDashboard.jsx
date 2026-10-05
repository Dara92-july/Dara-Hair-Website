import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import {
  Package,
  Users,
  ShoppingBag,
  Wallet,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import { db } from "../../../firebase/firebase.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const productsSnapshot = await getDocs(
          collection(db, "products")
        );

        const usersSnapshot = await getDocs(
          collection(db, "users")
        );

        const ordersSnapshot = await getDocs(
          collection(db, "orders")
        );

        const orders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const revenue = orders.reduce((total, order) => {
          if (
            order.status === "paid" ||
            order.paymentStatus === "paid" ||
            order.status === "completed"
          ) {
            return total + Number(order.totalAmount || order.amount || 0);
          }

          return total;
        }, 0);

        const sortedOrders = [...orders]
          .sort((a, b) => {
            const dateA = a.createdAt?.toMillis?.() || 0;
            const dateB = b.createdAt?.toMillis?.() || 0;

            return dateB - dateA;
          })
          .slice(0, 5);

        setStats({
          products: productsSnapshot.size,
          customers: usersSnapshot.size,
          orders: ordersSnapshot.size,
          revenue,
        });

        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (amount) => {
    return `₦${(Number(amount || 0) / 100).toLocaleString("en-NG")}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "—";

    return timestamp.toDate().toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.products,
      icon: Package,
      link: "/admin/products",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
      link: "/admin/customers",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: ShoppingBag,
      link: "/admin/orders",
    },
    {
      title: "Revenue",
      value: formatPrice(stats.revenue),
      icon: Wallet,
      link: "/admin/orders",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Welcome back. Here's what's happening with Dara Hair.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.title}
              to={stat.link}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-neutral-900">
                    {loading ? "..." : stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                  <Icon size={22} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* RECENT ORDERS */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-neutral-900">
              Recent Orders
            </h2>

            <p className="text-sm text-neutral-500">
              Your latest customer orders
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="flex items-center gap-1 text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-neutral-500">
            No orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-neutral-50">
                <tr className="text-left text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                      #{order.id.slice(0, 8)}
                    </td>

                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {order.customerName ||
                        order.userName ||
                        order.email ||
                        "Customer"}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                      {formatPrice(
                        order.totalAmount || order.amount
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-700">
                        {order.status ||
                          order.paymentStatus ||
                          "pending"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-neutral-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;