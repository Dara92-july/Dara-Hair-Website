import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;
      setUser(currentUser);

      const orderSnap = await getDocs(collection(db, "orders", currentUser.uid, "userOrders"));
      const userOrders = orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(userOrders);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Welcome {user?.email}</h2>
      <h3 className="text-lg font-semibold mb-2">Your Orders</h3>
      {orders.length === 0 ? (
        <p>No previous orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="border p-2 mb-4 rounded bg-gray-100">
            <p className="font-bold">
              Order Date: {new Date(order.createdAt.toDate()).toLocaleString()}
            </p>
            <ul className="mt-2">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity} = ₦{item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p className="font-semibold mt-2">Total: ₦{order.total}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
