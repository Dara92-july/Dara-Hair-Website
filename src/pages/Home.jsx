// pages/Home.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center">
        <div className="bg-gray-100 bg-opacity-50 w-full h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-5xl text-black font-bold mb-4">
            Welcome to Dara Hair
          </h1>
          <p className="text-lg md:text-xl text-black mb-6">
            Premium wigs & hair products crafted for beauty and confidence.
          </p>
          <Link
            to="/shop"
            className="bg-pink-600 px-6 py-3 rounded-lg text-black hover:bg-pink-700 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Link to see all products */}
        {products.length > 4 && (
          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
            >
              View All Products
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
