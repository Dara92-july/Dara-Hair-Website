import { Link } from 'react-router-dom';

const ProductCard = ({ id, name, imageUrl, price, description }) => (
  <div className="border p-4">
    <img
      src={imageUrl}
      alt={name}
      className="w-full h-40 object-cover mb-2"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = ""; 
      }}
    />
    <h2 className="font-bold">{name}</h2>
    <p className="text-sm text-gray-700">{description}</p>
    <p className="font-semibold text-pink-600 mt-2">₦{parseFloat(price) || 0}</p>
    <Link to={`/product/${id}`} className="text-blue-500">View Details</Link>
  </div>
);

export default ProductCard;