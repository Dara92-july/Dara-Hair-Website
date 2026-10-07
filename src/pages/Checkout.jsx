import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { auth, db } from "../firebase/firebase.js";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

import {
  User,
  UserRound,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ChevronLeft,
} from "lucide-react";

import paymentService from "../services/paymentService";

const Checkout = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [checkoutMode, setCheckoutMode] = useState(null);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= AUTH =================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setCheckoutMode("account");

        setCustomer((prev) => ({
          ...prev,
          email: currentUser.email || "",
          name: currentUser.displayName || "",
        }));
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ================= PRICE =================
  // Product prices are stored in KOBO.
  // Convert KOBO -> NAIRA whenever we display/calculate prices.

  const getPriceInNaira = (price) => {
    return Number(price || 0) / 100;
  };

  // ================= TOTAL =================
  // total is now in NAIRA.

  const total = cart.reduce(
    (acc, item) =>
      acc +
      getPriceInNaira(item.price) * Number(item.quantity),
    0
  );

  // ================= FORMAT PRICE =================

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // ================= CUSTOMER INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= PAYMENT =================

  const handlePayment = async () => {
    setError("");

    // Check cart
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // Check checkout mode
    if (!checkoutMode) {
      setError("Please choose how you want to checkout.");
      return;
    }

    // Validate customer information
    if (!customer.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!customer.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!customer.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!customer.address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    // Make sure total is valid
    if (!total || total <= 0) {
      setError("Invalid order amount.");
      return;
    }

    setLoading(true);

    try {
      // ==============================
      // DETERMINE CUSTOMER TYPE
      // ==============================

      const isGuest = checkoutMode === "guest";

      // Logged-in users use Firebase UID.
      // Guests use null.
      const userId = user ? user.uid : null;

      // ==============================
      // CREATE ORDER NUMBER
      // ==============================

      const orderNumber = `DH-${Date.now()}`;

      // ==============================
      // CREATE PAYMENT REFERENCE
      // ==============================

      const paymentReference = `DH-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;

      // ==============================
      // CREATE FIRESTORE ORDER
      // ==============================
      //
      // IMPORTANT:
      //
      // item.price is kept in KOBO.
      //
      // Example:
      // ₦130,000 = 13,000,000 kobo
      //
      // amount is stored in NAIRA.
      //
      // Example:
      // amount = 130000
      //
      // Your payment verification server expects
      // amount to be in Naira and multiplies it by 100.
      //

      const orderData = {
        orderNumber,

        userId,

        guestOrder: isGuest,

        customer: {
          name: customer.name.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
          address: customer.address.trim(),
        },

        items: cart.map((item) => ({
          id: item.id,

          name: item.name,

          // Keep product price in KOBO
          price: Number(item.price),

          quantity: Number(item.quantity),

          imageUrl:
            item.imageUrl ||
            item.images?.[0]?.url ||
            item.images?.[0] ||
            "",

          variantKey: item.variantKey || null,
        })),

        // Store total in NAIRA
        amount: total,

        currency: "NGN",

        paymentStatus: "pending",

        orderStatus: "pending",

        paymentReference,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      };

      const orderRef = await addDoc(
        collection(db, "orders"),
        orderData
      );

      console.log("Order created:", orderRef.id);

      // ==============================
      // CONVERT NAIRA TO KOBO
      // ==============================
      //
      // Paystack expects amount in KOBO.
      //
      // ₦130,000 × 100
      // = 13,000,000 kobo
      //

      const amountInKobo = Math.round(total * 100);

      // ==============================
      // INITIALIZE PAYSTACK
      // ==============================

      const response = await paymentService.initialize({
        email: customer.email.trim(),

        amount: amountInKobo,

        reference: paymentReference,

        callback_url: `${window.location.origin}/payment-success`,
      });

      console.log("Paystack response:", response);

      // ==============================
      // GET PAYSTACK PAYMENT URL
      // ==============================

      const authorizationUrl =
        response?.data?.data?.authorization_url;

      if (!authorizationUrl) {
        throw new Error(
          "Paystack did not return a payment URL."
        );
      }

      // ==============================
      // REDIRECT TO PAYSTACK
      // ==============================

      window.location.href = authorizationUrl;
    } catch (err) {
      console.error(
        "Payment initialization error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to initialize payment.";

      setError(message);

      setLoading(false);
    }
  };

  // ================= LOADING =================

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-3 border-4 border-pink-500 rounded-full border-t-transparent animate-spin" />

          <p className="text-neutral-500">
            Loading checkout...
          </p>
        </div>
      </div>
    );
  }

  // ================= EMPTY CART =================

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-pink-50">
            <ShoppingBag
              size={34}
              className="text-pink-500"
            />
          </div>

          <h1 className="text-2xl font-semibold">
            Your cart is empty
          </h1>

          <p className="mt-3 text-neutral-500">
            Add some beautiful pieces to your cart
            before checking out.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 mt-6 font-medium text-white transition bg-pink-600 rounded-lg hover:bg-pink-700"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // ================= CHECKOUT CHOICE =================

  if (!checkoutMode && !user) {
    return (
      <div className="min-h-screen px-4 py-10 bg-neutral-50 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 mb-8 text-sm text-neutral-500 hover:text-pink-600"
          >
            <ChevronLeft size={17} />
            Back to Cart
          </button>

          <div className="mb-10 text-center">
            <h1 className="text-2xl font-semibold sm:text-3xl text-neutral-900">
              How would you like to checkout?
            </h1>

            <p className="max-w-xl mx-auto mt-3 text-neutral-500">
              You can checkout as a guest, or login to
              your account so you can easily monitor your
              orders.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* GUEST */}

            <button
              onClick={() => setCheckoutMode("guest")}
              className="p-6 text-left transition bg-white border border-neutral-200 rounded-2xl sm:p-8 hover:border-pink-400 hover:shadow-md group"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-5 transition rounded-xl bg-neutral-100 group-hover:bg-pink-50">
                <UserRound
                  size={23}
                  className="text-neutral-700 group-hover:text-pink-600"
                />
              </div>

              <h2 className="text-lg font-semibold text-neutral-900">
                Continue as Guest
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                Complete your purchase without creating
                an account.
              </p>

              <div className="flex items-center gap-2 mt-6 text-sm font-medium text-pink-600">
                Continue as Guest
                <ArrowRight size={17} />
              </div>
            </button>

            {/* LOGIN */}

            <button
              onClick={() =>
                navigate("/login", {
                  state: {
                    from: "/checkout",
                  },
                })
              }
              className="p-6 text-left transition bg-white border border-neutral-200 rounded-2xl sm:p-8 hover:border-pink-400 hover:shadow-md group"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-5 rounded-xl bg-pink-50">
                <User
                  size={23}
                  className="text-pink-600"
                />
              </div>

              <h2 className="text-lg font-semibold text-neutral-900">
                Login to Your Account
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                Login to monitor your orders and manage
                your account after purchase.
              </p>

              <div className="flex items-center gap-2 mt-6 text-sm font-medium text-pink-600">
                Login & Continue
                <ArrowRight size={17} />
              </div>
            </button>
          </div>

          {/* SECURITY */}

          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-neutral-500">
            <ShieldCheck size={16} />
            Secure payment powered by Paystack
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN CHECKOUT =================

  return (
    <div className="min-h-screen px-4 py-8 bg-neutral-50 sm:py-12">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 mb-5 text-sm text-neutral-500 hover:text-pink-600"
          >
            <ChevronLeft size={17} />
            Back to Cart
          </button>

          <h1 className="text-2xl font-semibold sm:text-3xl text-neutral-900">
            Checkout
          </h1>

          <p className="mt-2 text-neutral-500">
            {user
              ? `Welcome back, ${
                  user.displayName || user.email
                }`
              : "You're checking out as a guest."}
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="px-4 py-3 mb-6 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">

          {/* CUSTOMER DETAILS */}

          <div className="lg:col-span-2">
            <div className="p-5 bg-white border border-neutral-200 rounded-xl sm:p-7">

              <div className="mb-7">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Delivery Information
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Enter the details needed to deliver your
                  order.
                </p>
              </div>

              <div className="space-y-5">

                {/* NAME */}

                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={customer.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 transition border rounded-lg outline-none border-neutral-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 transition border rounded-lg outline-none border-neutral-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />

                  <p className="mt-2 text-xs text-neutral-500">
                    Your payment confirmation will be
                    associated with this email.
                  </p>
                </div>

                {/* PHONE */}

                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                    className="w-full px-4 py-3 transition border rounded-lg outline-none border-neutral-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                {/* ADDRESS */}

                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-700">
                    Delivery Address
                  </label>

                  <textarea
                    name="address"
                    value={customer.address}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter your complete delivery address"
                    className="w-full px-4 py-3 transition border rounded-lg outline-none resize-none border-neutral-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}

          <div>
            <div className="p-5 bg-white border border-neutral-200 rounded-xl sm:p-6 lg:sticky lg:top-24">

              <h2 className="mb-6 text-lg font-semibold text-neutral-900">
                Order Summary
              </h2>

              {/* ITEMS */}

              <div className="mb-6 space-y-4">

                {cart.map((item) => {
                  const priceInNaira =
                    getPriceInNaira(item.price);

                  const itemTotal =
                    priceInNaira *
                    Number(item.quantity);

                  return (
                    <div
                      key={`${item.id}-${
                        item.variantKey || "default"
                      }`}
                      className="flex gap-3"
                    >
                      <img
                        src={
                          item.imageUrl ||
                          item.images?.[0]?.url ||
                          item.images?.[0] ||
                          "/placeholder.png"
                        }
                        alt={item.name}
                        className="object-cover rounded-lg w-14 h-14 bg-neutral-100"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-neutral-900">
                          {item.name}
                        </p>

                        {item.variantName && (
                          <p className="mt-1 text-xs text-neutral-500">
                            {item.variantName}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-medium text-neutral-900">
                        {formatPrice(itemTotal)}
                      </p>
                    </div>
                  );
                })}

              </div>

              {/* TOTALS */}

              <div className="pt-5 space-y-4 border-t border-neutral-200">

                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">
                    Subtotal
                  </span>

                  <span className="font-medium">
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">
                    Delivery
                  </span>

                  <span className="text-neutral-500">
                    Calculated later
                  </span>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="text-xl font-bold">
                    {formatPrice(total)}
                  </span>
                </div>

              </div>

              {/* PAYMENT BUTTON */}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white py-3.5 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Preparing Payment..."
                  : `Pay ${formatPrice(total)}`}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-neutral-500">
                <ShieldCheck size={15} />
                Secure payment with Paystack
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;