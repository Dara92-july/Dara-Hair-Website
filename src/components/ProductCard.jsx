import { Link } from "react-router-dom";

const ProductCard = ({
  id,
  name,
  imageUrl,
  price,
  description,
  variants = [],
}) => {
  const hasVariants = variants && variants.length > 0;
  const firstVariant = variants[0] || {};

  return (
    <div className="bg-neutral-100 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
      {/* Product Image */}
      <Link to={`/product/${id}`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
      </Link>

      {/* Product Details */}
      <div className="p-4">
        <h2 className="text-lg font-semibold truncate">{name}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>

        {/* Variants Section */}
        {hasVariants && (
          <div className="mt-2 space-y-1 text-sm">
            <p className="font-medium text-gray-700">Select Options:</p>
            <div className="grid grid-cols-2 gap-1">
              {variants.map((variant, i) => (
                <div
                  key={i}
                  className="
                    border rounded p-1 cursor-pointer
                    bg-primary-100 text-primary-800 select-none
                  "
                >
                  {variant.length || variant.texture || variant.laceType || variant.density || `Option ${i + 1}`}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <p className="font-bold text-primary-600">
            {firstVariant.price !== undefined ? `₦{parseFloat(firstVariant.price)}` : `₦{parseFloat(price) || 0}`}
          </p>
          <Link
            to={`/product/${id}`}
            className="bg-primary-600 text-white text-sm px-3 py-1 rounded-md hover:bg-primary-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
