import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

import { auth, db } from "../firebase/firebase.js";

import logo from "../assets/images/dara-logo.jpg";
import cartIcon from "../assets/images/raphael--cart.svg";

import {
  Menu,
  X,
  ChevronDown,
  User,
  UserCircle,
  ShoppingBag,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);

  const accountRef = useRef(null);

  const cartItems = useSelector((state) => state.cart);
  const itemCount = cartItems.length;

  // =========================
  // AUTH USER
  // =========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // FETCH CATEGORIES
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(db, "categories");

        const q = query(
          categoriesRef,
          where("isActive", "==", true)
        );

        const snapshot = await getDocs(q);

        const categoryList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // =========================
  // CLOSE ACCOUNT DROPDOWN
  // WHEN CLICKING OUTSIDE
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================
  // CREATE CATEGORY SLUG
  // =========================
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  // =========================
  // CLOSE MENUS
  // =========================
  const closeMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsAccountOpen(false);
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    try {
      await signOut(auth);

      closeMenus();

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav className="bg-neutral-100 shadow-md relative z-50">

        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          {/* =========================
              LOGO
          ========================= */}
          <div className="flex items-center space-x-2">

            <Link
              to="/"
              onClick={closeMenus}
              className="flex items-center space-x-2"
            >
              <img
                src={logo}
                alt="Dara Hair Logo"
                className="w-8 h-8 rounded-full"
              />

              <span className="text-xl font-bold hover:text-pink-500">
                Dara Hair
              </span>
            </Link>

          </div>

          {/* =========================
              DESKTOP NAVBAR
          ========================= */}
          <div className="hidden md:flex items-center space-x-6">

            {/* HOME */}
            <Link
              to="/"
              className="hover:text-pink-500 transition"
            >
              Home
            </Link>

            {/* ABOUT */}
            <Link
              to="/about"
              className="hover:text-pink-500 transition"
            >
              About
            </Link>

            {/* =========================
                SHOP BY CATEGORIES
            ========================= */}
            <div className="relative">

              <button
                onClick={() =>
                  setIsDropdownOpen((prev) => !prev)
                }
                className="flex items-center gap-1 hover:text-pink-500 focus:outline-none"
              >
                Shop by Categories

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-10 left-0 w-56 bg-white shadow-lg border border-neutral-200 rounded-lg py-2 z-50">

                  {categories.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-neutral-500">
                      No categories available
                    </p>
                  ) : (
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${createSlug(
                          category.name
                        )}`}
                        onClick={closeMenus}
                        className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600"
                      >
                        {category.name}
                      </Link>
                    ))
                  )}

                </div>
              )}

            </div>

            {/* =========================
                ACCOUNT
            ========================= */}
            <div
              ref={accountRef}
              className="relative"
            >

              <button
                onClick={() =>
                  setIsAccountOpen((prev) => !prev)
                }
                className="p-1 hover:text-pink-500 transition"
                title="Account"
              >
                <UserCircle size={25} strokeWidth={1.8} />
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 top-10 w-52 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 z-50">

                  {user ? (
                    <>
                      {/* PROFILE */}
                      <Link
                        to="/profile"
                        onClick={closeMenus}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-pink-50 hover:text-pink-600"
                      >
                        <User size={18} />
                        <span>My Profile</span>
                      </Link>

                      {/* ORDERS */}
                      <Link
                        to="/orders"
                        onClick={closeMenus}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-pink-50 hover:text-pink-600"
                      >
                        <ShoppingBag size={18} />
                        <span>My Orders</span>
                      </Link>

                      <div className="border-t border-neutral-200 my-1" />

                      {/* LOGOUT */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* LOGIN */}
                      <Link
                        to="/login"
                        onClick={closeMenus}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-pink-50 hover:text-pink-600"
                      >
                        <LogIn size={18} />
                        <span>Login</span>
                      </Link>

                      {/* REGISTER */}
                      <Link
                        to="/register"
                        onClick={closeMenus}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-pink-50 hover:text-pink-600"
                      >
                        <UserPlus size={18} />
                        <span>Register</span>
                      </Link>
                    </>
                  )}

                </div>
              )}

            </div>

            {/* =========================
                CART
            ========================= */}
            <Link
              to="/cart"
              className="relative"
            >
              <img
                src={cartIcon}
                alt="Cart"
                className="w-6 h-6"
              />

              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

          </div>

          {/* =========================
              MOBILE MENU BUTTON
          ========================= */}
          <div className="md:hidden">

            <button
              onClick={() =>
                setIsMobileMenuOpen((prev) => !prev)
              }
              className="p-1"
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>

          </div>

        </div>

        {/* =========================
            MOBILE MENU
        ========================= */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-neutral-100 shadow p-4 space-y-2">

            {/* HOME */}
            <Link
              to="/"
              onClick={closeMenus}
              className="block hover:text-pink-500"
            >
              Home
            </Link>

            {/* ABOUT */}
            <Link
              to="/about"
              onClick={closeMenus}
              className="block hover:text-pink-500"
            >
              About
            </Link>

            {/* =========================
                MOBILE CATEGORIES
            ========================= */}
            <div>

              <p className="font-semibold mb-1">
                Shop by Categories
              </p>

              {categories.length === 0 ? (
                <p className="px-2 py-1 text-sm text-neutral-500">
                  No categories available
                </p>
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${createSlug(
                      category.name
                    )}`}
                    onClick={closeMenus}
                    className="block px-2 py-1 hover:bg-pink-100"
                  >
                    {category.name}
                  </Link>
                ))
              )}

            </div>

            {/* =========================
                MOBILE ACCOUNT
            ========================= */}
            <div className="border-t border-neutral-200 pt-3 mt-3">

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 py-2 hover:text-pink-500"
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/orders"
                    onClick={closeMenus}
                    className="flex items-center gap-3 py-2 hover:text-pink-500"
                  >
                    <ShoppingBag size={18} />
                    <span>My Orders</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenus}
                    className="flex items-center gap-3 py-2 hover:text-pink-500"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenus}
                    className="flex items-center gap-3 py-2 hover:text-pink-500"
                  >
                    <UserPlus size={18} />
                    <span>Register</span>
                  </Link>
                </>
              )}

            </div>

            {/* =========================
                MOBILE CART
            ========================= */}
            <Link
              to="/cart"
              onClick={closeMenus}
              className="flex items-center space-x-2 hover:text-pink-500"
            >
              <div className="relative">

                <img
                  src={cartIcon}
                  alt="Cart"
                  className="w-6 h-6"
                />

                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}

              </div>

              <span>Cart ({itemCount})</span>
            </Link>

          </div>
        )}

      </nav>

      {/* =========================
          DELIVERY NOTICE
      ========================= */}
      <div className="bg-pink-500 text-center text-sm py-2 font-medium text-white px-4">
        Delivery Of Ready Made Wigs Will Be Posted For Delivery Within 3–7 Working Days
      </div>
    </>
  );
};

export default Navbar;