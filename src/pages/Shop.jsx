// pages/Shop.jsx

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import ProductCard from "../components/ProductCard";
import { useParams, useNavigate } from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronRight,
  PackageOpen,
} from "lucide-react";

const Shop = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [showFilters, setShowFilters] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    texture: "",
    length: "",
    minPrice: "",
    maxPrice: "",
    availableOnly: false,
  });

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const snapshot = await getDocs(
          collection(db, "products")
        );

        const fetchedProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =====================================================
     HELPERS
  ===================================================== */

  const getMinPrice = (product) => {
    if (
      Array.isArray(product.variants) &&
      product.variants.length > 0
    ) {
      const prices = product.variants
        .map((variant) => Number(variant.price))
        .filter((price) => !Number.isNaN(price));

      if (prices.length > 0) {
        return Math.min(...prices);
      }
    }

    return Number(product.price) || 0;
  };

  const getAvailableStock = (product) => {
    if (
      Array.isArray(product.variants) &&
      product.variants.length > 0
    ) {
      return product.variants.some(
        (variant) => Number(variant.stock || 0) > 0
      );
    }

    return Number(product.stock || 0) > 0;
  };

  /* =====================================================
     FILTER + SORT PRODUCTS
  ===================================================== */

  const products = useMemo(() => {
    let filtered = [...allProducts];

    /* CATEGORY */

    if (category && category !== "all") {
      filtered = filtered.filter(
        (product) => product.category === category
      );
    }

    /* SEARCH */

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      filtered = filtered.filter((product) => {
        return (
          product.name?.toLowerCase().includes(query) ||
          product.description
            ?.toLowerCase()
            .includes(query) ||
          product.category
            ?.toLowerCase()
            .includes(query) ||
          product.texture
            ?.toLowerCase()
            .includes(query)
        );
      });
    }

    /* TEXTURE */

    if (selectedFilters.texture) {
      filtered = filtered.filter(
        (product) =>
          product.texture === selectedFilters.texture
      );
    }

    /* LENGTH */

    if (selectedFilters.length) {
      filtered = filtered.filter((product) =>
        product.variants?.some(
          (variant) =>
            variant.length === selectedFilters.length
        )
      );
    }

    /* MIN PRICE */

    if (selectedFilters.minPrice !== "") {
      filtered = filtered.filter(
        (product) =>
          getMinPrice(product) >=
          Number(selectedFilters.minPrice)
      );
    }

    /* MAX PRICE */

    if (selectedFilters.maxPrice !== "") {
      filtered = filtered.filter(
        (product) =>
          getMinPrice(product) <=
          Number(selectedFilters.maxPrice)
      );
    }

    /* AVAILABLE */

    if (selectedFilters.availableOnly) {
      filtered = filtered.filter((product) =>
        getAvailableStock(product)
      );
    }

    /* SORT */

    filtered.sort((a, b) => {
      if (sortBy === "price-low") {
        return getMinPrice(a) - getMinPrice(b);
      }

      if (sortBy === "price-high") {
        return getMinPrice(b) - getMinPrice(a);
      }

      if (sortBy === "most-popular") {
        return (
          Number(b.rating || 0) -
          Number(a.rating || 0)
        );
      }

      const getDate = (product) => {
        if (product.createdAt?.seconds) {
          return product.createdAt.seconds * 1000;
        }

        if (product.createdAt) {
          return new Date(product.createdAt).getTime();
        }

        return 0;
      };

      return getDate(b) - getDate(a);
    });

    return filtered;
  }, [
    allProducts,
    category,
    searchQuery,
    selectedFilters,
    sortBy,
  ]);

  /* =====================================================
     CATEGORY
  ===================================================== */

  const handleCategoryChange = (newCategory) => {
    if (newCategory === "all") {
      navigate("/shop");
    } else {
      navigate(`/category/${newCategory}`);
    }
  };

  /* =====================================================
     FILTER HELPERS
  ===================================================== */

  const updateFilter = (name, value) => {
    setSelectedFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      texture: "",
      length: "",
      minPrice: "",
      maxPrice: "",
      availableOnly: false,
    });

    setSearchQuery("");
  };

  const activeFilterCount =
    Object.values(selectedFilters).filter(
      (value) =>
        value !== "" &&
        value !== false &&
        value !== null &&
        value !== undefined
    ).length;

  /* =====================================================
     LOADING SKELETON
  ===================================================== */

  const ProductSkeleton = () => (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-neutral-200 rounded-sm mb-4" />

      <div className="w-3/4 h-4 mb-2 rounded bg-neutral-200" />

      <div className="w-1/3 h-4 rounded bg-neutral-200" />
    </div>
  );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-screen bg-white">

      {/* =================================================
          SHOP HEADER
      ================================================= */}

      <section className="border-b border-neutral-200">

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

          {/* Breadcrumb */}

          <div className="flex items-center gap-2 pt-8 text-xs tracking-widest uppercase text-neutral-400">

            <button
              onClick={() => navigate("/")}
              className="transition hover:text-black"
            >
              Home
            </button>

            <ChevronRight size={13} />

            <span className="text-neutral-900">
              Shop
            </span>

          </div>

          {/* Main Header */}

          <div className="py-10 sm:py-14">

            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4">
              The Dara Hair Collection
            </p>

            <h1 className="text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl text-neutral-900">
              Shop Hair
            </h1>

            <p className="max-w-2xl mt-5 text-sm leading-7 sm:text-base text-neutral-500">
              Discover premium wigs, bundles, closures,
              hair accessories and beauty essentials
              carefully selected for your look.
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          SEARCH + TOOLBAR
      ================================================= */}

      <section className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur border-neutral-200">

        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">

              <Search
                size={18}
                className="absolute -translate-y-1/2 left-4 top-1/2 text-neutral-400"
              />

              <input
                type="text"
                placeholder="Search wigs, bundles, closures..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full pr-10 text-sm transition bg-white border outline-none h-11 pl-11 border-neutral-300 focus:border-black"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute -translate-y-1/2 right-3 top-1/2 text-neutral-400 hover:text-black"
                >
                  <X size={16} />
                </button>
              )}

            </div>

            {/* ACTIONS */}

            <div className="flex gap-2">

              {/* CATEGORY */}

              <select
                value={category || "all"}
                onChange={(e) =>
                  handleCategoryChange(e.target.value)
                }
                className="px-3 text-sm bg-white border outline-none cursor-pointer h-11 sm:px-4 border-neutral-300"
              >
                <option value="all">
                  All Categories
                </option>

                <option value="braided-wig">
                  Braided Wig
                </option>

                <option value="curly-wig">
                  Curly Wig
                </option>

                <option value="straight-wig">
                  Straight Wig
                </option>

                <option value="hair-products">
                  Hair Products
                </option>

                <option value="tools">
                  Tools
                </option>

                <option value="others">
                  Others
                </option>
              </select>

              {/* FILTER */}

              <button
                onClick={() =>
                  setShowFilters(!showFilters)
                }
                className={`relative h-11 px-4 border flex items-center gap-2 text-sm transition ${
                  showFilters
                    ? "bg-black text-white border-black"
                    : "border-neutral-300 bg-white hover:border-black"
                }`}
              >
                <SlidersHorizontal size={16} />

                <span className="hidden sm:inline">
                  Filters
                </span>

                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-black text-[10px] font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* SORT */}

              <div className="relative">

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="pl-3 pr-8 text-sm bg-white border outline-none appearance-none cursor-pointer h-11 border-neutral-300"
                >
                  <option value="newest">
                    Newest
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="most-popular">
                    Most Popular
                  </option>
                </select>

                <ChevronDown
                  size={15}
                  className="absolute -translate-y-1/2 pointer-events-none right-2 top-1/2"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          FILTER PANEL
      ================================================= */}

      {showFilters && (
        <section className="border-b border-neutral-200 bg-neutral-50">

          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h3 className="text-sm font-semibold text-neutral-900">
                  Refine your selection
                </h3>

                <p className="mt-1 text-xs text-neutral-500">
                  Find exactly what you're looking for.
                </p>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs tracking-widest uppercase text-neutral-500 hover:text-black"
                >
                  Clear all
                </button>
              )}

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

              {/* TEXTURE */}

              <div>
                <label className="block mb-2 text-xs tracking-wider uppercase text-neutral-500">
                  Texture
                </label>

                <select
                  value={selectedFilters.texture}
                  onChange={(e) =>
                    updateFilter(
                      "texture",
                      e.target.value
                    )
                  }
                  className="w-full px-3 text-sm bg-white border outline-none h-11 border-neutral-300"
                >
                  <option value="">
                    All Textures
                  </option>

                  <option value="straight">
                    Straight
                  </option>

                  <option value="body-wave">
                    Body Wave
                  </option>

                  <option value="deep-wave">
                    Deep Wave
                  </option>

                  <option value="curly">
                    Curly
                  </option>

                  <option value="water-wave">
                    Water Wave
                  </option>
                </select>
              </div>

              {/* LENGTH */}

              <div>
                <label className="block mb-2 text-xs tracking-wider uppercase text-neutral-500">
                  Length
                </label>

                <select
                  value={selectedFilters.length}
                  onChange={(e) =>
                    updateFilter(
                      "length",
                      e.target.value
                    )
                  }
                  className="w-full px-3 text-sm bg-white border outline-none h-11 border-neutral-300"
                >
                  <option value="">
                    All Lengths
                  </option>

                  <option value="10">
                    10"
                  </option>

                  <option value="12">
                    12"
                  </option>

                  <option value="14">
                    14"
                  </option>

                  <option value="16">
                    16"
                  </option>

                  <option value="18">
                    18"
                  </option>

                  <option value="20">
                    20"
                  </option>

                  <option value="22">
                    22"
                  </option>

                  <option value="24">
                    24"
                  </option>

                  <option value="26">
                    26"
                  </option>

                  <option value="28">
                    28"
                  </option>

                  <option value="30">
                    30"
                  </option>
                </select>
              </div>

              {/* MIN PRICE */}

              <div>
                <label className="block mb-2 text-xs tracking-wider uppercase text-neutral-500">
                  Minimum Price
                </label>

                <input
                  type="number"
                  placeholder="₦0"
                  value={selectedFilters.minPrice}
                  onChange={(e) =>
                    updateFilter(
                      "minPrice",
                      e.target.value
                    )
                  }
                  className="w-full px-3 text-sm bg-white border outline-none h-11 border-neutral-300 focus:border-black"
                />
              </div>

              {/* MAX PRICE */}

              <div>
                <label className="block mb-2 text-xs tracking-wider uppercase text-neutral-500">
                  Maximum Price
                </label>

                <input
                  type="number"
                  placeholder="₦500,000"
                  value={selectedFilters.maxPrice}
                  onChange={(e) =>
                    updateFilter(
                      "maxPrice",
                      e.target.value
                    )
                  }
                  className="w-full px-3 text-sm bg-white border outline-none h-11 border-neutral-300 focus:border-black"
                />
              </div>

              {/* STOCK */}

              <label className="flex items-end">

                <div className="flex items-center w-full gap-3 px-3 bg-white border cursor-pointer h-11 border-neutral-300">

                  <input
                    type="checkbox"
                    checked={
                      selectedFilters.availableOnly
                    }
                    onChange={(e) =>
                      updateFilter(
                        "availableOnly",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 accent-black"
                  />

                  <span className="text-sm">
                    In stock only
                  </span>

                </div>

              </label>

            </div>

          </div>

        </section>
      )}

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <main className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-14">

        {/* PRODUCT COUNT */}

        <div className="flex items-center justify-between mb-8">

          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-1">
              Collection
            </p>

            <h2 className="text-xl font-medium sm:text-2xl text-neutral-900">
              {category
                ? category
                    .replaceAll("-", " ")
                    .replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    )
                : "All Products"}
            </h2>

          </div>

          {!loading && (
            <p className="text-xs sm:text-sm text-neutral-500">
              {products.length}{" "}
              {products.length === 1
                ? "product"
                : "products"}
            </p>
          )}

        </div>

        {/* LOADING */}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">

            {Array.from({ length: 8 }).map(
              (_, index) => (
                <ProductSkeleton key={index} />
              )
            )}

          </div>
        ) : products.length === 0 ? (

          /* EMPTY STATE */

          <div className="min-h-[400px] flex flex-col items-center justify-center text-center border border-dashed border-neutral-300">

            <PackageOpen
              size={42}
              strokeWidth={1}
              className="mb-5 text-neutral-400"
            />

            <h3 className="text-lg font-medium text-neutral-900">
              No products found
            </h3>

            <p className="max-w-sm mt-2 text-sm leading-6 text-neutral-500">
              We couldn't find anything matching
              your current search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="px-6 py-3 mt-6 text-xs tracking-widest text-white uppercase transition bg-black hover:bg-neutral-800"
            >
              Clear filters
            </button>

          </div>

        ) : (

          /* PRODUCT GRID */

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}

          </div>

        )}

      </main>

    </div>
  );
};

export default Shop;