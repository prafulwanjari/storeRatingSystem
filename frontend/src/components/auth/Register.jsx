import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await register(formData);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 flex items-center justify-center px-2 md:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 shadow-xl bg-white rounded-2xl overflow-hidden">
        {/* Left: Image section (hidden below md) */}
        <div className="hidden md:flex flex-col items-center justify-center bg-indigo-900 relative">
          {/* Replace the image URL below with your own or a static asset */}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTYg6EDuuA7UkQfxKcgOkbCJE8xWr8dhn6fw&s"
            alt="Store Rating System"
            className="object-cover w-full h-full"
            style={{minHeight: 400}}
          />
          {/* Overlay title on image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
            <h1 className="text-3xl font-bold text-white drop-shadow mb-2 text-center">
              Store Rating System
            </h1>
            <p className="text-indigo-200 font-semibold text-lg">Rate &amp; Review Stores</p>
          </div>
        </div>

        {/* Right: Register Form */}
        <div className="flex flex-col justify-center px-4 py-8 sm:px-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Create Account
          </h2>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" aria-label="Registration form">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Full Name{" "}
                <span className="text-gray-500">(20-60 characters)</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                minLength={20}
                maxLength={60}
                required
                placeholder="Enter your full name"
                className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                autoComplete="name"
                aria-required="true"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                autoComplete="email"
                aria-required="true"
              />
            </div>

            {/* Password with toggle */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <p className="text-xs text-gray-500 mb-2">
                8-16 characters, must include 1 uppercase letter and 1 special character
              </p>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                maxLength={16}
                pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$"
                title="Password must be 8-16 characters with at least one uppercase letter and one special character"
                required
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-3 pr-10 rounded-md border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition "
                autoComplete="new-password"
                aria-required="true"
                aria-describedby="password-helper"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-gray-700"
              >
                Address <span className="text-gray-500">(max 400 characters)</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                maxLength={400}
                required
                placeholder="Enter your address"
                className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition h-20"
                aria-required="true"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="img"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                    />
                  </svg>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;