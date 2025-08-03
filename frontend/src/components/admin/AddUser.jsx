import axios from "axios";
import { useState } from "react";

const AddUser = () => {
  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/users', formData);
      setSuccess('User added successfully');
      setFormData({ name: '', email: '', password: '', address: '', role: 'user' });
    } catch (error) {
      setError(error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'Failed to add user');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New User</h3>
        {error && <div className="mb-4 text-red-600 font-medium" role="alert">{error}</div>}
        {success && <div className="mb-4 text-green-600 font-medium" role="alert">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className={labelClass}>
              Name <span className="text-gray-500">(20-60 characters)</span>
            </label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} minLength="20" maxLength="60" required placeholder="Enter full name" className={inputClass} aria-required="true" />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Enter email address" className={inputClass} aria-required="true" />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <p className="text-xs text-gray-500 mb-2">8-16 characters, must include 1 uppercase letter and 1 special character</p>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} minLength="8" maxLength="16" pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$" required placeholder="Enter password" className={inputClass} aria-required="true" />
          </div>
          <div>
            <label htmlFor="address" className={labelClass}>Address <span className="text-gray-500">(max 400 characters)</span></label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} maxLength="400" required placeholder="Enter address" className={`${inputClass} resize-vertical h-20`} aria-required="true" />
          </div>
          <div>
            <label htmlFor="role" className={labelClass}>Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} className={inputClass} aria-required="true">
              <option value="user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="storeOwner">Store Owner</option>
            </select>
          </div>

          <div className="text-center">
             <button type="submit" disabled={loading} className="inline-flex justify-center w-full max-w-xs rounded-md bg-indigo-600 py-2 px-4 text-white font-semibold shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out" aria-disabled={loading}>
            {loading ? (
              <span className="flex items-center  space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>Adding User...</span>
              </span>
            ) : 'Add User'}
          </button>
          </div>
         
        </form>
      </div>
    </div>
  );
};

export default AddUser



