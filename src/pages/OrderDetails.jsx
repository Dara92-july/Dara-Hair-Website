import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Loader2,
} from "lucide-react";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
} from "firebase/auth";

import { db, auth } from "../firebase/firebase";

const OrderDetails = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        if (!currentUser) {
          setLoading(false);
          return;
        }

        try {
          const orderRef = doc(
            db,
            "orders",
            orderId
          );

          const orderSnapshot =
            await getDoc(orderRef);

          if (!orderSnapshot.exists()) {
            setError("Order not found.");
            setLoading(false);
            return;
          }

          const orderData =
            orderSnapshot.data();

          // Make sure the order belongs
          // to the logged-in customer
          if (
            orderData.userId !==
            currentUser.uid
          ) {
            setError(
              "You do not have permission to view this order."
            );

            setLoading(false);
            return;
          }

          setOrder({
            id: orderSnapshot.id,
            ...orderData,
          });
        } catch (error) {
          console.error(
            "Error loading order:",
            error
          );

          setError(
            "Unable to load this order."
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [orderId]);

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
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            Please sign in
          </h1>

          <p className="mt-2 text-neutral-500">
            You need to sign in to view this order.
          </p>

          <Link
            to="/login"
            className="inline-block px-6 py-3 mt-6 text-white bg-black rounded-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <Package
            size={48}
            className="mx-auto mb-5 text-neutral-400"
          />

          <h1 className="text-2xl font-semibold">
            {error || "Order not found"}
          </h1>

          <Link
            to="/orders"
            className="inline-flex items-center gap-2 px-6 py-3 mt-6 text-white bg-black rounded-lg"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================
  // DATE
  // =====================================================

  const orderDate =
    order.createdAt?.toDate?.();

  const formattedDate = orderDate
    ? orderDate.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date unavailable";

  // =====================================================
  // STATUS
  // =====================================================

  const orderStatus =
    order.orderStatus || "pending";

  const paymentStatus =
    order.paymentStatus || "pending";

  const statuses = [
    {
      key: "pending",
      label: "Order Placed",
      icon: Clock,
    },
    {
      key: "processing",
      label: "Processing",
      icon: Package,
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: Truck,
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: CheckCircle,
    },
  ];

  const statusOrder = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentStatusIndex =
    statusOrder.indexOf(orderStatus);

  return (
    <div className="min-h-screen py-10 bg-neutral-50 sm:py-14">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 mb-8 text-sm text-neutral-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to My Orders
        </Link>

        {/* Header */}
        <div className="p-6 bg-white border border-neutral-200 rounded-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <p className="text-xs tracking-wider uppercase text-neutral-400">
                Order
              </p>

              <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
                {order.orderNumber ||
                  order.id}
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                Placed on {formattedDate}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                  paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                Payment: {paymentStatus}
              </span>

              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 capitalize">
                {orderStatus}
              </span>

            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="p-6 mt-6 bg-white border border-neutral-200 rounded-xl sm:p-8">

          <h2 className="mb-8 text-lg font-semibold">
            Order Status
          </h2>

          <div className="relative">

            {/* Desktop line */}
            <div className="absolute left-0 right-0 hidden h-px sm:block top-5 bg-neutral-200" />

            <div className="relative grid grid-cols-4 gap-2">

              {statuses.map(
                (
                  status,
                  index
                ) => {
                  const Icon =
                    status.icon;

                  const isCompleted =
                    currentStatusIndex >=
                    index;

                  return (
                    <div
                      key={status.key}
                      className="text-center"
                    >
                      <div
                        className={`relative mx-auto w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-400"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <p
                        className={`mt-3 text-xs sm:text-sm ${
                          isCompleted
                            ? "text-black font-medium"
                            : "text-neutral-400"
                        }`}
                      >
                        {status.label}
                      </p>
                    </div>
                  );
                }
              )}

            </div>
          </div>
        </div>

        {/* Products */}
        <div className="p-6 mt-6 bg-white border border-neutral-200 rounded-xl sm:p-8">

          <h2 className="mb-6 text-lg font-semibold">
            Items Ordered
          </h2>

          <div className="space-y-5">

            {order.items?.map(
              (item, index) => {
                const image =
                  item.image ||
                  item.imageUrl ||
                  item.images?.[0];

                return (
                  <div
                    key={
                      item.productId ||
                      item.id ||
                      index
                    }
                    className="flex gap-4"
                  >

                    {/* Image */}
                    <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg sm:w-24 sm:h-24 bg-neutral-100">

                      {image ? (
                        <img
                          src={image}
                          alt={
                            item.name ||
                            "Product"
                          }
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <Package
                            size={28}
                            className="text-neutral-400"
                          />
                        </div>
                      )}

                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">

                      <h3 className="font-medium text-neutral-900">
                        {item.name ||
                          "Product"}
                      </h3>

                      <p className="mt-1 text-sm text-neutral-500">
                        Quantity:{" "}
                        {item.quantity ||
                          1}
                      </p>

                      <p className="mt-2 font-medium">
                        ₦
                        {Number(
                          item.price || 0
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-neutral-200">

            <span className="font-medium">
              Total
            </span>

            <span className="text-xl font-semibold">
              ₦
              {Number(
                order.amount || 0
              ).toLocaleString()}
            </span>

          </div>
        </div>

        {/* Customer / Delivery */}
        <div className="grid gap-6 mt-6 md:grid-cols-2">

          {/* Customer */}
          <div className="p-6 bg-white border border-neutral-200 rounded-xl">

            <div className="flex items-center gap-2 mb-5">
              <MapPin size={19} />
              <h2 className="font-semibold">
                Delivery Information
              </h2>
            </div>

            <div className="space-y-3 text-sm">

              <div>
                <p className="text-neutral-400">
                  Name
                </p>

                <p className="mt-1 text-neutral-800">
                  {order.customer?.name ||
                    "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-neutral-400">
                  Email
                </p>

                <p className="mt-1 break-all text-neutral-800">
                  {order.customer?.email ||
                    "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-neutral-400">
                  Phone
                </p>

                <p className="mt-1 text-neutral-800">
                  {order.customer?.phone ||
                    "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-neutral-400">
                  Address
                </p>

                <p className="mt-1 leading-relaxed text-neutral-800">
                  {order.customer?.address ||
                    "Not provided"}
                </p>
              </div>

            </div>
          </div>

          {/* Payment */}
          <div className="p-6 bg-white border border-neutral-200 rounded-xl">

            <div className="flex items-center gap-2 mb-5">
              <CreditCard size={19} />
              <h2 className="font-semibold">
                Payment Information
              </h2>
            </div>

            <div className="space-y-3 text-sm">

              <div>
                <p className="text-neutral-400">
                  Payment Status
                </p>

                <p className="mt-1 font-medium text-green-600 capitalize">
                  {paymentStatus}
                </p>
              </div>

              <div>
                <p className="text-neutral-400">
                  Payment Reference
                </p>

                <p className="mt-1 break-all text-neutral-800">
                  {order.paymentReference ||
                    "Not available"}
                </p>
              </div>

              {order.paymentChannel && (
                <div>
                  <p className="text-neutral-400">
                    Payment Method
                  </p>

                  <p className="mt-1 capitalize text-neutral-800">
                    {order.paymentChannel}
                  </p>
                </div>
              )}

              {order.paystackTransactionId && (
                <div>
                  <p className="text-neutral-400">
                    Transaction ID
                  </p>

                  <p className="mt-1 text-neutral-800">
                    {
                      order.paystackTransactionId
                    }
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;