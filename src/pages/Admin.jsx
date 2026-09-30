import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useEffect, useState } from "react";
import { Trash2, Plus, Package } from "lucide-react";

import { db } from "../firebase/firebase.js";
import { useAuth } from "../context/AuthContexts.jsx";

const initialForm = {
  name: "",
  imageUrl: "",
  price: "",
  description: "",
  category: "",
};

const Admin = () => {
  const { profile } = useAuth();

  const [formData, setFormData] = useState(initialForm);
  const [products, setProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setErrorMessage("");

      const snapshot = await getDocs(
        collection(db, "products")
      );

      const items = snapshot.docs.map((productDoc) => ({
        id: productDoc.id,
        ...productDoc.data(),
      }));

      setProducts(items);
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage("Unable to load products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.imageUrl.trim() ||
      !formData.price ||
      !formData.category
    ) {
      setErrorMessage(
        "Please fill in all required product fields."
      );

      return;
    }

    const price = Number(formData.price);

    if (Number.isNaN(price) || price <= 0) {
      setErrorMessage("Please enter a valid price.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await addDoc(collection(db, "products"), {
        name: formData.name.trim(),
        imageUrl: formData.imageUrl.trim(),
        price,
        description: formData.description.trim(),
        category: formData.category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setFormData(initialForm);

      await fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      setErrorMessage("Unable to add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "products", id));

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      setErrorMessage("Unable to delete product.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-pink-600 font-medium">
            Admin Dashboard
          </p>

          <h1 className="text-3xl font-bold text-neutral-900 mt-1">
            Dara Hair
          </h1>

          <p className="text-neutral-500 mt-1">
            Welcome, {profile?.name || "Admin"}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-[380px_1fr] gap-8">

          {/* Add Product */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                <Plus size={20} />
              </div>

              <div>
                <h2 className="font-bold text-lg">
                  Add Product
                </h2>

                <p className="text-sm text-neutral-500">
                  Add a new hair product
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name *
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Body Wave Wig"
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL *
                </label>

                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Price *
                </label>

                <input
                  type="number"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="120000"
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 outline-none focus:border-pink-500"
                >
                  <option value="">
                    Select Category
                  </option>

                  <option value="wigs">
                    Wigs
                  </option>

                  <option value="bundles">
                    Bundles
                  </option>

                  <option value="closures">
                    Closures
                  </option>

                  <option value="frontals">
                    Frontals
                  </option>

                  <option value="hair-products">
                    Hair Products
                  </option>

                  <option value="tools">
                    Tools & Accessories
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the product..."
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 outline-none focus:border-pink-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-3 rounded-lg transition"
              >
                {isSubmitting
                  ? "Adding Product..."
                  : "Add Product"}
              </button>
            </form>
          </div>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold">
                  Products
                </h2>

                <p className="text-sm text-neutral-500">
                  {products.length} product
                  {products.length !== 1 ? "s" : ""}
                </p>
              </div>

              <Package
                size={24}
                className="text-neutral-400"
              />
            </div>

            {loadingProducts ? (
              <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center">
                <p className="text-neutral-500">
                  Loading products...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center">
                <p className="text-neutral-500">
                  No products yet.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-neutral-200 rounded-xl overflow-hidden"
                  >
                    <div className="aspect-square bg-neutral-100">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <p className="font-semibold text-neutral-900">
                        {product.name}
                      </p>

                      <p className="text-pink-600 font-semibold mt-1">
                        ₦
                        {Number(product.price || 0).toLocaleString(
                          "en-NG"
                        )}
                      </p>

                      <p className="text-xs text-neutral-500 mt-2">
                        {product.category}
                      </p>

                      {product.description && (
                        <p className="text-sm text-neutral-500 mt-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <button
                        onClick={() =>
                          handleDelete(product.id)
                        }
                        className="mt-4 flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;