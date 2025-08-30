
import { useSelector, useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity, removeFromCart } from "../store/slice";
import { Link } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border p-2 rounded">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p>₦{item.price} x {item.quantity} = ₦{item.price * item.quantity}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="px-2 bg-gray-200"
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                  >-</button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 bg-gray-200"
                    onClick={() => dispatch(increaseQuantity(item.id))}
                  >+</button>
                  <button
                    className="ml-4 text-red-500"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >Remove</button>
                </div>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-lg mt-4">
            Total: ₦{total}
          </div>
          <Link
            to="/checkout"
            className="bg-pink-500 text-white px-4 py-2 rounded mt-2 inline-block"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
