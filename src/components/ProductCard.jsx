import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slice";

const ProductCard = ({
  id,
  name,
  images = [],
  price,
  discountPrice,
  description,
  stockQuantity,
}) => {
  const dispatch = useDispatch();

  const imageUrl = images?.[0] || "";

  const regularPrice = Number(price || 0) / 100;

  const salePrice = discountPrice
    ? Number(discountPrice) / 100
    : null;

  const stock = Number(stockQuantity || 0);

  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const cartItem = {
      id,
      name,

      price: discountPrice
        ? Number(discountPrice)
        : Number(price),

      imageUrl,

      quantity: 1,
    };

    dispatch(addToCart(cartItem));
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* =========================
          PRODUCT IMAGE
      ========================= */}

      <Link
        to={`/product/${id}`}
        className="block overflow-hidden bg-gray-100"
      >
        <div className="relative h-56 w-full sm:h-64">

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://via.placeholder.com/600x600?text=No+Image";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No Image Available
            </div>
          )}

          {/* OUT OF STOCK BADGE */}

          {isOutOfStock && (
            <div className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
              Out of Stock
            </div>
          )}

          {/* DISCOUNT BADGE */}

          {salePrice && (
            <div className="absolute right-3 top-3 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
              Sale
            </div>
          )}

        </div>
      </Link>

      {/* =========================
          PRODUCT DETAILS
      ========================= */}

      <div className="flex flex-1 flex-col p-4">

        {/* NAME */}

        <Link to={`/product/${id}`}>
          <h2 className="truncate text-base font-semibold text-gray-900 transition hover:text-primary-600 sm:text-lg">
            {name}
          </h2>
        </Link>

        {/* DESCRIPTION */}

        <p className="mt-1 line-clamp-2 min-h-[40px] text-sm text-gray-500">
          {description || "Premium quality hair."}
        </p>

        {/* PRICE */}

        <div className="mt-3">

          {salePrice ? (
            <div className="flex flex-wrap items-center gap-2">

              <span className="text-lg font-bold text-primary-600">
                ₦{salePrice.toLocaleString()}
              </span>

              <span className="text-sm text-gray-400 line-through">
                ₦{regularPrice.toLocaleString()}
              </span>

            </div>
          ) : (
            <span className="text-lg font-bold text-primary-600">
              ₦{regularPrice.toLocaleString()}
            </span>
          )}

        </div>

        {/* STOCK */}

        {!isOutOfStock && (
          <p className="mt-2 text-xs font-medium text-green-600">
            {stock} available
          </p>
        )}

        {/* =========================
            BUTTONS
        ========================= */}

        <div className="mt-auto flex flex-col gap-2 pt-4">

          {/* ADD TO CART */}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <ShoppingCart size={17} />

            {isOutOfStock
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

          {/* VIEW DETAILS */}

          <Link
            to={`/product/${id}`}
            className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            View Details
          </Link>

        </div>

      </div>
    </div>
  );
};

export default ProductCard;