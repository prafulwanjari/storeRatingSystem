import axios from "axios";
import { useEffect, useState } from "react";

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchStores();
  }, [filters, sortBy, sortOrder]);

  const fetchStores = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const params = new URLSearchParams({ ...filters, sortBy, sortOrder });
      const response = await axios.get(`/api/stores/admin?${params.toString()}`);
      setStores(response.data);
    } catch {
      setErrorMsg("Failed to load stores. Please try again.");
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const renderArrow = (field) =>
    sortBy === field ? (sortOrder === "asc" ? "↑" : "↓") : "";

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Stores Management</h3>

      {/* Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {["name", "email", "address"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={`Filter by ${field}`}
            value={filters[field]}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            aria-label={`Filter stores by ${field}`}
          />
        ))}
      </div>

      {/* Error message */}
      {errorMsg && (
        <div
          className="mb-4 text-red-600 font-medium text-center"
          role="alert"
          tabIndex={-1}
        >
          {errorMsg}
        </div>
      )}

      {/* Loading & Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading stores...</div>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="w-full bg-white rounded-lg overflow-hidden shadow-sm"
            role="table"
            aria-label="Stores list"
          >
            <thead className="bg-gray-50">
              <tr role="row">
                {["name", "email", "address", "averageRating"].map((field) => (
                  <th
                    key={field}
                    scope="col"
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none"
                    onClick={() => handleSort(field)}
                    aria-sort={
                      sortBy === field
                        ? sortOrder === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleSort(field);
                    }}
                    role="columnheader"
                    aria-label={`Sort by ${
                      field === "averageRating"
                        ? "rating"
                        : field.charAt(0).toUpperCase() + field.slice(1)
                    }`}
                  >
                    {field === "averageRating"
                      ? "Rating"
                      : field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                    <span aria-hidden="true" className="ml-1">
                      {renderArrow(field)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500 italic cursor-default"
                    tabIndex={-1}
                  >
                    No stores found.
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr
                    key={store._id}
                    className="hover:bg-gray-50 focus-within:bg-gray-100 focus:outline-none"
                    tabIndex={-1}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {store.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {store.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {store.address}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      aria-label={`Average rating ${store.averageRating.toFixed(
                        1
                      )} with ${store.totalRatings} reviews`}
                    >
                      <div
                        className="flex items-center"
                        aria-hidden="true"
                        title={`${store.averageRating.toFixed(
                          1
                        )} stars, ${store.totalRatings} reviews`}
                      >
                        <span className="mr-1">
                          {store.averageRating.toFixed(1)}
                        </span>
                        <span className="text-yellow-400">⭐</span>
                        <span className="ml-1 text-gray-500">
                          ({store.totalRatings})
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StoresList;