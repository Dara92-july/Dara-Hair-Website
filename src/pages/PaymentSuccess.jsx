import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, ShoppingBag } from "lucide-react";
import { useDispatch } from "react-redux";

import { clearCart } from "../store/slice";
import paymentService from "../services/paymentService";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [status, setStatus] = useState("verifying");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("error");
        return;
      }

      try {
        const response =
          await paymentService.verify(reference);

        const paymentData = response?.data?.data;

        if (
          response?.data?.status &&
          paymentData?.paymentStatus === "paid"
        ) {
          setOrderNumber(
            paymentData.orderNumber
          );

          // Clear cart only after payment
          // has been successfully verified
          dispatch(clearCart());

          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error(
          "Payment verification failed:",
          error
        );

        setStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams, dispatch]);

  // =====================================================
  // VERIFYING
  // =====================================================

  if (status === "verifying") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2
            size={48}
            className="mx-auto mb-5 animate-spin text-neutral-800"
          />

          <h1 className="text-2xl font-semibold text-neutral-900">
            Verifying your payment...
          </h1>

          <p className="mt-2 text-neutral-500">
            Please wait while we confirm your
            payment.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (status === "error") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
            <span className="text-2xl text-red-600">
              !
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-neutral-900">
            We couldn't verify your payment
          </h1>

          <p className="mt-3 text-neutral-500">
            Your payment may still be processing.
            Please contact us if you were charged.
          </p>

          <div className="flex flex-col justify-center gap-3 mt-7 sm:flex-row">
            <Link
              to="/shop"
              className="px-6 py-3 text-white transition bg-black rounded-lg hover:bg-neutral-800"
            >
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="px-6 py-3 transition border rounded-lg border-neutral-300 hover:bg-neutral-50"
            >
              Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // SUCCESS
  // =====================================================

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">
          <CheckCircle
            size={48}
            className="text-green-600"
          />
        </div>

        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500 mb-3">
          Payment Confirmed
        </p>

        <h1 className="text-3xl font-semibold sm:text-4xl text-neutral-900">
          Thank you for your order!
        </h1>

        <p className="mt-4 leading-relaxed text-neutral-600">
          Your payment has been successfully
          verified and your order has been received.
        </p>

        {orderNumber && (
          <div className="p-5 mt-6 border bg-neutral-50 border-neutral-200 rounded-xl">
            <p className="text-sm text-neutral-500">
              Your order number
            </p>

            <p className="mt-1 text-lg font-semibold text-neutral-900">
              {orderNumber}
            </p>
          </div>
        )}

        <div className="flex flex-col justify-center gap-3 mt-8 sm:flex-row">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white transition bg-black rounded-lg hover:bg-neutral-800"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>

          <Link
            to="/profile"
            className="px-6 py-3 transition border rounded-lg border-neutral-300 hover:bg-neutral-50"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;