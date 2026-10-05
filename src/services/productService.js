// src/services/productService.js

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const productsRef = collection(db, "products");

const productService = {
  // Get all products
  getProducts: async () => {
    const q = query(productsRef, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  },

  // Create product
  createProduct: async (productData) => {
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...productData,
    };
  },

  // Update product
  updateProduct: async (id, productData) => {
    const productRef = doc(db, "products", id);

    await updateDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp(),
    });
  },

  // Delete product
  deleteProduct: async (id) => {
    const productRef = doc(db, "products", id);

    await deleteDoc(productRef);
  },
};

export default productService;