import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/firebase.js";

import logo from "../assets/images/dara-logo.jpg";

const Footer = () => {
  const [categories, setCategories] = useState([]);

  // =========================
  // FETCH ACTIVE CATEGORIES
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
  // CREATE CATEGORY SLUG
  // =========================
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  return (
    <footer className="bg-neutral-100 mt-10">

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">

        {/* =========================
            LOGO & ABOUT
        ========================= */}
        <div className="text-center md:text-left">

          <div className="flex justify-center md:justify-start items-center space-x-2 mb-3">

            <img
              src={logo}
              alt="Dara Hair Logo"
              className="w-10 h-10 rounded-full"
            />

            <span className="text-lg font-bold">
              Dara Hair
            </span>

          </div>

          <p className="text-neutral-700 max-w-xs mx-auto md:mx-0">
            Premium quality wigs and hair products to help you look your best
            every day. Affordable, stylish, and delivered with care.
          </p>

        </div>

        {/* =========================
            QUICK LINKS
        ========================= */}
        <div className="text-center md:text-left">

          <h3 className="font-semibold mb-3">
            Quick Links
          </h3>

          <ul className="space-y-2">

            <li>
              <Link
                to="/"
                className="hover:text-pink-500 transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="hover:text-pink-500 transition"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/cart"
                className="hover:text-pink-500 transition"
              >
                Cart
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="hover:text-pink-500 transition"
              >
                My Profile
              </Link>
            </li>

            <li>
              <Link
                to="/orders"
                className="hover:text-pink-500 transition"
              >
                My Orders
              </Link>
            </li>

          </ul>

        </div>

        {/* =========================
            CATEGORIES
        ========================= */}
        <div className="text-center md:text-left">

          <h3 className="font-semibold mb-3">
            Categories
          </h3>

          <ul className="space-y-2">

            {categories.length === 0 ? (
              <li className="text-neutral-500">
                No categories available
              </li>
            ) : (
              categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${createSlug(category.name)}`}
                    className="hover:text-pink-500 transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))
            )}

          </ul>

        </div>

        {/* =========================
            CONTACT
        ========================= */}
        <div className="text-center md:text-left">

          <h3 className="font-semibold mb-3">
            Contact Us
          </h3>

          <ul className="space-y-2 text-neutral-700">

            <li>
              📞 +234 813 588 1390
            </li>

            <li>
              📍 Lagos, Nigeria
            </li>

          </ul>

        </div>

      </div>

      {/* =========================
          BOTTOM BAR
      ========================= */}
      <div className="bg-pink-500 text-white text-center text-sm py-3">
        © {new Date().getFullYear()} Dara Hair and Extensions. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;