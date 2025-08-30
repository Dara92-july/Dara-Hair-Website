import { Link } from "react-router-dom";

const ProductCard = ({ id, name, imageUrl, price, description }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
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

      <div className="flex justify-between items-center mt-4">
        <p className="font-bold text-pink-600">₦{parseFloat(price) || 0}</p>
        <Link
          to={`/product/${id}`}
          className="bg-pink-600 text-white text-sm px-3 py-1 rounded-md hover:bg-pink-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  </div>
);

export default ProductCard;
