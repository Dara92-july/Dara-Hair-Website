import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    length: "",
    texture: "",
    laceType: "",
    density: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const docSnap = await getDoc(doc(db, "products", id));
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setProduct(data);

          // Auto-select first variant options if variants exist
          if (data.variants && data.variants.length > 0) {
            const first = data.variants[0];
            setSelectedOptions({
              length: first.length || "",
              texture: first.texture || "",
              laceType: first.laceType || "",
              density: first.density || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const variants = product?.variants || [];
  const hasVariants = variants.length > 0;

  // Deduplicate option lists for cleaner UI rendering
  const availableLengths = useMemo(
    () => [...new Set(variants.map((v) => v.length).filter(Boolean))],
    [variants]
  );
  const availableTextures = useMemo(
    () => [...new Set(variants.map((v) => v.texture).filter(Boolean))],
    [variants]
  );
  const availableLaceTypes = useMemo(
    () => [...new Set(variants.map((v) => v.laceType).filter(Boolean))],
    [variants]
  );
  const availableDensities = useMemo(
    () => [...new Set(variants.map((v) => v.density).filter(Boolean))],
    [variants]
  );

  // Find exact active variant based on selected dropdown/button choices
  const matchedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return (
      variants.find(
        (v) =>
          (!v.length || v.length === selectedOptions.length) &&
          (!v.texture || v.texture === selectedOptions.texture) &&
          (!v.laceType || v.laceType === selectedOptions.laceType) &&
          (!v.density || v.density === selectedOptions.density)
      ) || variants[0]
    );
  }, [variants, selectedOptions, hasVariants]);

  // Determine current active price
  const currentPrice = useMemo(() => {
    if (hasVariants) {
      return matchedVariant?.price || 0;
    }
    return product?.price || 0;
  }, [hasVariants, matchedVariant, product]);

  const handleOptionChange = (key, value) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: Number(currentPrice),
      imageUrl: product.imageUrl || "",
      quantity,
      variantKey: matchedVariant?.variantKey || "default",
      selectedOptions: hasVariants ? selectedOptions : null,
    };

    dispatch(addToCart(cartItem));
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading product details...</div>;
  }

  if (!product) {
    return <div className="p-6 text-center text-gray-500">Product not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto rounded-lg object-cover border"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
      </div>

      {/* Product Details & Purchase Form */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

        {/* Dynamic Price Display */}
        <div className="text-2xl font-bold text-primary-600">
          ₦{Number(currentPrice).toLocaleString()}
        </div>

        {/* Options Selection */}
        {hasVariants && (
          <div className="space-y-4 pt-2 border-t">
            {/* Length */}
            {availableLengths.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Length
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableLengths.map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => handleOptionChange("length", len)}
                      className={`px-3 py-1.5 text-sm rounded border transition ${
                        selectedOptions.length === len
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Texture */}
            {availableTextures.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Texture
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableTextures.map((tex) => (
                    <button
                      key={tex}
                      type="button"
                      onClick={() => handleOptionChange("texture", tex)}
                      className={`px-3 py-1.5 text-sm rounded border transition ${
                        selectedOptions.texture === tex
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      {tex}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lace Type */}
            {availableLaceTypes.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Lace Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableLaceTypes.map((lace) => (
                    <button
                      key={lace}
                      type="button"
                      onClick={() => handleOptionChange("laceType", lace)}
                      className={`px-3 py-1.5 text-sm rounded border transition ${
                        selectedOptions.laceType === lace
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      {lace}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Density */}
            {availableDensities.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Density
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableDensities.map((den) => (
                    <button
                      key={den}
                      type="button"
                      onClick={() => handleOptionChange("density", den)}
                      className={`px-3 py-1.5 text-sm rounded border transition ${
                        selectedOptions.density === den
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      {den}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quantity Controls */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Quantity
          </p>
          <div className="flex items-center space-x-3 w-32 border rounded p-1">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-lg font-bold"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="flex-1 text-center font-medium">{quantity}</span>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-lg font-bold"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Action */}
        <button
          onClick={handleAddToCart}
          className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-md transition shadow-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;