import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";

import { db } from "../firebase/firebase.js";
import ProductCard from "../components/ProductCard";

import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Heart,
  Truck,
} from "lucide-react";

import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const productsRef = collection(db, "products");

        const q = query(
          productsRef,
          where("isActive", "==", true)
        );

        const snapshot = await getDocs(q);

        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =====================================================
  // FETCH ACTIVE CATEGORIES
  // =====================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const categoriesRef = collection(db, "categories");

        const q = query(
          categoriesRef,
          where("isActive", "==", true),
          limit(6)
        );

        const snapshot = await getDocs(q);

        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(items);
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // =====================================================
  // FEATURED PRODUCTS
  // =====================================================

  const featuredProducts = products
    .filter((product) => product.featured === true)
    .slice(0, 4);

  // =====================================================
  // NEW ARRIVALS
  // =====================================================

  const newArrivalProducts = products
    .filter((product) => product.newArrival === true)
    .slice(0, 4);

  // =====================================================
  // CATEGORY FALLBACK IMAGES
  // Replace with Cloudinary images later
  // =====================================================

  const categoryImages = [
    "https://i.pinimg.com/736x/52/90/68/52906809f75cf3ba4488c873a9a98fc5.jpg",
    "https://i.pinimg.com/736x/8c/50/db/8c50db8a654f8416ddbb0bb5f1786475.jpg",
    "https://i.pinimg.com/736x/7b/9b/2b/7b9b2b22779f9b09b7ad12c7b2040681.jpg",
    "https://i.pinimg.com/236x/a6/50/a9/a650a97e78c9ffb96f50037da0ac7ec6.jpg",
    "https://i.pinimg.com/736x/cc/f3/72/ccf3724ead4cba600a633c6857ed3e27.jpg",
  ];

  // =====================================================
  // WHATSAPP
  // =====================================================

  const whatsappNumber = "2348135881390";

  const whatsappMessage = encodeURIComponent(
    "Hello Dara Hair, I would like to make an enquiry about your hair products."
  );

  return (
    <div className="bg-white text-neutral-900">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid min-h-[650px] max-w-7xl lg:grid-cols-2 lg:min-h-[720px]">

          {/* LEFT CONTENT */}

          <div className="flex items-center px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
            <div className="max-w-xl">

              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-pink-400" />

                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-500">
                  The Dara Hair Collection
                </span>
              </div>

              <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
                Hair that
                <span className="block italic font-light text-pink-500">
                  defines you.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-neutral-500 sm:text-lg">
                Premium wigs crafted to elevate your
                everyday beauty, confidence and
                personal style.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/shop"
                  className="group inline-flex items-center justify-center gap-3 bg-pink-500 px-7 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-pink-600"
                >
                  Shop the collection

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center justify-center border border-pink-300 px-7 py-4 text-sm font-semibold uppercase tracking-wider text-neutral-900 transition hover:bg-pink-50"
                >
                  Discover Dara Hair
                </Link>

              </div>

              {/* Small trust points */}

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-pink-100 pt-6">

                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    className="text-pink-500"
                  />

                  <span className="text-xs text-neutral-500">
                    Secure shopping
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Sparkles
                    size={16}
                    className="text-pink-500"
                  />

                  <span className="text-xs text-neutral-500">
                    Premium quality
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* HERO IMAGE */}

          <div className="relative min-h-[500px] overflow-hidden bg-pink-50 lg:min-h-full">

            <img
              src="https://res.cloudinary.com/dzo14hk18/image/upload/v1791453931/dara_hero_hwy23j.jpg"
              alt="Dara Hair luxury collection"
              className="h-full w-full object-cover object-center transition duration-700 hover:scale-[1.02]"
            />

            {/* Pink label */}

            <div className="absolute bottom-6 left-6 bg-white/95 px-5 py-4 shadow-lg sm:bottom-8 sm:left-8">

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-pink-500">
                Dara Hair
              </p>

              <p className="mt-1 text-sm font-medium text-neutral-900">
                Beauty made effortless
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          BRAND INTRO
      ===================================================== */}

      <section className="border-y border-pink-100 bg-white">

        <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:py-28">

          <Sparkles
            size={22}
            className="mx-auto text-pink-500"
          />

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-pink-500">
            Beauty begins with confidence
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Luxury hair designed for the woman
            who knows her worth.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-500">
            At Dara Hair, we believe your hair should
            feel as beautiful as it looks. Explore
            carefully selected styles created to help
            you feel confident, effortless and
            unmistakably you.
          </p>

        </div>

      </section>

      {/* =====================================================
          SHOP BY CATEGORY
      ===================================================== */}

      <section className="bg-pink-50/60 py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          <div className="mb-10 flex items-end justify-between gap-5">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">
                Find your style
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                Shop by category
              </h2>

            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-2 text-sm font-medium text-neutral-900 transition hover:text-pink-500 sm:flex"
            >
              View all
              <ArrowRight size={16} />
            </Link>

          </div>

          {categoriesLoading ? (

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="aspect-[3/4] animate-pulse bg-pink-100"
                />
              ))}

            </div>

          ) : categories.length === 0 ? (

            <div className="border border-pink-100 bg-white py-16 text-center">

              <p className="text-sm text-neutral-500">
                Categories coming soon.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

              {categories.map((category, index) => (

                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden bg-pink-100"
                >

                  <img
                    src={
                      category.image ||
                      categoryImages[
                        index % categoryImages.length
                      ]
                    }
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  {/* Soft pink overlay */}

                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/50 via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">

                    <h3 className="text-base font-medium text-white sm:text-lg">
                      {category.name}
                    </h3>

                    <span className="mt-2 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white">
                      Shop now
                      <ArrowRight size={13} />
                    </span>

                  </div>

                </Link>

              ))}

            </div>

          )}

          <Link
            to="/shop"
            className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-neutral-900 sm:hidden"
          >
            View all categories
            <ArrowRight size={16} className="text-pink-500" />
          </Link>

        </div>

      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <section className="bg-white py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          <div className="mb-10 flex items-end justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">
                Curated for you
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                Our favourites
              </h2>

              <p className="mt-2 max-w-md text-sm text-neutral-500">
                Discover the styles our customers love
                most.
              </p>

            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-2 text-sm font-medium text-neutral-900 transition hover:text-pink-500 sm:flex"
            >
              Shop all
              <ArrowRight size={16} />
            </Link>

          </div>

          {loading ? (

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse"
                >
                  <div className="aspect-[4/5] bg-pink-50" />

                  <div className="mt-4 h-4 w-3/4 bg-pink-50" />

                  <div className="mt-2 h-4 w-1/3 bg-pink-50" />
                </div>
              ))}

            </div>

          ) : featuredProducts.length === 0 ? (

            <div className="border border-pink-100 py-16 text-center">

              <p className="text-sm text-neutral-500">
                Our featured collection is coming soon.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">

              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                />
              ))}

            </div>

          )}

          <div className="mt-10 text-center sm:hidden">

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-pink-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-pink-600 transition hover:bg-pink-50"
            >
              Shop all products

              <ArrowRight size={15} />
            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          EDITORIAL / BRAND SECTION
      ===================================================== */}

      <section className="bg-pink-50">

        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">

          {/* IMAGE */}

          <div className="min-h-[460px] lg:min-h-[620px]">

            <img
              src="https://res.cloudinary.com/dzo14hk18/image/upload/v1791462195/second_hero_h4nxsm.jpg"
              alt="Dara Hair beauty collection"
              className="h-full w-full object-cover"
            />

          </div>

          {/* CONTENT */}

          <div className="flex items-center px-7 py-16 sm:px-12 lg:px-16">

            <div className="max-w-lg">

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-500">
                The Dara Hair experience
              </p>

              <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-5xl">

                Your best look

                <span className="block italic font-light text-pink-500">
                  starts here.
                </span>

              </h2>

              <p className="mt-6 text-base leading-7 text-neutral-500">
                From sleek and sophisticated to soft and
                effortless, our collection is designed to
                complement every version of you.
              </p>

              <Link
                to="/shop"
                className="group mt-8 inline-flex items-center gap-3 border-b border-pink-400 pb-2 text-sm font-semibold uppercase tracking-wider text-neutral-900 transition hover:border-pink-600 hover:text-pink-600"
              >
                Explore the collection

                <ArrowRight
                  size={16}
                  className="text-pink-500 transition-transform group-hover:translate-x-1"
                />

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          NEW ARRIVALS
      ===================================================== */}

      <section className="bg-white py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          <div className="mb-10 flex items-end justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">
                Fresh styles
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                Just in
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Meet the latest additions to Dara Hair.
              </p>

            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-2 text-sm font-medium text-neutral-900 transition hover:text-pink-500 sm:flex"
            >
              See all
              <ArrowRight size={16} />
            </Link>

          </div>

          {loading ? (

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse"
                >

                  <div className="aspect-[4/5] bg-pink-50" />

                  <div className="mt-4 h-4 w-3/4 bg-pink-50" />

                  <div className="mt-2 h-4 w-1/3 bg-pink-50" />

                </div>
              ))}

            </div>

          ) : newArrivalProducts.length === 0 ? (

            <div className="border border-pink-100 bg-pink-50/40 py-16 text-center">

              <p className="text-sm text-neutral-500">
                New arrivals are coming soon.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">

              {newArrivalProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                />
              ))}

            </div>

          )}

          <div className="mt-10 text-center">

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-pink-500 px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-pink-600"
            >
              Shop the latest

              <ArrowRight size={15} />
            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          WHY DARA HAIR
      ===================================================== */}

      <section className="bg-pink-50/60 py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-500">
              Why Dara Hair
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Beauty without compromise.
            </h2>

          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            {/* QUALITY */}

            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">

                <Sparkles
                  size={20}
                  className="text-pink-500"
                />

              </div>

              <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-neutral-900">
                Premium Quality
              </h3>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Carefully selected styles made to
                elevate your look.
              </p>

            </div>

            {/* CONFIDENCE */}

            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">

                <Heart
                  size={20}
                  className="text-pink-500"
                />

              </div>

              <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-neutral-900">
                Made for You
              </h3>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Styles designed to make you feel
                confident and beautiful.
              </p>

            </div>

            {/* SECURITY */}

            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">

                <ShieldCheck
                  size={20}
                  className="text-pink-500"
                />

              </div>

              <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-neutral-900">
                Secure Shopping
              </h3>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Shop confidently with secure payment
                and checkout.
              </p>

            </div>

            {/* DELIVERY */}

            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">

                <Truck
                  size={20}
                  className="text-pink-500"
                />

              </div>

              <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-neutral-900">
                Reliable Service
              </h3>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                We're here to make your shopping
                experience simple.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="bg-white py-20 sm:py-28">

        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">

          <div className="mx-auto max-w-3xl rounded-3xl bg-pink-100 px-6 py-16 sm:px-12 sm:py-20">

            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-600">
              Your next look awaits
            </p>

            <h2 className="mt-5 text-4xl font-medium tracking-tight text-neutral-900 sm:text-6xl">

              Ready to find

              <span className="block italic font-light text-pink-500">
                your perfect hair?
              </span>

            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
              Explore the Dara Hair collection and
              discover a style that feels completely
              yours.
            </p>

            <Link
              to="/shop"
              className="group mt-8 inline-flex items-center gap-3 bg-pink-500 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-pink-600"
            >
              Shop now

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />

            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          FLOATING WHATSAPP
      ===================================================== */}

      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Dara Hair on WhatsApp"
        className="group fixed bottom-5 right-5 z-[60] flex items-center sm:bottom-7 sm:right-7"
      >

        <span className="mr-3 hidden rounded-full bg-pink-500 px-4 py-2 text-xs font-medium text-white shadow-lg transition-all duration-300 group-hover:block">
          Chat with us
        </span>

        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-white shadow-xl ring-4 ring-pink-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-pink-600">
          <MessageCircle
            size={24}
            strokeWidth={2}
          />
        </span>

      </a>

    </div>
  );
};

export default Home;