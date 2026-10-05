import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase.js";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const productsRef = collection(db, "products");

        // Get only active products
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

  // =========================
  // FEATURED PRODUCTS
  // =========================
  const featuredProducts = products
    .filter((product) => product.featured === true)
    .slice(0, 4);

  // =========================
  // NEW ARRIVALS
  // =========================
  const newArrivalProducts = products
    .filter((product) => product.newArrival === true)
    .slice(0, 4);

  return (
    <div>
      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="relative flex h-[60vh] items-center justify-center text-center">
        <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-100 bg-opacity-50 px-4">
          <h1 className="mb-4 text-4xl font-bold text-black md:text-5xl">
            Welcome to Dara Hair
          </h1>

          <p className="mb-6 max-w-2xl text-lg text-black md:text-xl">
            Premium wigs & hair products crafted for beauty and confidence.
          </p>

          <Link
            to="/shop"
            className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition hover:bg-primary-700"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* =========================
          LOADING
      ========================= */}
      {loading ? (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="py-12 text-center text-gray-500">
            Loading products...
          </div>
        </section>
      ) : (
        <>
          {/* =========================
              FEATURED PRODUCTS
          ========================= */}
          <section className="mx-auto max-w-7xl px-4 py-12">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Featured Products
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Explore some of our most popular products.
              </p>
            </div>

            {featuredProducts.length === 0 ? (
              <div className="rounded-lg bg-gray-50 py-12 text-center">
                <p className="text-gray-500">
                  No featured products available yet.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                    />
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link
                    to="/shop"
                    className="inline-block rounded-lg bg-primary-600 px-6 py-2.5 font-medium text-white transition hover:bg-primary-700"
                  >
                    View All Products
                  </Link>
                </div>
              </>
            )}
          </section>

          {/* =========================
              NEW ARRIVALS
          ========================= */}
          <section className="bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-12">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  New Arrivals
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Check out our latest additions.
                </p>
              </div>

              {newArrivalProducts.length === 0 ? (
                <div className="rounded-lg bg-white py-12 text-center">
                  <p className="text-gray-500">
                    No new arrivals available yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                    {newArrivalProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        {...product}
                      />
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <Link
                      to="/shop"
                      className="inline-block rounded-lg border border-primary-600 px-6 py-2.5 font-medium text-primary-600 transition hover:bg-primary-600 hover:text-white"
                    >
                      Shop All Products
                    </Link>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* =========================
              EMPTY STORE MESSAGE
          ========================= */}
          {products.length === 0 && (
            <section className="mx-auto max-w-7xl px-4 py-16">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  No products available
                </h2>

                <p className="mt-2 text-gray-500">
                  Please check back soon for our latest products.
                </p>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Home;