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

  /* =====================================================
     CREATE SLUG
  ===================================================== */

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  /* =====================================================
     FETCH CATEGORIES
  ===================================================== */

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
      console.error(
        "Error fetching categories:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* =====================================================
     OPEN ADD MODAL
  ===================================================== */

  const openAddModal = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
      isActive: true,
    });

    setShowModal(true);
  };

  /* =====================================================
     OPEN EDIT MODAL
  ===================================================== */

  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      description: category.description || "",
      isActive: category.isActive ?? true,
    });

    setShowModal(true);
  };

  /* =====================================================
     HANDLE FORM
  ===================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryName = formData.name.trim();

    if (!categoryName) {
      return;
    }

    try {
      setSaving(true);

      const slug = createSlug(categoryName);

      if (editingCategory) {
        await updateDoc(
          doc(
            db,
            "categories",
            editingCategory.id
          ),
          {
            name: categoryName,
            slug,
            description:
              formData.description.trim(),
            isActive: formData.isActive,
            updatedAt: serverTimestamp(),
          }
        );
      } else {
        await addDoc(
          collection(db, "categories"),
          {
            name: categoryName,
            slug,
            description:
              formData.description.trim(),
            isActive: formData.isActive,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }

      setShowModal(false);

      await fetchCategories();
    } catch (error) {
      console.error(
        "Category save error:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, "categories", id)
      );

      await fetchCategories();
    } catch (error) {
      console.error(
        "Category delete error:",
        error
      );
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Categories
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage the categories used across
            your store.
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

      {/* CATEGORY GRID */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {loading ? (

          <div className="py-12 text-sm text-center col-span-full text-neutral-500">
            Loading categories...
          </div>

        ) : categories.length === 0 ? (

          <div className="py-16 text-center bg-white border border-dashed col-span-full rounded-2xl border-neutral-300">

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
              className="p-5 bg-white border shadow-sm rounded-2xl border-neutral-200"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="flex items-center justify-center text-pink-600 h-11 w-11 rounded-xl bg-pink-50">
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
                    onClick={() =>
                      openEditModal(category)
                    }
                    className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(category.id)
                    }
                    className="p-2 text-red-500 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>

              <p className="mt-4 text-sm text-neutral-500">
                {category.description ||
                  "No description"}
              </p>

              {/* SLUG */}

              <div className="pt-3 mt-4 border-t border-neutral-100">

                <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                  URL Slug
                </p>

                <p className="mt-1 text-xs text-neutral-600">
                  /category/{category.slug ||
                    createSlug(category.name)}
                </p>

              </div>

            </div>

          ))

        )}

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">

          <div className="w-full max-w-md bg-white shadow-xl rounded-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">

              <h2 className="font-semibold text-neutral-900">
                {editingCategory
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-5"
            >

              {/* NAME */}

              <div>

                <label className="block mb-2 text-sm font-medium text-neutral-700">
                  Category Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Straight Wigs"
                  className="w-full px-4 py-3 border rounded-lg outline-none border-neutral-300 focus:border-pink-500"
                />

                {formData.name && (
                  <p className="mt-2 text-xs text-neutral-400">
                    URL:
                    {" "}
                    /category/
                    {createSlug(formData.name)}
                  </p>
                )}

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block mb-2 text-sm font-medium text-neutral-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Category description..."
                  className="w-full px-4 py-3 border rounded-lg outline-none resize-none border-neutral-300 focus:border-pink-500"
                />

              </div>

              {/* ACTIVE */}

              <label className="flex items-center gap-3 text-sm text-neutral-700">

                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 accent-pink-500"
                />

                Active category

              </label>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  saving ||
                  !formData.name.trim()
                }
                className="w-full py-3 font-semibold text-white transition bg-pink-500 rounded-lg hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-300"
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