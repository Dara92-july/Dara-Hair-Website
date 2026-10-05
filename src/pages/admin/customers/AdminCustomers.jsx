import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import {
  Search,
  Users,
  UserCircle,
} from "lucide-react";

import { db } from "../../../firebase/firebase.js";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);

        const q = query(
          collection(db, "users"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const users = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter((user) => user.role !== "admin");

        setCustomers(users);
      } catch (error) {
        console.error("Customers error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(searchText) ||
      customer.email?.toLowerCase().includes(searchText)
    );
  });

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "—";

    return timestamp.toDate().toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Customers
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            View registered Dara Hair customers.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* CUSTOMER COUNT */}
      <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
          <Users size={20} />
        </div>

        <div>
          <p className="text-xs text-neutral-500">
            Total Customers
          </p>

          <p className="font-semibold text-neutral-900">
            {customers.length}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-neutral-500">
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center">
            <UserCircle
              size={42}
              className="mx-auto text-neutral-300"
            />

            <p className="mt-3 font-medium text-neutral-700">
              No customers found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-neutral-50">
                <tr className="text-left text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Joined</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                          {customer.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {customer.name || "Unnamed Customer"}
                          </p>

                          <p className="text-xs text-neutral-400">
                            ID: {customer.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {customer.email || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs capitalize text-neutral-600">
                        {customer.role || "customer"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-neutral-500">
                      {formatDate(customer.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;