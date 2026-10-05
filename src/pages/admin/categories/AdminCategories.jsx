import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";

import {
  Plus,
  Pencil,
  Trash2,
  X,
  Folder,
} from "lucide-react";

import { db } from "../../../firebase/firebase.js";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "categories"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      setCategories(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
      isActive: true,
    });

    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      description: category.description || "",
      isActive: category.isActive ?? true,
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    try {
      setSaving(true);

      if (editingCategory) {
        await updateDoc(doc(db, "categories", editingCategory.id), {
          name: formData.name.trim(),
          description: formData.description.trim(),
          isActive: formData.isActive,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "categories"), {
          name: formData.name.trim(),
          description: formData.description.trim(),
          isActive: formData.isActive,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setShowModal(false);
      await fetchCategories();
    } catch (error) {
      console.error("Category save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "categories", id));
      await fetchCategories();
    } catch (error) {
      console.error("Category delete error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Categories
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage your product categories.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* CATEGORIES */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-12 text-center text-sm text-neutral-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center">
            <Folder
              size={40}
              className="mx-auto text-neutral-300"
            />

            <p className="mt-4 font-medium text-neutral-700">
              No categories yet
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              Create your first product category.
            </p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                    <Folder size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {category.name}
                    </h3>

                    <span
                      className={`text-xs ${
                        category.isActive
                          ? "text-green-600"
                          : "text-neutral-400"
                      }`}
                    >
                      {category.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(category)}
                    className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() => handleDelete(category.id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-sm text-neutral-500">
                {category.description || "No description"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <h2 className="font-semibold text-neutral-900">
                {editingCategory
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Category Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Wigs"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Category description..."
                  className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-pink-500"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 accent-pink-500"
                />

                Active category
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-pink-500 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-300"
              >
                {saving
                  ? "Saving..."
                  : editingCategory
                  ? "Update Category"
                  : "Create Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;