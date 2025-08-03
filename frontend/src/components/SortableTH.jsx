const SortableTH = ({ label, field, onSort, sortBy, sortOrder }) => (
  <th
    // role="button"
    onClick={() => onSort(field)}
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onSort(field);
    }}
    className="cursor-pointer select-none px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center"
  >
    {label}
    {sortBy === field && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
  </th>
);

export default SortableTH