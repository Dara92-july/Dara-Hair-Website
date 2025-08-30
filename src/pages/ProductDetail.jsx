import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slice";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      const docSnap = await getDoc(doc(db, "products", id));
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-4">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full max-w-md mb-4 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "";
          }}
        />
      )}
      <h2 className="text-2xl font-bold">{product.name}</h2>
      <p>{product.description}</p>
      <p className="font-semibold text-pink-600 mt-2">₦{parseFloat(product.price) || 0}</p>
      <button
        onClick={() => dispatch(addToCart(product))}
        className="bg-green-500 text-white px-4 py-2 mt-2"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;
