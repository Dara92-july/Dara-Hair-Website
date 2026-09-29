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
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  const variants = product.variants || [];
  const hasVariants = variants.length > 0;
  const firstVariant = variants[0] || {};

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: selectedVariant?.price || firstVariant?.price || product.price || 0,
      imageUrl: product.imageUrl,
      quantity,
      variantKey: selectedVariant?.variantKey || firstVariant?.variantKey || "default",
    };
    dispatch(addToCart(cartItem));
  };

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

      {/* Variants Selector */}
      {hasVariants && (
        <div className="mt-4 space-y-3">
          <p className="font-medium text-gray-700">Select Options:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-small text-gray-600">Length</p>
              <div className="mt-1 border rounded p-1">
                {variants.map((v, i) => (
                  <div
                    key={i}
                    className="
                      px-2 py-1 rounded cursor-pointer
                      bg-primary-100 text-primary-800 select-none margin-1
                      {selectedVariant?.length === v.length ? 'bg-primary-800 text-white' : ''}
                    "
                    onClick={() => setSelectedVariant({ ...selectedVariant, length: v.length })}
                  >
                    {v.length}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-small text-gray-600">Texture</p>
              <div className="mt-1 border rounded p-1">
                {variants.map((v, i) => (
                  <div
                    key={i}
                    className="
                      px-2 py-1 rounded cursor-pointer
                      bg-primary-100 text-primary-800 select-none margin-1
                      {selectedVariant?.texture === v.texture ? 'bg-primary-800 text-white' : ''}
                    "
                    onClick={() => setSelectedVariant({ ...selectedVariant, texture: v.texture })}
                  >
                    {v.texture}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-small text-gray-600">Lace Type</p>
              <div className="mt-1 border rounded p-1">
                {variants.map((v, i) => (
                  <div
                    key={i}
                    className="
                      px-2 py-1 rounded cursor-pointer
                      bg-primary-100 text-primary-800 select-none margin-1
                      {selectedVariant?.laceType === v.laceType ? 'bg-primary-800 text-white' : ''}
                    "
                    onClick={() =>
                      setSelectedVariant({ ...selectedVariant, laceType: v.laceType })
                    }
                  >
                    {v.laceType}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-small text-gray-600">Density</p>
              <div className="mt-1 border rounded p-1">
                {variants.map((v, i) => (
                  <div
                    key={i}
                    className="
                      px-2 py-1 rounded cursor-pointer
                      bg-primary-100 text-primary-800 select-none margin-1
                      {selectedVariant?.density === v.density ? 'bg-primary-800 text-white' : ''}
                    "
                    onClick={() =>
                      setSelectedVariant({ ...selectedVariant, density: v.density })
                    }
                  >
                    {v.density}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="font-medium text-gray-700 mt-2">Quantity</p>
          <div className="grid grid-cols-3 gap-1">
            <button
              className="border rounded p-1 hover:bg-primary-100"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </span>
            <span>{quantity}</span>
            <button
              className="border rounded p-1 hover:bg-primary-100"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Price Display */}
      <p className="font-medium text-primary-600 mt-2">
        {hasVariants ? selectedVariant?.price || firstVariant?.price || 0 : product.price || 0}
        ₦{parseFloat(hasVariants ? selectedVariant?.price || firstVariant?.price || 0 : product.price || 0) || 0}</p>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded"
        disabled={!selectedVariant && !hasVariants}
      >
        {hasVariants && !selectedVariant ? "Select Options First" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductDetail;