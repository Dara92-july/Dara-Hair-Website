
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

import { auth, db } from "../firebase/firebase.js";
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
  const categoryRef = useRef(null);

  const cartItems = useSelector((state) => state.cart);
  const itemCount = cartItems.length;

  // AUTH USER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // FETCH ACTIVE CATEGORIES
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

  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
      }

      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
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

  // CREATE CATEGORY SLUG
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  // CLOSE MENUS
  const closeMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsAccountOpen(false);
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeMenus();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // DELIVERY ANNOUNCEMENT
  const deliveryMessage =
    "Ready-made wigs are dispatched within 1–4 working days.";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* MAIN NAVBAR */}
      <nav className="relative bg-neutral-100 shadow-md">
        <div
          className="
            mx-auto flex max-w-none items-center justify-between
            gap-3 
            lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4 lg:px-4
            lg:py-4
          "
        >
          {/* LOGO: LEFT */}
          <Link
            to="/"
            onClick={closeMenus}
            className="flex min-w-0 shrink-0 items-center lg:justify-self-start"
          >
            <img
              src="https://res.cloudinary.com/dzo14hk18/image/upload/v1792064118/dara_logo-removebg-preview_ndpjmy.png"
              alt="Dara Hair Logo"
              className="
                h-12 w-[170px] object-contain
                sm:h-14 sm:w-[200px]
              "
            />
          </Link>

          {/* DESKTOP NAVIGATION: CENTER */}
          <div className="hidden items-center justify-self-center gap-6 whitespace-nowrap lg:flex xl:gap-8">
            <Link
              to="/"
              onClick={closeMenus}
              className="font-medium text-neutral-800 transition hover:text-pink-500"
            >
              Home
            </Link>

            <Link
              to="/about"
              onClick={closeMenus}
              className="font-medium text-neutral-800 transition hover:text-pink-500"
            >
              About
            </Link>

            {/* SHOP BY CATEGORIES */}
            <div ref={categoryRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen((prev) => !prev);
                  setIsAccountOpen(false);
                }}
                aria-expanded={isDropdownOpen}
                className="flex items-center gap-1 font-medium text-neutral-800 transition hover:text-pink-500 focus:outline-none"
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
                <div className="absolute left-0 top-full z-50 mt-3 max-h-72 w-60 overflow-y-auto rounded-lg border border-pink-100 bg-white py-2 shadow-lg">
                  {categories.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-neutral-500">
                      No categories available
                    </p>
                  ) : (
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${
                          category.slug || createSlug(category.name)
                        }`}
                        onClick={closeMenus}
                        className="block px-4 py-2.5 text-sm text-neutral-700 transition hover:bg-pink-50 hover:text-pink-600"
                      >
                        {category.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ACCOUNT AND CART: RIGHT */}
          <div className="hidden items-center justify-self-end gap-5 lg:flex">
            {/* ACCOUNT */}
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsAccountOpen((prev) => !prev);
                  setIsDropdownOpen(false);
                }}
                aria-label="Account menu"
                aria-expanded={isAccountOpen}
                className="flex items-center justify-center rounded-full p-2 text-neutral-800 transition hover:bg-pink-50 hover:text-pink-500"
              >
                <UserCircle size={25} strokeWidth={1.8} />
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-52 rounded-lg border border-pink-100 bg-white py-2 shadow-lg">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={closeMenus}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 transition hover:bg-pink-50 hover:text-pink-600"
                      >
                        <User size={18} />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={closeMenus}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 transition hover:bg-pink-50 hover:text-pink-600"
                      >
                        <ShoppingBag size={18} />
                        <span>My Orders</span>
                      </Link>

                      <div className="my-1 border-t border-neutral-100" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
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
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 transition hover:bg-pink-50 hover:text-pink-600"
                      >
                        <LogIn size={18} />
                        <span>Login</span>
                      </Link>

                      <Link
                        to="/register"
                        onClick={closeMenus}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 transition hover:bg-pink-50 hover:text-pink-600"
                      >
                        <UserPlus size={18} />
                        <span>Register</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* CART */}
            <Link
              to="/cart"
              onClick={closeMenus}
              aria-label={`Shopping cart, ${itemCount} items`}
              className="relative rounded-full p-2 transition hover:bg-pink-50"
            >
              <img
                src={cartIcon}
                alt=""
                className="h-6 w-6"
              />

              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-xs text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={
              isMobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMobileMenuOpen}
            className="shrink-0 rounded-md p-2 text-neutral-800 transition hover:bg-pink-50 hover:text-pink-500 lg:hidden"
          >
            {isMobileMenuOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        {isMobileMenuOpen && (
          <div className="max-h-[70vh] space-y-3 overflow-y-auto border-t border-pink-100 bg-white px-5 py-4 shadow-lg lg:hidden">
            <Link
              to="/"
              onClick={closeMenus}
              className="block py-2 text-neutral-800 transition hover:text-pink-500"
            >
              Home
            </Link>

            <Link
              to="/about"
              onClick={closeMenus}
              className="block py-2 text-neutral-800 transition hover:text-pink-500"
            >
              About
            </Link>

            {/* MOBILE CATEGORIES */}
            <div className="border-t border-neutral-100 pt-3">
              <p className="mb-2 font-semibold text-neutral-900">
                Shop by Categories
              </p>

              {categories.length === 0 ? (
                <p className="px-2 py-2 text-sm text-neutral-500">
                  No categories available
                </p>
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${
                      category.slug || createSlug(category.name)
                    }`}
                    onClick={closeMenus}
                    className="block rounded-md px-3 py-2 text-sm text-neutral-700 transition hover:bg-pink-50 hover:text-pink-600"
                  >
                    {category.name}
                  </Link>
                ))
              )}
            </div>

            {/* MOBILE ACCOUNT LINKS */}
            <div className="space-y-1 border-t border-neutral-100 pt-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 py-2 transition hover:text-pink-500"
                  >
                    <User size={18} />
                    My Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={closeMenus}
                    className="flex items-center gap-3 py-2 transition hover:text-pink-500"
                  >
                    <ShoppingBag size={18} />
                    My Orders
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-2 text-red-600 transition hover:text-red-700"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenus}
                    className="flex items-center gap-3 py-2 transition hover:text-pink-500"
                  >
                    <LogIn size={18} />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenus}
                    className="flex items-center gap-3 py-2 transition hover:text-pink-500"
                  >
                    <UserPlus size={18} />
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE CART */}
            <Link
              to="/cart"
              onClick={closeMenus}
              className="flex items-center gap-3 border-t border-neutral-100 pt-4 transition hover:text-pink-500"
            >
              <div className="relative">
                <img
                  src={cartIcon}
                  alt=""
                  className="h-6 w-6"
                />

                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-xs text-white">
                    {itemCount}
                  </span>
                )}
              </div>

              <span>Cart ({itemCount})</span>
            </Link>
          </div>
        )}
      </nav>

      {/* MOVING DELIVERY ANNOUNCEMENT */}
      <div
        className="overflow-hidden bg-pink-500 py-2.5 text-sm font-medium text-white"
        role="region"
        aria-label="Delivery announcement"
      >
        <style>
          {`
            @keyframes daraHairMarquee {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }

            .dara-hair-marquee-track {
              display: flex;
              width: max-content;
              animation: daraHairMarquee 30s linear infinite;
              will-change: transform;
            }

            .dara-hair-marquee-track:hover {
              animation-play-state: paused;
            }

            @media (prefers-reduced-motion: reduce) {
              .dara-hair-marquee-track {
                animation: none;
                width: 100%;
                justify-content: center;
              }

              .dara-hair-marquee-copy {
                display: none;
              }
            }
          `}
        </style>

        <div className="dara-hair-marquee-track">
          {/* FIRST SET */}
          <div className="flex shrink-0 items-center">
            <span className="px-6 font-bold tracking-wider">
              DARA HAIR DELIVERY UPDATE
            </span>

            <span aria-hidden="true">✦</span>

            <span className="px-6">
              {deliveryMessage}
            </span>

            <span aria-hidden="true">✦</span>

            <span className="px-6">
              Thank you for shopping with Dara Hair!
            </span>

            <span className="px-6" aria-hidden="true">
              ✦
            </span>
          </div>

          {/* DUPLICATED SET FOR CONTINUOUS LOOP */}
          <div
            className="dara-hair-marquee-copy flex shrink-0 items-center"
            aria-hidden="true"
          >
            <span className="px-6 font-bold tracking-wider">
              DARA HAIR DELIVERY UPDATE
            </span>

            <span aria-hidden="true">✦</span>

            <span className="px-6">
              {deliveryMessage}
            </span>

            <span aria-hidden="true">✦</span>

            <span className="px-6">
              Thank you for shopping with Dara Hair!
            </span>

            <span className="px-6" aria-hidden="true">
              ✦
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
