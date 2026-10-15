
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { ArrowRight, MapPin, Phone, MessageCircle } from "lucide-react";

import { db } from "../firebase/firebase";
import logo from "../assets/images/dara-logo.jpg";

function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "categories"));

        const activeCategories = snapshot.docs
          .map((document) => ({
            id: document.id,
            ...document.data(),
          }))
          .filter((category) => category.isActive === true);

        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching footer categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const createSlug = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const currentYear = new Date().getFullYear();

  // const whatsappMessage = encodeURIComponent(
  //   "Hello Dara Hair, I would like to make an enquiry."
  // );

  return (
    <footer className="mt-16 border-t border-pink-100 bg-white text-neutral-800">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="Dara Hair"
                className="h-16 w-auto object-contain"
              />
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-neutral-500">
              Your beauty, your confidence. Discover beautiful wigs and
              quality hair designed to help you look and feel your best.
            </p>

            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-pink-600 transition hover:gap-3"
            >
              Explore our collection
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-neutral-500">
              <li>
                <Link
                  to="/"
                  className="transition hover:text-pink-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="transition hover:text-pink-600"
                >
                  About Dara Hair
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="transition hover:text-pink-600"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="transition hover:text-pink-600"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="transition hover:text-pink-600"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Shop Categories
            </h3>

            {categories.length > 0 ? (
              <ul className="space-y-3 text-sm text-neutral-500">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={`/category/${category.slug || createSlug(category.name)}`}
                      className="transition hover:text-pink-600"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-6 text-neutral-500">
                Explore our collection of beautiful hair and wigs.
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Get in Touch
            </h3>

            <ul className="space-y-4 text-sm text-neutral-500">
              <li className="flex items-start gap-3">
                <Phone
                  size={18}
                  className="mt-0.5 shrink-0 text-pink-500"
                />
                <a
                  href="tel:+2348135881390"
                  className="transition hover:text-pink-600"
                >
                  +234 813 588 1390
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-pink-500"
                />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>

            {/* <a
              href={`https://wa.me/2348135881390?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-pink-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-pink-600"
            >
              <MessageCircle size={18} />
              Chat with us
            </a> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-pink-100 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-6 text-neutral-500">
              © {currentYear} Dara Hair. All rights reserved.
            </p>

            <p className="text-xs text-neutral-500">
              Made with <span className="text-pink-500">♥</span> for your
              beauty and confidence.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
