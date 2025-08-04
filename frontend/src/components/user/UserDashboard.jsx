import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utills/axiosInstance';
import { FaBars, FaTimes, FaUser, FaKey, FaSignOutAlt, FaSearch, FaStar } from 'react-icons/fa';
import StoreCard from '../StoreCard';

const UserDashboard = () => {
  const { logout, user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [storesLoading, setStoresLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch stores when search, sort order, or auth/token changes
  useEffect(() => {
    if (!authLoading && token) {
      fetchStores();
    }
    
  }, [search, sortBy, sortOrder, authLoading, token]);

  const fetchStores = async () => {
    setStoresLoading(true);
    try {
      const params = new URLSearchParams({ search, sortBy, sortOrder });
      const response = await api.get(`/stores?${params}`);
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
      }
    }
    setStoresLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const submitRating = async (storeId, rating) => {
    try {
      await api.post('/ratings', { storeId, rating });
      fetchStores();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto flex flex-col`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-indigo-700 select-none">User Portal</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              aria-label="Close sidebar"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1" role="menu" aria-orientation="vertical">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-indigo-700 bg-indigo-100"
              aria-current="page"
            >
              <FaUser className="inline mr-2" /> Dashboard
            </Link>
            <Link
              to="/change-password"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <FaKey className="inline mr-2" /> Change Password
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          </nav>
          <div className="p-6 border-t border-gray-200 text-gray-700 text-sm select-none truncate">
            Welcome, <strong>{user?.name || 'User'}</strong>
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
          <h2 className="text-xl font-bold text-gray-900 select-none">User Dashboard</h2>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaSearch className="mr-3 text-indigo-600" />
                Browse Stores
              </h3>

              {/* Search & Sort Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
                <div className="lg:col-span-2">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search Stores
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name or address..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="name">Name</option>
                    <option value="address">Address</option>
                    <option value="averageRating">Rating</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Store Results */}
            <section className="bg-white rounded-lg shadow p-6">
              {storesLoading ? (
                <div className="flex justify-center items-center py-12 space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="text-gray-600 font-medium">Loading stores...</span>
                </div>
              ) : stores.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg font-semibold">No stores found</div>
                  <div className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stores.map((store) => (
                    <StoreCard key={store._id} store={store} onRatingSubmit={submitRating} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;