
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import {
  User,
  Mail,
  Package,
  Heart,
  ShoppingBag,
  ArrowRight,
  Pencil,
  Check,
  LogOut,
  Clock3,
  Truck,
  CircleCheck,
  XCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContexts.jsx";
import { db } from "../firebase/firebase.js";

const Profile = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(
    profile?.name || user?.displayName || ""
  );

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load customer orders
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) {
        setLoadingOrders(false);
        return;
      }

      try {
        setLoadingOrders(true);

        const ordersRef = collection(
          db,
          "users",
          user.uid,
          "orders"
        );

        const ordersQuery = query(
          ordersRef,
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(ordersQuery);

        const orderData = snapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,
          ...orderDoc.data(),
        }));

        setOrders(orderData);
      } catch (error) {
        console.error("Error loading orders:", error);

        /*
        If there are no orders yet, Firestore may not have
        enough data for the orderBy query. We don't want
        the whole profile to break.
        */

        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user?.uid]);

  /*
  |--------------------------------------------------------------------------
  | Update profile
  |--------------------------------------------------------------------------
  */

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setErrorMessage("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    try {
      setIsSaving(true);

      await updateProfile(user, {
        displayName: trimmedName,
      });

      await updateDoc(doc(db, "users", user.uid), {
        name: trimmedName,
      });

      setName(trimmedName);
      setIsEditing(false);
      setMessage("Your profile has been updated.");
    } catch (error) {
      console.error("Profile update error:", error);
      setErrorMessage("Unable to update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const getInitials = () => {
    const currentName =
      profile?.name ||
      user?.displayName ||
      user?.email ||
      "Dara Hair";

    const parts = currentName.trim().split(" ");

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return currentName.substring(0, 2).toUpperCase();
  };

  const formatPrice = (price) => {
    return `₦${Number(price || 0).toLocaleString("en-NG")}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Date unavailable";

    const date = timestamp?.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    return date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status?.toLowerCase();

    if (
      normalizedStatus === "delivered" ||
      normalizedStatus === "completed"
    ) {
      return (
        <CircleCheck
          size={16}
          className="text-green-600"
        />
      );
    }

    if (
      normalizedStatus === "shipped" ||
      normalizedStatus === "shipping"
    ) {
      return (
        <Truck
          size={16}
          className="text-blue-600"
        />
      );
    }

    if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "canceled"
    ) {
      return (
        <XCircle
          size={16}
          className="text-red-600"
        />
      );
    }

    return (
      <Clock3
        size={16}
        className="text-amber-600"
      />
    );
  };

  const getStatusStyle = (status) => {
    const normalizedStatus = status?.toLowerCase();

    if (
      normalizedStatus === "delivered" ||
      normalizedStatus === "completed"
    ) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (
      normalizedStatus === "shipped" ||
      normalizedStatus === "shipping"
    ) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "canceled"
    ) {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  /*
  |--------------------------------------------------------------------------
  | Stats
  |--------------------------------------------------------------------------
  */

  const wishlistCount = profile?.wishlist?.length || 0;

  const cartCount = 0;

  const totalOrders = orders.length;

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#faf9f7] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ========================================================= */}
        {/* WELCOME HEADER */}
        {/* ========================================================= */}

        <section className="bg-neutral-900 text-white rounded-3xl overflow-hidden shadow-sm mb-8">

          <div className="px-6 py-8 sm:px-10 sm:py-10">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

              <div className="flex items-center gap-4">

                {/* Avatar */}

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-500 flex items-center justify-center text-xl sm:text-2xl font-semibold shrink-0">
                  {getInitials()}
                </div>

                <div>

                  <p className="text-neutral-400 text-sm mb-1">
                    Welcome back
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-semibold">
                    {profile?.name ||
                      user?.displayName ||
                      "Beautiful"}
                    {" "}👋
                  </h1>

                  <p className="text-neutral-400 mt-1 text-sm">
                    We're happy to have you at Dara Hair.
                  </p>

                </div>
              </div>

              <button
                onClick={() => navigate("/shop")}
                className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 px-5 py-3 rounded-full font-medium hover:bg-neutral-100 transition"
              >
                Continue Shopping
                <ArrowRight size={17} />
              </button>

            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* ALERTS */}
        {/* ========================================================= */}

        {message && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            <Check size={17} />
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {/* ========================================================= */}
        {/* ACCOUNT STATS */}
        {/* ========================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          {/* Orders */}

          <button
            onClick={() =>
              document
                .getElementById("orders")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-white border border-neutral-200 rounded-2xl p-5 text-left hover:shadow-sm transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <Package size={21} />
              </div>

              <ArrowRight
                size={18}
                className="text-neutral-400"
              />

            </div>

            <p className="text-2xl font-semibold mt-5">
              {totalOrders}
            </p>

            <p className="text-sm text-neutral-500 mt-1">
              Orders
            </p>

          </button>

          {/* Wishlist */}

          <button
            onClick={() => navigate("/shop")}
            className="bg-white border border-neutral-200 rounded-2xl p-5 text-left hover:shadow-sm transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <Heart size={21} />
              </div>

              <ArrowRight
                size={18}
                className="text-neutral-400"
              />

            </div>

            <p className="text-2xl font-semibold mt-5">
              {wishlistCount}
            </p>

            <p className="text-sm text-neutral-500 mt-1">
              Wishlist items
            </p>

          </button>

          {/* Shopping */}

          <button
            onClick={() => navigate("/cart")}
            className="bg-white border border-neutral-200 rounded-2xl p-5 text-left hover:shadow-sm transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <ShoppingBag size={21} />
              </div>

              <ArrowRight
                size={18}
                className="text-neutral-400"
              />

            </div>

            <p className="text-2xl font-semibold mt-5">
              {cartCount}
            </p>

            <p className="text-sm text-neutral-500 mt-1">
              Items in cart
            </p>

          </button>

        </div>

        {/* ========================================================= */}
        {/* ORDERS */}
        {/* ========================================================= */}

        <section
          id="orders"
          className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-8"
        >

          <div className="px-5 sm:px-7 py-5 border-b border-neutral-200 flex items-center justify-between">

            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                My Orders
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Track your recent purchases
              </p>
            </div>

            {orders.length > 0 && (
              <span className="text-sm text-neutral-500">
                {orders.length} order
                {orders.length !== 1 ? "s" : ""}
              </span>
            )}

          </div>

          {loadingOrders ? (

            <div className="p-10 text-center text-neutral-500">
              Loading your orders...
            </div>

          ) : orders.length === 0 ? (

            <div className="px-6 py-14 text-center">

              <div className="w-14 h-14 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <Package size={25} />
              </div>

              <h3 className="font-semibold mt-4">
                No orders yet
              </h3>

              <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
                Your purchases will appear here once you place your first order.
              </p>

              <button
                onClick={() => navigate("/shop")}
                className="mt-5 inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-800"
              >
                Start Shopping
                <ArrowRight size={16} />
              </button>

            </div>

          ) : (

            <div className="divide-y divide-neutral-100">

              {orders.slice(0, 5).map((order) => {

                const status =
                  order.status || "processing";

                const items =
                  order.items ||
                  order.cartItems ||
                  [];

                const firstItem = items[0];

                return (
                  <div
                    key={order.id}
                    className="p-5 sm:p-7"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div>

                        <p className="font-medium">
                          Order #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
                        </p>

                        <p className="text-sm text-neutral-500 mt-1">
                          {formatDate(order.createdAt)}
                        </p>

                      </div>

                      <span
                        className={`inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border text-xs font-medium ${getStatusStyle(
                          status
                        )}`}
                      >
                        {getStatusIcon(status)}
                        <span className="capitalize">
                          {status}
                        </span>
                      </span>

                    </div>

                    <div className="mt-5 flex items-center gap-4">

                      {firstItem?.imageUrl ? (
                        <img
                          src={firstItem.imageUrl}
                          alt={firstItem.name || "Product"}
                          className="w-16 h-16 rounded-xl object-cover bg-neutral-100"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-neutral-100 flex items-center justify-center">
                          <ShoppingBag
                            size={20}
                            className="text-neutral-400"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">

                        <p className="font-medium truncate">
                          {firstItem?.name || "Dara Hair Product"}
                        </p>

                        <p className="text-sm text-neutral-500 mt-1">
                          {items.length > 1
                            ? `+ ${items.length - 1} other item${
                                items.length > 2 ? "s" : ""
                              }`
                            : `${firstItem?.quantity || 1} item`}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-semibold">
                          {formatPrice(
                            order.total || order.amount
                          )}
                        </p>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </section>

        {/* ========================================================= */}
        {/* ACCOUNT INFORMATION */}
        {/* ========================================================= */}

        <section className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-8">

          <div className="px-5 sm:px-7 py-5 border-b border-neutral-200 flex items-center justify-between">

            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                Account Information
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Keep your personal information up to date
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                <Pencil size={16} />
                Edit
              </button>
            )}

          </div>

          <div className="p-5 sm:p-7">

            {isEditing ? (

              <form
                onSubmit={handleSave}
                className="space-y-5"
              >

                <div>

                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    autoFocus
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>

                  <div className="flex items-center gap-3 border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-3">
                    <Mail
                      size={18}
                      className="text-neutral-400"
                    />

                    <span className="text-neutral-700 break-all">
                      {user?.email}
                    </span>
                  </div>

                </div>

                <div className="flex flex-wrap gap-3">

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-neutral-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {isSaving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName(
                        profile?.name ||
                          user?.displayName ||
                          ""
                      );
                      setIsEditing(false);
                      setErrorMessage("");
                    }}
                    className="border border-neutral-300 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-50"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            ) : (

              <div className="grid sm:grid-cols-2 gap-6">

                <div className="flex items-start gap-4">

                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-400">
                      Full Name
                    </p>

                    <p className="font-medium mt-1">
                      {profile?.name ||
                        user?.displayName ||
                        "Not provided"}
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-neutral-400">
                      Email Address
                    </p>

                    <p className="font-medium mt-1 break-all">
                      {user?.email}
                    </p>
                  </div>

                </div>

              </div>

            )}

          </div>

        </section>

        {/* ========================================================= */}
        {/* QUICK LINKS */}
        {/* ========================================================= */}

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

          <button
            onClick={() => navigate("/shop")}
            className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center gap-4 text-left hover:shadow-sm transition"
          >

            <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>

            <div className="flex-1">
              <p className="font-medium">
                Continue Shopping
              </p>
              <p className="text-sm text-neutral-500">
                Explore our latest hair
              </p>
            </div>

            <ArrowRight
              size={18}
              className="text-neutral-400"
            />

          </button>

          <button
            onClick={() => navigate("/cart")}
            className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center gap-4 text-left hover:shadow-sm transition"
          >

            <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>

            <div className="flex-1">
              <p className="font-medium">
                View Cart
              </p>
              <p className="text-sm text-neutral-500">
                Review your selected items
              </p>
            </div>

            <ArrowRight
              size={18}
              className="text-neutral-400"
            />

          </button>

          <button
            onClick={handleLogout}
            className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center gap-4 text-left hover:shadow-sm transition"
          >

            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <LogOut size={20} />
            </div>

            <div className="flex-1">
              <p className="font-medium text-red-600">
                Logout
              </p>
              <p className="text-sm text-neutral-500">
                Sign out of your account
              </p>
            </div>

            <ArrowRight
              size={18}
              className="text-neutral-400"
            />

          </button>

        </section>

      </div>
    </div>
  );
};

export default Profile;
