  const SortSelect = ({ label, options, value, onChange }) => (
  <div className="flex items-center gap-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      className="form-select text-base border rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 py-1 px-2 "
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt} value={opt} >
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

export default SortSelect