import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { db, auth } from "../firebase/firebase.js";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { setCart } from "../store/slice";
import { useNavigate } from "react-router-dom";

// Load Paystack script globally
const loadPaystackScript = () => {
  if (!document.querySelector("#paystack-script")) {
    const script = document.createElement("script");
    script.id = "paystack-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => console.log("✅ Paystack script loaded");
    document.body.appendChild(script);
  }
};

const Checkout = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadPaystackScript();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      const cartRef = doc(db, "carts", currentUser.uid);
      const cartSnap = await getDoc(cartRef);
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];

      if (cartSnap.exists()) {
        const savedCart = cartSnap.data().items || [];
        const mergedCart = [...savedCart];

        localCart.forEach((item) => {
          const existing = mergedCart.find((i) => i.id === item.id);
          if (existing) existing.quantity += item.quantity;
          else mergedCart.push(item);
        });

        setCartItems(mergedCart);
        dispatch(setCart(mergedCart));
        await setDoc(cartRef, { items: mergedCart });
      } else {
        await setDoc(cartRef, { items: localCart });
        setCartItems(localCart);
        dispatch(setCart(localCart));
      }

      localStorage.removeItem("cart");
    });

    return () => unsubscribe();
  }, [navigate, dispatch]);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!window.PaystackPop) {
      alert("⚠️ Payment system not loaded yet. Please wait and try again.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: "pk_test_e2d1c9c3a0bb4edfd98f85dc1dc7c0a2c324e57f",
      email: user.email,
      amount: total * 100,
      currency: "NGN",
      callback: function (response) {
        // ✅ Wrap Firestore logic inside plain function
        (async () => {
          try {
            const txRef = collection(db, "transactions");
            await addDoc(txRef, {
              userId: user.uid,
              email: user.email,
              amount: total,
              cartItems,
              reference: response.reference,
              status: "success",
              createdAt: serverTimestamp(),
            });

            alert("✅ Payment successful! Reference: " + response.reference);
            navigate("/");
          } catch (err) {
            console.error("❌ Error saving transaction:", err);
          }
        })();
      },
      onClose: function () {
        alert("❌ Transaction was not completed, window closed.");
      },
    });

    handler.openIframe();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>

      {user && (
        <div className="mb-4">
          <h3 className="font-semibold">Welcome, {user.email}</h3>
        </div>
      )}

      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border p-2 rounded mb-2"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p>
                  ₦{item.price} x {item.quantity} = ₦
                  {item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-lg mt-4">
            Total: ₦{total}
          </div>
          <button
            onClick={handlePayment}
            className="bg-pink-600 text-white px-4 py-2 rounded mt-4"
          >
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
