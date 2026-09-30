import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { LogOut, User, Mail, Shield } from "lucide-react";

import { useAuth } from "../context/AuthContexts.jsx";
import { db } from "../firebase/firebase.js";

const Profile = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(
    profile?.name || user?.displayName || ""
  );

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Name cannot be empty.");
      return;
    }

    setIsSaving(true);

    try {
      await updateProfile(user, {
        displayName: name.trim(),
      });

      await updateDoc(doc(db, "users", user.uid), {
        name: name.trim(),
      });

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      setErrorMessage("Unable to update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="bg-neutral-900 text-white p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center">
                <User size={28} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  My Profile
                </h1>

                <p className="text-neutral-300 text-sm mt-1">
                  Manage your Dara Hair account
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {message && (
              <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {errorMessage && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg px-4 py-3 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>

                <div className="flex items-center gap-3 bg-neutral-100 border border-neutral-200 rounded-lg px-4 py-3">
                  <Mail size={18} className="text-neutral-500" />

                  <span className="text-neutral-700 break-all">
                    {user?.email}
                  </span>
                </div>

                <p className="text-xs text-neutral-500 mt-2">
                  Your email is managed by Firebase Authentication.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Account Type
                </label>

                <div className="flex items-center gap-3 bg-neutral-100 border border-neutral-200 rounded-lg px-4 py-3">
                  <Shield size={18} className="text-neutral-500" />

                  <span className="capitalize text-neutral-700">
                    {profile?.role || "customer"}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium px-6 py-3 rounded-lg"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </form>

            <div className="border-t border-neutral-200 mt-8 pt-6">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;