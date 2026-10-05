// src/pages/admin/products/AdminProducts.jsx

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  Star,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import productService from "../../../services/productService";

const categories = [
  "Wigs",
  "Bundles",
  "Closures",
  "Frontals",
  "Hair Products",
  "Tools",
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  stockQuantity: "",
  sku: "",
  category: "",
  images: [],
  featured: false,
  newArrival: false,
  isActive: true,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showDrawer, setShowDrawer] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const [imageInput, setImageInput] = useState("");

  const [previewIndex, setPreviewIndex] = useState({});

  // =========================
  // LOAD PRODUCTS
  // =========================

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await productService.getProducts();

      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
      alert("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // =========================
  // FORM INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // CHECKBOX
  // =========================

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // =========================
  // ADD IMAGE URL
  // =========================

  const addImage = () => {
    const trimmedUrl = imageInput.trim();

    if (!trimmedUrl) return;

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, trimmedUrl],
    }));

    setImageInput("");
  };

  // =========================
  // REMOVE IMAGE
  // =========================

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // =========================
  // MAKE IMAGE FRONT
  // =========================

  const makeFrontImage = (index) => {
    if (index === 0) return;

    setFormData((prev) => {
      const images = [...prev.images];

      const selectedImage = images[index];

      images.splice(index, 1);
      images.unshift(selectedImage);

      return {
        ...prev,
        images,
      };
    });
  };

  // =========================
  // OPEN ADD PRODUCT
  // =========================

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setImageInput("");
    setShowDrawer(true);
  };

  // =========================
  // OPEN EDIT PRODUCT
  // =========================

  const handleEditProduct = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ? product.price / 100 : "",
      discountPrice: product.discountPrice
        ? product.discountPrice / 100
        : "",
      stockQuantity: product.stockQuantity ?? "",
      sku: product.sku || "",
      category: product.category || "",
      images: product.images || [],
      featured: product.featured || false,
      newArrival: product.newArrival || false,
      isActive: product.isActive !== false,
    });

    setImageInput("");
    setShowDrawer(true);
  };

  // =========================
  // CLOSE DRAWER
  // =========================

  const closeDrawer = () => {
    if (saving) return;

    setShowDrawer(false);
    setEditingProduct(null);
    setFormData(emptyForm);
    setImageInput("");
  };

  // =========================
  // SUBMIT PRODUCT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!formData.price) {
      alert("Product price is required.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: formData.name.trim(),

        description: formData.description.trim(),

        // Store money in kobo
        price: Number(formData.price) * 100,

        discountPrice: formData.discountPrice
          ? Number(formData.discountPrice) * 100
          : null,

        stockQuantity: Number(formData.stockQuantity) || 0,

        sku: formData.sku.trim(),

        category: formData.category,

        images: formData.images,

        featured: formData.featured,

        newArrival: formData.newArrival,

        isActive: formData.isActive,
      };

      // EDIT
      if (editingProduct) {
        await productService.updateProduct(
          editingProduct.id,
          productData
        );

        alert("Product updated successfully.");
      }

      // CREATE
      else {
        await productService.createProduct(productData);

        alert("Product added successfully.");
      }

      await loadProducts();

      closeDrawer();
    } catch (error) {
      console.error("Failed to save product:", error);

      alert("Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      await productService.deleteProduct(product.id);

      setProducts((prev) =>
        prev.filter((item) => item.id !== product.id)
      );

      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Failed to delete product:", error);

      alert("Unable to delete product.");
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product.name?.toLowerCase().includes(searchText) ||
      product.sku?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // FORMAT PRICE
  // =========================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format((price || 0) / 100);
  };

  // =========================
  // STOCK STATUS
  // =========================

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        label: "Out of stock",
        className: "bg-red-100 text-red-700",
      };
    }

    if (stock < 10) {
      return {
        label: "Low stock",
        className: "bg-amber-100 text-amber-700",
      };
    }

    return {
      label: "In stock",
      className: "bg-green-100 text-green-700",
    };
  };

  // =========================
  // IMAGE SLIDER
  // =========================

  const nextImage = (productId, totalImages) => {
    setPreviewIndex((prev) => ({
      ...prev,
      [productId]:
        ((prev[productId] || 0) + 1) % totalImages,
    }));
  };

  const previousImage = (productId, totalImages) => {
    setPreviewIndex((prev) => ({
      ...prev,
      [productId]:
        ((prev[productId] || 0) - 1 + totalImages) %
        totalImages,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            Dara Hair
          </p>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your hair products, prices and inventory.
          </p>
        </div>

        <button
          onClick={handleAddProduct}
          className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />

          Add Product
        </button>

      </div>

      {/* =========================
          STATS
      ========================= */}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {products.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Featured
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {
              products.filter(
                (product) => product.featured
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            New Arrivals
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {
              products.filter(
                (product) => product.newArrival
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Out of Stock
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {
              products.filter(
                (product) =>
                  Number(product.stockQuantity) === 0
              ).length
            }
          </p>
        </div>

      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products, SKU or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
          />

        </div>

      </div>

      {/* =========================
          PRODUCTS
      ========================= */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-sm text-gray-500">
              Loading products...
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (

          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">

            <Package
              size={42}
              className="mb-4 text-gray-300"
            />

            <h3 className="text-lg font-semibold text-gray-900">
              No products found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "Try another search."
                : "Start by adding your first product."}
            </p>

            {!search && (
              <button
                onClick={handleAddProduct}
                className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
              >
                Add Product
              </button>
            )}

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="border-b border-gray-100 bg-gray-50">

                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    SKU
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredProducts.map((product) => {

                  const images = product.images || [];

                  const currentImage =
                    images[
                      previewIndex[product.id] || 0
                    ];

                  const stockStatus =
                    getStockStatus(
                      Number(product.stockQuantity)
                    );

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* PRODUCT */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">

                            {currentImage ? (
                              <img
                                src={currentImage}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <ImageIcon size={22} />
                              </div>
                            )}

                            {images.length > 1 && (
                              <>
                                <button
                                  onClick={() =>
                                    previousImage(
                                      product.id,
                                      images.length
                                    )
                                  }
                                  className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1 text-white"
                                >
                                  <ChevronLeft size={12} />
                                </button>

                                <button
                                  onClick={() =>
                                    nextImage(
                                      product.id,
                                      images.length
                                    )
                                  }
                                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1 text-white"
                                >
                                  <ChevronRight size={12} />
                                </button>
                              </>
                            )}

                          </div>

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <p className="max-w-[250px] truncate font-semibold text-gray-900">
                                {product.name}
                              </p>

                              {product.featured && (
                                <Star
                                  size={14}
                                  className="fill-yellow-400 text-yellow-400"
                                />
                              )}

                            </div>

                            <p className="mt-1 text-xs text-gray-500">
                              {product.category}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* SKU */}

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {product.sku || "—"}
                      </td>

                      {/* PRICE */}

                      <td className="px-6 py-5">

                        <p className="font-semibold text-gray-900">
                          {formatPrice(product.price)}
                        </p>

                        {product.discountPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(product.discountPrice)}
                          </p>
                        )}

                      </td>

                      {/* STOCK */}

                      <td className="px-6 py-5">

                        <p className="font-medium text-gray-900">
                          {product.stockQuantity || 0}
                        </p>

                        <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">

                          <div
                            className={`h-full ${
                              product.stockQuantity === 0
                                ? "bg-red-500"
                                : product.stockQuantity < 10
                                ? "bg-amber-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                Number(
                                  product.stockQuantity
                                ) * 5,
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stockStatus.className}`}
                        >
                          {stockStatus.label}
                        </span>

                        {!product.isActive && (
                          <span className="ml-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            Inactive
                          </span>
                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              handleEditProduct(product)
                            }
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteProduct(product)
                            }
                            className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =========================
          ADD / EDIT DRAWER
      ========================= */}

      {showDrawer && (
        <div className="fixed inset-0 z-50">

          {/* OVERLAY */}

          <div
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/40"
          />

          {/* DRAWER */}

          <div className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">

            {/* DRAWER HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5">

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Dara Hair
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

              </div>

              <button
                onClick={closeDrawer}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >

              {/* PRODUCT NAME */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Bone Straight Human Hair Wig"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the hair..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />

              </div>

              {/* PRICE */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Price (₦)
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="150000"
                    min="0"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Discount Price (₦)
                  </label>

                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    placeholder="Optional"
                    min="0"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                </div>

              </div>

              {/* STOCK + SKU */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="10"
                    min="0"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    SKU
                  </label>

                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="DH-BS-001"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                </div>

              </div>

              {/* CATEGORY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                >

                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}

                </select>

              </div>

              {/* IMAGES */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm font-semibold text-gray-700">
                    Product Images
                  </label>

                  <span className="text-xs text-gray-400">
                    {formData.images.length} image(s)
                  </span>

                </div>

                <div className="flex gap-2">

                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) =>
                      setImageInput(e.target.value)
                    }
                    placeholder="Paste Cloudinary image URL"
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                  <button
                    type="button"
                    onClick={addImage}
                    className="rounded-xl bg-black px-4 text-sm font-semibold text-white"
                  >
                    Add
                  </button>

                </div>

                {/* IMAGE PREVIEWS */}

                {formData.images.length > 0 && (

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">

                    {formData.images.map((image, index) => (

                      <div
                        key={`${image}-${index}`}
                        className="relative overflow-hidden rounded-xl border border-gray-200"
                      >

                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="h-36 w-full object-cover"
                        />

                        {/* FRONT */}

                        {index === 0 && (
                          <span className="absolute left-2 top-2 rounded-full bg-black px-2 py-1 text-[10px] font-bold text-white">
                            FRONT
                          </span>
                        )}

                        {index === 1 && (
                          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-black shadow">
                            BACK
                          </span>
                        )}

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(index)
                          }
                          className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white"
                        >
                          <X size={13} />
                        </button>

                        {/* MAKE FRONT */}

                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              makeFrontImage(index)
                            }
                            className="absolute bottom-2 left-2 rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-gray-700 shadow"
                          >
                            Make Front
                          </button>
                        )}

                      </div>

                    ))}

                  </div>

                )}

                <p className="mt-2 text-xs text-gray-400">
                  The first image will be the front image.
                  The second image will be the back image.
                </p>

              </div>

              {/* OPTIONS */}

              <div className="space-y-3 rounded-2xl bg-gray-50 p-4">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Featured Product
                    </p>

                    <p className="text-xs text-gray-500">
                      Display this product in featured sections.
                    </p>
                  </div>

                </label>

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    name="newArrival"
                    checked={formData.newArrival}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      New Arrival
                    </p>

                    <p className="text-xs text-gray-500">
                      Display this product as a new arrival.
                    </p>
                  </div>

                </label>

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Active Product
                    </p>

                    <p className="text-xs text-gray-500">
                      Allow customers to see this product.
                    </p>
                  </div>

                </label>

              </div>

              {/* BUTTONS */}

              <div className="sticky bottom-0 -mx-6 border-t bg-white px-6 py-4">

                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={closeDrawer}
                    disabled={saving}
                    className="flex-1 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingProduct
                      ? "Update Product"
                      : "Create Product"}
                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminProducts;