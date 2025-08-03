import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../utills/axiosInstance";
import UsersList from "./UsersList";
import StoresList from "./StoreList";
import AddUser from "./AddUser";
import AddStore from "./AddStore";

import {
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaUserPlus,
  FaStoreAlt,
  FaKey,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminOverview = ({ stats }) => {
  const data = {
    labels: ["Users", "Stores", "Ratings"],
    datasets: [
      {
        label: "Counts",
        data: [stats.totalUsers, stats.totalStores, stats.totalRatings],
        backgroundColor: ["#4F46E5", "#6366F1", "#818CF8"],
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, stepSize: 1 },
    },
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">System Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Users", value: stats.totalUsers, color: "bg-blue-500" },
          { title: "Stores", value: stats.totalStores, color: "bg-green-500" },
          { title: "Ratings", value: stats.totalRatings, color: "bg-purple-500" },
        ].map(({ title, value, color }) => (
          <div
            key={title}
            className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <div className={`w-12 h-12 ${color} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
              {title === "Users" && <FaUsers className="text-white text-xl" />}
              {title === "Stores" && <FaStore className="text-white text-xl" />}
              {title === "Ratings" && <FaTachometerAlt className="text-white text-xl" />}
            </div>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">
              Total {title}
            </h4>
            <p className="text-3xl font-bold text-indigo-600">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Analytics Chart</h4>
        <div className="h-64">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/users/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/admin", label: "Overview", icon: <FaTachometerAlt size={18} /> },
    { to: "/admin/users", label: "Users", icon: <FaUsers size={18} /> },
    { to: "/admin/stores", label: "Stores", icon: <FaStore size={18} /> },
    { to: "/admin/add-user", label: "Add User", icon: <FaUserPlus size={18} /> },
    { to: "/admin/add-store", label: "Add Store", icon: <FaStoreAlt size={18} /> },
    { to: "/change-password", label: "Change Password", icon: <FaKey size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:inset-auto flex flex-col`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-indigo-700 select-none">
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              aria-label="Close sidebar"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1" role="menu" aria-orientation="vertical">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3">{icon}</span>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {(user?.name?.charAt(0) ?? "A").toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name ?? "Admin"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between bg-white shadow px-6 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            aria-label="Open menu"
          >
            <FaBars size={24} />
          </button>
          <h2 className="text-xl font-bold text-gray-900 select-none">
            Admin Dashboard
          </h2>
          <div className="w-6"></div> {/* Spacer for centering */}
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<AdminOverview stats={stats} />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/stores" element={<StoresList />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/add-store" element={<AddStore />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;