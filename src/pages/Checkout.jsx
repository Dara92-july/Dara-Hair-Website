
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { db, auth } from "../firebase/firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { setCart } from "../store/slice";
import { useNavigate } from "react-router-dom";
import paymentService from "../services/paymentService";

const Checkout = ({ fromGuestCheckout = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const guestCheckout =
      localStorage.getItem("guestCheckout") === "true";

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        try {
          if (!currentUser && !guestCheckout && !fromGuestCheckout) {
            navigate("/login");
            return;
          }

          const isGuest =
            guestCheckout || fromGuestCheckout || !currentUser;

          setUser(isGuest ? null : currentUser);

          /*
            IMPORTANT:

            For guests, create one guest ID and keep it in localStorage.
            This prevents a new guest cart ID from being created every
            time the Checkout component renders.
          */
          let userId;

          if (isGuest) {
            let guestId = localStorage.getItem("guestUserId");

            if (!guestId) {
              guestId = `guest_${Date.now()}`;
              localStorage.setItem("guestUserId", guestId);
            }

            userId = guestId;
          } else {
            userId = currentUser.uid;
          }

          const cartRef = doc(db, "carts", userId);
          const cartSnap = await getDoc(cartRef);

          const localCart =
            JSON.parse(localStorage.getItem("cart")) || [];

          if (cartSnap.exists()) {
            const savedCart =
              cartSnap.data().items || [];

            /*
              Merge Firestore cart and localStorage cart
            */
            const mergedCart = [...savedCart];

            localCart.forEach((item) => {
              const existing = mergedCart.find(
                (cartItem) => cartItem.id === item.id
              );

              if (existing) {
                existing.quantity += item.quantity;
              } else {
                mergedCart.push(item);
              }
            });

            setCartItems(mergedCart);
            dispatch(setCart(mergedCart));

            await setDoc(cartRef, {
              items: mergedCart,
              updatedAt: serverTimestamp(),
            });
          } else {
            await setDoc(cartRef, {
              items: localCart,
              updatedAt: serverTimestamp(),
            });

            setCartItems(localCart);
            dispatch(setCart(localCart));
          }

          /*
            Only remove the local cart after it has been
            merged into the authenticated user's Firestore cart.
          */
          if (currentUser && !guestCheckout) {
            localStorage.removeItem("cart");
          }
        } catch (err) {
          console.error("Error loading cart:", err);
          setError("Unable to load your cart.");
        } finally {
          setLoadingCart(false);
        }
      }
    );

    return () => unsubscribe();
  }, [navigate, dispatch, fromGuestCheckout]);

  /*
    Calculate total
  */
  const total = cartItems.reduce(
    (acc, item) =>
      acc + Number(item.price) * Number(item.quantity),
    0
  );

  /*
    Format Nigerian currency
  */
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  /*
    Handle payment
  */
  const handlePayment = async () => {
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    /*
      Determine whether this is a guest checkout
    */
    const isGuest = !user;

    if (!user && !fromGuestCheckout) {
      const guestCheckout =
        localStorage.getItem("guestCheckout") === "true";

      if (!guestCheckout) {
        navigate("/login");
        return;
      }
    }

    /*
      Email used for Paystack

      Registered user:
        use Firebase email

      Guest:
        use a temporary email
    */
    const paystackEmail =
      user?.email || "guest@darahair.ng";

    /*
      Keep the same guest ID throughout the checkout
    */
    let userId;

    if (user) {
      userId = user.uid;
    } else {
      userId = localStorage.getItem("guestUserId");

      if (!userId) {
        userId = `guest_${Date.now()}`;
        localStorage.setItem("guestUserId", userId);
      }
    }

    setLoading(true);

    try {
      /*
        Generate our own order reference.

        This is NOT the Paystack reference yet.
        It identifies the Firestore order.
      */
      const orderNumber = `DH-${Date.now()}`;

      /*
        Create the order in Firestore BEFORE payment.

        At this point the payment is still pending.
      */
      const orderRef = await addDoc(
        collection(db, "orders"),
        {
          orderNumber,

          userId,

          email: paystackEmail,

          guestOrder: isGuest,

          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            imageUrl: item.imageUrl || "",
          })),

          amount: total,

          currency: "NGN",

          paymentStatus: "pending",

          orderStatus: "pending",

          paymentReference: null,

          createdAt: serverTimestamp(),

          updatedAt: serverTimestamp(),
        }
      );

      /*
        Create a unique Paystack reference.

        Example:

        DH-abc123-1759212345678
      */
      const paymentReference =
        `DH-${orderRef.id}-${Date.now()}`;

      /*
        Save the Paystack reference against the order
        before redirecting the customer to Paystack.
      */
      await updateDoc(orderRef, {
        paymentReference,
        updatedAt: serverTimestamp(),
      });

      /*
        Amount is converted from Naira to Kobo.

        Example:

        ₦25,000
        =
        2,500,000 kobo
      */
      const amountInKobo = Math.round(total * 100);

      /*
        Send payment request to OUR NODE SERVER.

        React NEVER talks to Paystack using the secret key.
      */
      const response = await paymentService.initialize({
        email: paystackEmail,

        amount: amountInKobo,

        reference: paymentReference,

        callback_url: `${window.location.origin}/payment-success`,
      });

      /*
        Paystack returns:

        response.data.data.authorization_url
      */
      const authorizationUrl =
        response?.data?.data?.authorization_url;

      if (!authorizationUrl) {
        throw new Error(
          "Paystack did not return a payment URL."
        );
      }

      /*
        Redirect customer to Paystack.
      */
      window.location.href = authorizationUrl;
    } catch (err) {
      console.error("Payment initialization error:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to initialize payment.";

      setError(message);

      setLoading(false);
    }
  };

  /*
    Loading cart
  */
  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading checkout...
        </p>
      </div>
    );
  }

  /*
    Empty cart
  */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">

          <h2 className="text-2xl font-bold mb-3">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mb-6">
            Add some products before checking out.
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">

      <div className="max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Checkout
          </h1>

          {user ? (
            <p className="text-gray-600 mt-2">
              Welcome back, {user.email}
            </p>
          ) : (
            <p className="text-gray-600 mt-2">
              You are checking out as a guest.
            </p>
          )}

        </div>


        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}


        {/* ================= CHECKOUT CONTENT ================= */}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ================= CART ITEMS ================= */}

          <div className="lg:col-span-2">

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-semibold mb-6">
                Your Order
              </h2>

              <div className="space-y-5">

                {cartItems.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4 border-b pb-5 last:border-b-0"
                  >

                    <img
                      src={
                        item.imageUrl ||
                        "/placeholder.png"
                      }
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">

                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        Quantity: {item.quantity}
                      </p>

                      <p className="font-medium mt-2">
                        {formatPrice(
                          Number(item.price) *
                            Number(item.quantity)
                        )}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>


          {/* ================= ORDER SUMMARY ================= */}

          <div>

            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">

              <h2 className="text-xl font-semibold mb-6">
                Order Summary
              </h2>


              <div className="space-y-4">

                <div className="flex justify-between text-gray-600">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    {formatPrice(total)}
                  </span>

                </div>


                <div className="border-t pt-4">

                  <div className="flex justify-between text-lg font-bold">

                    <span>
                      Total
                    </span>

                    <span>
                      {formatPrice(total)}
                    </span>

                  </div>

                </div>

              </div>


              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg mt-6 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {loading
                  ? "Preparing Payment..."
                  : `Pay ${formatPrice(total)}`}

              </button>


              <p className="text-xs text-gray-500 text-center mt-4">
                You will be redirected to Paystack to securely
                complete your payment.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;

