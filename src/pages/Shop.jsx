// pages/Shop.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";

const Shop = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      let q = query(collection(db, "products"));
      
      // Apply category filter
      if (category && category !== "all") {
        q = query(q, where("category", "==", category));
      }
      
      // Apply search filter (client-side since Firestore doesn't support full-text search easily)
      let filteredItems = [];
      
      // Apply sort and fetch
      if (sortBy === "price-low") {
        q = query(q, orderBy("variants.price", "asc"));
      } else if (sortBy === "price-high") {
        q = query(q, orderBy("variants.price", "desc"));
      } else if (sortBy === "most-popular") {
        q = query(q, orderBy("rating", "desc"));
      } else {
        q = query(q, orderBy("createdAt", "desc"));
      }
      
      const snapshot = await getDocs(q);
      filteredItems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      // Apply client-side search filter
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filteredItems = filteredItems.filter(
          (item) =>
            item.name.toLowerCase().includes(lowerQuery) ||
            (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
            (item.category && item.category.toLowerCase().includes(lowerQuery))
        );
      }
      
      // Apply client-side filters
      if (Object.keys(selectedFilters).length > 0) {
        filteredItems = filteredItems.filter((item) => {
          let matches = true;
          if (selectedFilters.texture && item.texture !== selectedFilters.texture) {
            matches = false;
          }
          if (selectedFilters.length && !item.variants?.some((v) => v.length === selectedFilters.length)) {
            matches = false;
          }
          if (selectedFilters.minPrice !== undefined && (item.variants?.reduce((acc, v) => Math.min(acc, v.price || Infinity), Infinity) || item.price || 0) < selectedFilters.minPrice) {
            matches = false;
          }
          if (selectedFilters.maxPrice !== undefined && (item.variants?.reduce((acc, v) => Math.max(acc, v.price || -Infinity), -Infinity) || item.price || 0) > selectedFilters.maxPrice) {
            matches = false;
          }
          if (selectedFilters.availableOnly) {
            const hasStock = item.variants?.some((v) => (v.stock || 0) > 0) || (item.stock || 0) > 0;
            if (!hasStock) matches = false;
          }
          return matches;
        });
      }
      
      setProducts(filteredItems);
    };

    fetchProducts();
  }, [category, searchQuery, selectedFilters, sortBy]);

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
              value={selectedFilters.category || "all"}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, category: e.target.value })}
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
      
      <h2 className="text-2xl font-bold text-center mb-6 text-primary-600">All Products</h2>
      {products.length === 0 ? (
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

export default Shop;