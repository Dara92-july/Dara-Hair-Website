
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Users,
  ShoppingBag,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContexts";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, profile } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: FolderOpen,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: Users,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-4 sticky top-0 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-neutral-100"
        >
          <Menu size={24} />
        </button>

        <h1 className="font-semibold text-neutral-900">
          Dara Hair Admin
        </h1>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-red-500 hover:bg-red-50"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white
          border-r border-neutral-200
          flex flex-col
          transform transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo / Brand */}
        <div className="h-20 px-6 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">
              Dara Hair
            </h1>

            <p className="text-xs text-neutral-500 mt-1">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-pink-50 text-pink-600"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`
                }
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-neutral-200 p-4">
          {profile && (
            <div className="mb-4 px-2">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {profile.name || "Administrator"}
              </p>

              <p className="text-xs text-neutral-500 truncate">
                {profile.email || "Admin account"}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Desktop Top Bar */}
        <header className="hidden lg:flex h-20 bg-white border-b border-neutral-200 items-center justify-between px-8 sticky top-0 z-30">
          <div>
            <p className="text-sm text-neutral-500">
              Welcome back,
            </p>

            <h2 className="text-lg font-semibold text-neutral-900">
              {profile?.name || "Administrator"}
            </h2>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
