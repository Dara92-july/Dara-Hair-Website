import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slice";
import { ShoppingCart } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const productRef = doc(db, "products", id);

        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
          const data = {
            id: docSnap.id,
            ...docSnap.data(),
          };

          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500">
        Product not found.
      </div>
    );
  }

  // =========================
  // IMAGES
  // =========================

  const images = product.images || [];

  const currentImage = images[selectedImage] || "";

  // =========================
  // PRICE
  // =========================

  const regularPrice = Number(product.price || 0) / 100;

  const discountPrice = product.discountPrice
    ? Number(product.discountPrice) / 100
    : null;

  const currentPrice = discountPrice || regularPrice;

  // =========================
  // STOCK
  // =========================

  const stock = Number(product.stockQuantity || 0);

  const handleAddToCart = () => {
    if (stock <= 0) {
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,

      // Store price in kobo
      price: discountPrice
        ? Number(product.discountPrice)
        : Number(product.price),

      imageUrl: currentImage,

      quantity,

      selectedOptions: null,
    };

    dispatch(addToCart(cartItem));
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 p-4 md:grid-cols-2 md:p-6">
      {/* =========================
          PRODUCT IMAGES
      ========================= */}

      <div>
        {/* Main Image */}

        <div className="overflow-hidden rounded-lg border bg-gray-100">
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.name}
              className="h-[450px] w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-[450px] items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Thumbnail Images */}

        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden rounded-lg border-2 ${
                  selectedImage === index
                    ? "border-primary-600"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="h-24 w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* =========================
          PRODUCT INFORMATION
      ========================= */}

      <div className="flex flex-col space-y-5">
        <div>
          <p className="mb-2 text-sm uppercase tracking-wide text-gray-500">
            {product.category}
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            {product.name}
          </h1>
        </div>

        <p className="text-sm leading-relaxed text-gray-600">
          {product.description}
        </p>

        {/* Price */}

        <div>
          {discountPrice ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary-600">
                ₦{discountPrice.toLocaleString()}
              </span>

              <span className="text-lg text-gray-400 line-through">
                ₦{regularPrice.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-primary-600">
              ₦{regularPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock */}

        {stock > 0 ? (
          <p className="text-sm font-medium text-green-600">
            {stock} available
          </p>
        ) : (
          <p className="text-sm font-medium text-red-600">
            Out of stock
          </p>
        )}

        {/* Quantity */}

        {stock > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Quantity
            </p>

            <div className="flex w-32 items-center space-x-3 rounded border p-1">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded text-lg font-bold hover:bg-gray-100"
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
              >
                -
              </button>

              <span className="flex-1 text-center font-medium">
                {quantity}
              </span>

              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded text-lg font-bold hover:bg-gray-100"
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(stock, q + 1)
                  )
                }
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Add To Cart */}

        {/* Add To Cart */}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={stock <= 0}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-4 text-base font-semibold text-white shadow-md transition duration-200 hover:bg-primary-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
      >
        <ShoppingCart size={20} />

        {stock <= 0 ? "Out of Stock" : "Add to Cart"}
      </button>
      </div>
    </div>
  );
};

export default ProductDetail;