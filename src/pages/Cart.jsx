import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../store/slice";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Prices are stored in Kobo in the cart.
  // Convert to Naira before displaying/calculating.
  const getPriceInNaira = (price) => {
    return Number(price || 0) / 100;
  };

  const total = cart.reduce(
    (acc, item) =>
      acc +
      getPriceInNaira(item.price) * Number(item.quantity),
    0
  );

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleIncrease = (item) => {
    dispatch(
      increaseQuantity({
        id: item.id,
        variantKey: item.variantKey,
      })
    );
  };

  const handleDecrease = (item) => {
    dispatch(
      decreaseQuantity({
        id: item.id,
        variantKey: item.variantKey,
      })
    );
  };

  const handleRemove = (item) => {
    dispatch(
      removeFromCart({
        id: item.id,
        variantKey: item.variantKey,
      })
    );
  };

  // ================= EMPTY CART =================

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-pink-50">
            <ShoppingBag className="text-pink-500 w-9 h-9" />
          </div>

          <h1 className="text-2xl font-semibold sm:text-3xl text-neutral-900">
            Your cart is empty
          </h1>

          <p className="mt-3 leading-relaxed text-neutral-500">
            Looks like you haven't added anything to your cart yet.
            Explore our collection and find something beautiful.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition bg-pink-600 rounded-lg mt-7 hover:bg-pink-700"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-neutral-50 sm:py-12">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 mb-5 text-sm transition text-neutral-500 hover:text-pink-600"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </button>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl text-neutral-900">
                Shopping Cart
              </h1>

              <p className="mt-2 text-neutral-500">
                {cart.length}{" "}
                {cart.length === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">

          {/* ================= CART ITEMS ================= */}

          <div className="space-y-4 lg:col-span-2">

            {cart.map((item) => {
              const priceInNaira = getPriceInNaira(item.price);

              const itemTotal =
                priceInNaira * Number(item.quantity);

              return (
                <div
                  key={`${item.id}-${item.variantKey || "default"}`}
                  className="p-4 bg-white border border-neutral-200 rounded-xl sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-5">

                    {/* IMAGE */}

                    <div className="flex-shrink-0 w-24 overflow-hidden rounded-lg h-28 sm:w-32 sm:h-36 bg-neutral-100">
                      <img
                        src={
                          item.imageUrl ||
                          item.images?.[0]?.url ||
                          item.images?.[0] ||
                          "/placeholder.png"
                        }
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* DETAILS */}

                    <div className="flex-1 min-w-0">

                      <div className="flex justify-between gap-3">

                        <div>
                          <h2 className="text-base font-medium text-neutral-900 sm:text-lg">
                            {item.name}
                          </h2>

                          {item.variantName && (
                            <p className="mt-1 text-sm text-neutral-500">
                              {item.variantName}
                            </p>
                          )}

                          <p className="mt-2 text-sm text-neutral-500">
                            {formatPrice(priceInNaira)}
                          </p>
                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="flex-shrink-0 transition text-neutral-400 hover:text-red-500"
                          title="Remove item"
                        >
                          <Trash2 size={19} />
                        </button>

                      </div>

                      {/* QUANTITY + TOTAL */}

                      <div className="flex items-center justify-between gap-4 mt-6">

                        <div className="flex items-center overflow-hidden border rounded-lg border-neutral-300">

                          <button
                            type="button"
                            onClick={() => handleDecrease(item)}
                            disabled={item.quantity <= 1}
                            className="flex items-center justify-center transition w-9 h-9 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="w-10 text-sm font-medium text-center">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleIncrease(item)}
                            className="flex items-center justify-center transition w-9 h-9 hover:bg-neutral-100"
                          >
                            <Plus size={15} />
                          </button>

                        </div>

                        <p className="font-semibold text-neutral-900">
                          {formatPrice(itemTotal)}
                        </p>

                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

          </div>

          {/* ================= ORDER SUMMARY ================= */}

          <div>
            <div className="p-5 bg-white border border-neutral-200 rounded-xl sm:p-6 lg:sticky lg:top-24">

              <h2 className="mb-6 text-lg font-semibold text-neutral-900">
                Order Summary
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-neutral-900">
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">
                    Delivery
                  </span>

                  <span className="text-neutral-500">
                    Calculated at checkout
                  </span>
                </div>

                <div className="pt-4 border-t border-neutral-200">

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900">
                      Total
                    </span>

                    <span className="text-xl font-bold text-neutral-900">
                      {formatPrice(total)}
                    </span>
                  </div>

                </div>

              </div>

              <Link
                to="/checkout"
                className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white py-3.5 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <div className="mt-5 text-center">
                <p className="text-xs text-neutral-500">
                  Secure checkout powered by Paystack
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;