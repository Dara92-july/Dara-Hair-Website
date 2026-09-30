// pages/Shop.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import ProductCard from "../components/ProductCard";
import { useParams, useNavigate } from "react-router-dom";

const Shop = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch base collection (filters and sorts applied safely client-side)
        const snapshot = await getDocs(collection(db, "products"));
        let fetchedItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 1. Apply category filter
        if (category && category !== "all") {
          fetchedItems = fetchedItems.filter(
            (item) => item.category === category
          );
        }

        // 2. Apply search query filter
        if (searchQuery.trim()) {
          const lowerQuery = searchQuery.toLowerCase();
          fetchedItems = fetchedItems.filter(
            (item) =>
              item.name?.toLowerCase().includes(lowerQuery) ||
              item.description?.toLowerCase().includes(lowerQuery) ||
              item.category?.toLowerCase().includes(lowerQuery)
          );
        }

        // 3. Apply custom client-side filters
        if (Object.keys(selectedFilters).length > 0) {
          fetchedItems = fetchedItems.filter((item) => {
            let matches = true;

            if (selectedFilters.texture && item.texture !== selectedFilters.texture) {
              matches = false;
            }

            if (
              selectedFilters.length &&
              !item.variants?.some((v) => v.length === selectedFilters.length)
            ) {
              matches = false;
            }

            // Calculate min/max price considering variants or base price
            const minProductPrice =
              item.variants?.length > 0
                ? Math.min(...item.variants.map((v) => v.price || Infinity))
                : item.price || 0;

            if (
              selectedFilters.minPrice !== undefined &&
              minProductPrice < selectedFilters.minPrice
            ) {
              matches = false;
            }

            if (
              selectedFilters.maxPrice !== undefined &&
              minProductPrice > selectedFilters.maxPrice
            ) {
              matches = false;
            }

            if (selectedFilters.availableOnly) {
              const hasStock =
                item.variants?.some((v) => (v.stock || 0) > 0) ||
                (item.stock || 0) > 0;
              if (!hasStock) matches = false;
            }

            return matches;
          });
        }

        // 4. Apply sorting client-side
        fetchedItems.sort((a, b) => {
          const getMinPrice = (item) =>
            item.variants?.length > 0
              ? Math.min(...item.variants.map((v) => v.price || Infinity))
              : item.price || 0;

          if (sortBy === "price-low") {
            return getMinPrice(a) - getMinPrice(b);
          } else if (sortBy === "price-high") {
            return getMinPrice(b) - getMinPrice(a);
          } else if (sortBy === "most-popular") {
            return (b.rating || 0) - (a.rating || 0);
          } else {
            // Default: newest
            const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0);
            return dateB - dateA;
          }
        });

        setProducts(fetchedItems);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery, sortBy, JSON.stringify(selectedFilters)]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    if (newCategory === "all") {
      navigate("/shop");
    } else {
      navigate(`/shop/${newCategory}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="bg-neutral-100 p-4 rounded-md mb-6 shadow-sm">
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="sr-only">Search</label>
            <input
              type="text"
              placeholder="Search wigs, bundles, closures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Category</p>
            <select
              value={category || "all"}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="all">All Categories</option>
              <option value="braided-wig">Braided Wig</option>
              <option value="curly-wig">Curly Wig</option>
              <option value="straight-wig">Straight Wig</option>
              <option value="hair-products">Hair Products</option>
              <option value="tools">Tools</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Sort by</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="most-popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 text-primary-600">
        All Products
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;