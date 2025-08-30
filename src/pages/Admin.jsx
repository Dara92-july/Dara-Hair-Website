import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase"; 

const Admin = () => {
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    price: "",
    description: "",
    category: "", 
  });
  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), {
      ...formData,
      price: parseFloat(formData.price),
    });
    alert("Product added!");
    setFormData({
      name: "",
      imageUrl: "",
      price: "",
      description: "",
      category: "", 
    });
    fetchProducts();
  };

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(items);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md">
        {["name", "imageUrl", "price", "description"].map((field) => (
          <input
            key={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field}
            className="block mb-2 p-2 border w-full"
          />
        ))}

        {/* CATEGORY SELECT */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="block mb-4 p-2 border w-full"
        >
          <option value="">Select Category</option>
          <option value="braided-wig">Braided Wig</option>
          <option value="curly-wig">Curly Wig</option>
          <option value="straight-wig">Straight Wig</option>
          <option value="hair-products">Hair Products</option>
          <option value="tools">Hair Products and Tools</option>
          <option value="others">Others</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Product</button>
      </form>

      <h3 className="mt-6 font-bold">All Products</h3>
      {products.map((p) => (
        <div key={p.id} className="border p-2 mb-2">
          <p className="font-semibold">{p.name}</p>
          <img src={p.imageUrl} alt={p.name} className="w-32 h-32 object-cover mb-2" />
          <p>₦{p.price}</p>
          <p className="text-sm italic text-gray-500">Category: {p.category}</p>
          <button onClick={() => handleDelete(p.id)} className="text-red-500">Remove</button>
        </div>
      ))}
    </div>
  );
};

export default Admin;
