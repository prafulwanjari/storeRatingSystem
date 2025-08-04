import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utills/axiosInstance';
import { FaBars, FaTimes,FaSignOutAlt, FaKey } from 'react-icons/fa';
import Card from '../Card';
import RatingDistributionChart from '../RatingDistributionChart'
import SortSelect from '../SortSelect';
import ReviewsTable from '../ReviewsTable';

const StoreOwnerDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchStoreData();
  }, [sortBy, sortOrder]);

  async function fetchStoreData() {
    setLoading(true);
    try {
      const response = await api.get('/ratings/store');
      setStoreData(response.data);
    } catch (err) {
      console.error('Error fetching store data:', err);
    }
    setLoading(false);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // function handleSort(field) {
  //   if (sortBy === field) {
  //     setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  //   } else {
  //     setSortBy(field);
  //     setSortOrder('asc');
  //   }
  // }




  const sortedRatings = storeData?.ratings
    ? [...storeData.ratings].sort((a, b) => {
        let aVal, bVal;
        switch (sortBy) {
          case 'name':
            aVal = a.userId.name.toLowerCase();
            bVal = b.userId.name.toLowerCase();
            break;
          case 'email':
            aVal = a.userId.email.toLowerCase();
            bVal = b.userId.email.toLowerCase();
            break;
          case 'rating':
            aVal = a.rating;
            bVal = b.rating;
            break;
          case 'createdAt':
            aVal = new Date(a.createdAt);
            bVal = new Date(b.createdAt);
            break;
          default:
            return 0;
        }
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      })
    : [];

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
            <h1 className="text-2xl font-bold text-indigo-700 select-none">Store Owner</h1>
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
              to="/store-owner"
              className="block px-3 py-2 rounded-md text-base font-medium text-indigo-700 bg-indigo-100"
              aria-current="page"
            >
              Dashboard
            </Link>
            <Link
              to="/change-password"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <FaKey className="inline mr-2" /> Change Password
            </Link>
            
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
              className="flex w-full items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors hover:bg-red-400"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
          {/* <div className="p-6 border-t border-gray-200 text-gray-700 text-sm select-none truncate">
            Welcome,<br /> <strong>{user?.name || 'Store Owner'}</strong>
            <button
              onClick={handleLogout}
              className="w-full text-center block  py-2 rounded-md text-base font-medium text-red-600 bg-red-600 text-white mt-3 "
            >
              <FaSignOutAlt className="inline mr-2 text-white" /> Logout
            </button>
          </div> */}
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
          <h2 className="text-xl font-bold text-gray-900 select-none">Store Owner Dashboard</h2>
        </header>

        {/* Main grid content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Store Performance */}
            <section className="md:col-span-3 bg-white rounded-lg shadow p-6">
              <h3 className="text-2xl font-bold mb-6">Store Performance</h3>
              {loading ? (
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  <p>Loading store data...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card
                    title="Average Rating"
                    value={storeData?.averageRating?.toFixed(1) || '0.0'}
                    unit="⭐"
                    subtitle="out of 5"
                    showAverageRatingIcon="true"
                  />
                  <Card
                    title="Total Reviews"
                    value={storeData?.totalRatings || 0}
                    subtitle="customer ratings"
                    showRecentReviewsIcon="true"
                  />
                  <Card
                    title="Recent Reviews"
                    value={
                      storeData?.ratings?.filter((rating) => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(rating.createdAt) > weekAgo;
                      }).length || 0
                    }
                    subtitle="last 7 days"
                    showTotalReviewsIcon="true"
                  />
                </div>
              )}
            </section>

            {/* Rating Distribution */}
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-6">Rating Distribution</h3>
              <RatingDistributionChart ratings={storeData?.ratings || []} />
            </section>

            {/* Customer Reviews */}
            <section className="md:col-span-2 bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <h3 className="text-xl font-bold mb-4 md:mb-0">Customer Reviews</h3>
                <div className="flex flex-wrap gap-4">
                  <SortSelect
                    label="Sort by:"
                    options={['createdAt', 'name', 'email', 'rating']}
                    value={sortBy}
                    onChange={setSortBy}
                  />
                  <SortSelect label="Order:" options={['asc', 'desc']} value={sortOrder} onChange={setSortOrder} />
                </div>
              </div>
              {loading ? (
                <p className="text-center text-gray-600 py-6">Loading reviews...</p>
              ) : sortedRatings.length === 0 ? (
                <p className="text-center text-gray-500 py-12">No reviews yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <ReviewsTable ratings={sortedRatings}/>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;