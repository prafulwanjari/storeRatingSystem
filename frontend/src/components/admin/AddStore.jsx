import { useState } from "react";
import axios from "../../utills/axiosInstance"; // centralized axios instance

const AddStore = () => {
  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out";

  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
    ownerAddress: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post("/stores", formData); // token automatically handled
      setSuccess("Store and owner added successfully.");
      setFormData({
        name: "",
        email: "",
        address: "",
        ownerName: "",
        ownerEmail: "",
        ownerPassword: "",
        ownerAddress: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.error ||
          error.response?.data?.errors?.[0]?.msg ||
          "Failed to add store. Please check your inputs."
      );
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Add New Store
        </h3>

        {error && (
          <div
            className="mb-6 rounded-md bg-red-50 p-4 text-red-800"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="mb-6 rounded-md bg-green-50 p-4 text-green-800"
            role="alert"
            aria-live="polite"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Store Information */}
          <fieldset className="border border-gray-200 rounded-lg p-6">
            <legend className="text-xl font-semibold text-gray-800 mb-6 px-2">
              Store Information
            </legend>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Store Name <span className="text-indigo-600">*</span>{" "}
                  <span className="text-xs text-gray-400">(3-60 characters)</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  minLength={3}
                  maxLength={60}
                  required
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Example: The Book Store"
                  autoComplete="organization"
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Store Email <span className="text-indigo-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  required
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="store@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="address" className={labelClass}>
                  Store Address <span className="text-indigo-600">*</span>{" "}
                  <span className="text-xs text-gray-400">(max 400 characters)</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  maxLength={400}
                  required
                  onChange={handleChange}
                  className={`${inputClass} h-24 resize-y`}
                  placeholder="123 Example St, City, State, Country"
                  rows={4}
                />
              </div>
            </div>
          </fieldset>

          {/* Owner Information */}
          <fieldset className="border border-gray-200 rounded-lg p-6">
            <legend className="text-xl font-semibold text-gray-800 mb-6 px-2">
              Owner Information
            </legend>

            <div className="space-y-6">
              <div>
                <label htmlFor="ownerName" className={labelClass}>
                  Owner Name <span className="text-indigo-600">*</span>{" "}
                  <span className="text-xs text-gray-400">(3-60 characters)</span>
                </label>
                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  value={formData.ownerName}
                  minLength={3}
                  maxLength={60}
                  required
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Owner full name"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="ownerEmail" className={labelClass}>
                  Owner Email <span className="text-indigo-600">*</span>
                </label>
                <input
                  id="ownerEmail"
                  name="ownerEmail"
                  type="email"
                  value={formData.ownerEmail}
                  required
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="owner@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="ownerPassword" className={labelClass}>
                  Owner Password <span className="text-indigo-600">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-1">
                  8-16 characters, must include 1 uppercase &amp; 1 special character
                </p>
                <input
                  id="ownerPassword"
                  name="ownerPassword"
                  type="password"
                  value={formData.ownerPassword}
                  minLength={8}
                  maxLength={16}
                  pattern="^(?=.*[A-Z])(?=.*[@#$%^&*!]).{8,16}$"
                  required
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="●●●●●●●●"
                  autoComplete="new-password"
                  aria-describedby="owner-pass-help"
                />
              </div>

              <div>
                <label htmlFor="ownerAddress" className={labelClass}>
                  Owner Address <span className="text-gray-400">(Optional, max 400 chars)</span>
                </label>
                <textarea
                  id="ownerAddress"
                  name="ownerAddress"
                  value={formData.ownerAddress}
                  maxLength={400}
                  onChange={handleChange}
                  className={`${inputClass} h-24 resize-y`}
                  placeholder="Owner's address"
                  rows={4}
                />
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="w-full max-w-xs mx-auto block bg-indigo-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Adding Store..." : "Add Store"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStore;