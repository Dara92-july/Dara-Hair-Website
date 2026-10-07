import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import {
  Search,
  ShoppingBag,
  Eye,
  X,
} from "lucide-react";

import { db } from "../../../firebase/firebase.js";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      setOrders(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    } catch (error) {
      console.error("Orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // FORMAT ORDER TOTAL
  // IMPORTANT:
  // order.amount is stored in NAIRA
  // =========================
  const formatNaira = (amount) => {
    return `₦${Number(amount || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // =========================
  // FORMAT PRODUCT PRICE
  // IMPORTANT:
  // item.price is stored in KOBO
  // =========================
  const formatKobo = (amount) => {
    return `₦${(Number(amount || 0) / 100).toLocaleString(
      "en-NG",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    )}`;
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "—";

    return timestamp.toDate().toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // CUSTOMER NAME
  // =========================
  const getCustomerName = (order) => {
    return (
      order.customer?.name ||
      order.customerName ||
      order.userName ||
      order.name ||
      order.email ||
      "Customer"
    );
  };

  // =========================
  // CUSTOMER EMAIL
  // =========================
  const getCustomerEmail = (order) => {
    return (
      order.customer?.email ||
      order.email ||
      "No email"
    );
  };

  // =========================
  // CUSTOMER PHONE
  // =========================
  const getCustomerPhone = (order) => {
    return (
      order.customer?.phone ||
      order.phone ||
      "No phone"
    );
  };

  // =========================
  // CUSTOMER ADDRESS
  // =========================
  const getCustomerAddress = (order) => {
    return (
      order.customer?.address ||
      order.address ||
      "No address provided"
    );
  };

  // =========================
  // SEARCH
  // =========================
  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    return (
      order.id?.toLowerCase().includes(searchText) ||
      order.orderNumber?.toLowerCase().includes(searchText) ||
      getCustomerName(order)
        .toLowerCase()
        .includes(searchText) ||
      getCustomerEmail(order)
        .toLowerCase()
        .includes(searchText) ||
      order.paymentReference
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // =========================
  // UPDATE ORDER STATUS
  // =========================
  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdating(true);

      await updateDoc(doc(db, "orders", orderId), {
        orderStatus: status,
        updatedAt: new Date(),
      });

      await fetchOrders();

      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              orderStatus: status,
            }
          : null
      );
    } catch (error) {
      console.error("Order status error:", error);
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // STATUS COLORS
  // =========================
  const statusClasses = {
    pending: "bg-yellow-50 text-yellow-700",
    processing: "bg-blue-50 text-blue-700",
    shipped: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Orders
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage customer orders and order status.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-neutral-500">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag
              size={42}
              className="mx-auto text-neutral-300"
            />

            <p className="mt-3 font-medium text-neutral-700">
              No orders found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-neutral-50">
                <tr className="text-left text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((order) => {
                  const status =
                    order.orderStatus || "pending";

                  return (
                    <tr key={order.id}>
                      {/* ORDER */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-neutral-900">
                          {order.orderNumber
                            ? `#${order.orderNumber}`
                            : `#${order.id.slice(0, 8)}`}
                        </p>
                      </td>

                      {/* CUSTOMER */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-neutral-900">
                          {getCustomerName(order)}
                        </p>

                        <p className="text-xs text-neutral-400">
                          {getCustomerEmail(order)}
                        </p>
                      </td>

                      {/* AMOUNT */}
                      <td className="px-5 py-4 text-sm font-semibold text-neutral-900">
                        {formatNaira(order.amount)}
                      </td>

                      {/* PAYMENT */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs capitalize ${
                            order.paymentStatus === "paid"
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus || "pending"}
                        </span>
                      </td>

                      {/* ORDER STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            statusClasses[status] ||
                            "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4 text-sm text-neutral-500">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* VIEW */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-pink-600"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-neutral-900">
                  {selectedOrder.orderNumber
                    ? `Order #${selectedOrder.orderNumber}`
                    : `Order #${selectedOrder.id.slice(
                        0,
                        8
                      )}`}
                </h2>

                <p className="text-sm text-neutral-500">
                  {formatDate(
                    selectedOrder.createdAt
                  )}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5">
              {/* ================= CUSTOMER ================= */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                  Customer
                </h3>

                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="font-medium text-neutral-900">
                    {getCustomerName(selectedOrder)}
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    {getCustomerEmail(selectedOrder)}
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    {getCustomerPhone(selectedOrder)}
                  </p>

                  <p className="mt-2 text-sm text-neutral-600">
                    {getCustomerAddress(selectedOrder)}
                  </p>
                </div>
              </div>

              {/* ================= ITEMS ================= */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                  Order Items
                </h3>

                <div className="space-y-3">
                  {(selectedOrder.items || []).map(
                    (item, index) => (
                      <div
                        key={item.id || index}
                        className="flex items-center justify-between rounded-xl border border-neutral-200 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {item.name || "Product"}
                          </p>

                          <p className="text-xs text-neutral-500">
                            Qty: {item.quantity || 1}
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-neutral-900">
                          {formatKobo(
                            Number(item.price || 0) *
                              Number(
                                item.quantity || 1
                              )
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ================= TOTAL ================= */}
              <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                <span className="font-semibold text-neutral-900">
                  Total
                </span>

                <span className="text-xl font-bold text-pink-600">
                  {formatNaira(selectedOrder.amount)}
                </span>
              </div>

              {/* ================= PAYMENT STATUS ================= */}
              <div className="rounded-xl border border-neutral-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">
                    Payment Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      selectedOrder.paymentStatus ===
                      "paid"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {selectedOrder.paymentStatus ||
                      "pending"}
                  </span>
                </div>

                {selectedOrder.paymentChannel && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-neutral-500">
                      Payment Channel
                    </span>

                    <span className="text-sm font-medium capitalize text-neutral-900">
                      {selectedOrder.paymentChannel}
                    </span>
                  </div>
                )}
              </div>

              {/* ================= ORDER STATUS ================= */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-900">
                  Order Status
                </label>

                <select
                  value={
                    selectedOrder.orderStatus ||
                    "pending"
                  }
                  onChange={(e) =>
                    updateOrderStatus(
                      selectedOrder.id,
                      e.target.value
                    )
                  }
                  disabled={updating}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-pink-500"
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="processing">
                    Processing
                  </option>

                  <option value="shipped">
                    Shipped
                  </option>

                  <option value="delivered">
                    Delivered
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              {/* ================= PAYMENT REFERENCE ================= */}
              {selectedOrder.paymentReference && (
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-xs text-neutral-500">
                    Payment Reference
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-neutral-900">
                    {selectedOrder.paymentReference}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;