import api from "../../utills/axiosInstance";
import { useEffect, useState } from "react";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "all",
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [filters, sortBy, sortOrder]);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const params = new URLSearchParams({ ...filters, sortBy, sortOrder });
      const response = await api.get(`/users?${params.toString()}`);
      setUsers(response.data);
    } catch {
      setErrorMsg("Failed to load users. Please try again.");
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
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Users Management</h3>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { name: "name", placeholder: "Filter by name" },
          { name: "email", placeholder: "Filter by email" },
          { name: "address", placeholder: "Filter by address" },
        ].map(({ name, placeholder }) => (
          <input
            key={name}
            type="text"
            name={name}
            placeholder={placeholder}
            value={filters[name]}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            aria-label={placeholder}
            autoComplete="off"
          />
        ))}

        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          aria-label="Filter users by role"
        >
          <option value="all">All Roles</option>
          <option value="user">Normal User</option>
          <option value="storeOwner">Store Owner</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Error */}
      {errorMsg && (
        <div
          className="mb-4 text-red-600 font-medium text-center"
          role="alert"
          tabIndex={-1}
        >
          {errorMsg}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="w-full bg-white rounded-lg overflow-hidden shadow-sm"
            role="table"
            aria-label="Users list"
          >
            <thead className="bg-gray-50">
              <tr>
                {["name", "email", "address", "role"].map((field) => (
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
                    aria-label={`Sort by ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                    <span aria-hidden="true" className="ml-1">
                      {renderArrow(field)}
                    </span>
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center italic text-gray-500 cursor-default"
                    tabIndex={-1}
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 focus-within:bg-gray-100 focus:outline-none"
                    tabIndex={-1}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {user.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full select-none ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "storeOwner"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.role === "storeOwner" && user.storeId && user.storeId.averageRating !== undefined
                        ? `${user.storeId.averageRating.toFixed(1)} ⭐`
                        : "N/A"}
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

export default UsersList;