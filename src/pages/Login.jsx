import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "../firebase/firebase.js";
import { db } from "../firebase/firebase.js";
import { Eye, EyeOff } from "lucide-react";
import { setCart } from "../store/slice"; 

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Min 6 characters").required("Required"),
    confirmPassword: !isLogin
      ? Yup.string()
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required("Confirm Password is required")
      : Yup.string().notRequired(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
   onSubmit: async ({ email, password }) => {
  try {
    let userCredential;

    if (isLogin) {
      // 🔐 Login
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } else {
      // 🆕 Signup
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    }

    const uid = userCredential.user.uid;

    // 🔁 Check if cart exists in Firestore
    const cartRef = doc(db, "carts", uid);
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      // 👇 Firestore cart found → Replace Redux cart
      const userCart = cartDoc.data().items || [];
      dispatch(setCart(userCart));
    } else {
      // ⬆️ No Firestore cart → Save current Redux cart
      await setDoc(cartRef, { items: cart });
    }

    navigate("/checkout");
  } catch (err) {
    alert(err.message);
  }
}
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded shadow"
      >
        <h2 className="text-xl font-bold mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-2 rounded"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        {formik.errors.email && formik.touched.email && (
          <div className="text-red-500 text-sm mb-2">{formik.errors.email}</div>
        )}

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="border p-2 w-full rounded"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <div
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>
        {formik.errors.password && formik.touched.password && (
          <div className="text-red-500 text-sm mb-2">{formik.errors.password}</div>
        )}

        {!isLogin && (
          <div className="relative mb-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="border p-2 w-full rounded"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
            />
            <div
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="bg-pink-500 text-white py-2 w-full rounded hover:bg-pink-600"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          className="text-sm text-blue-500 mt-4 text-center cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
};

export default Login;
