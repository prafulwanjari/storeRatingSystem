import SortableTH from "./SortableTH";
import Stars from "./Stars";

const ReviewsTable = ({ ratings }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr><th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th> 
        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th> 
        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th> 
        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th> 
        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th> 
         {/* <SortableTH label="Customer Name" field="name" onSort={onSort} sortBy={sortBy} sortOrder={sortOrder} /> */}
       
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {ratings.map((rating) => (
        <tr key={rating._id} className="hover:bg-gray-50">
          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{rating.userId.name}</td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{rating.userId.email}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">{rating.userId.address}</td>
          <td className="whitespace-nowrap px-6 py-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">{rating.rating}</span>
              <Stars count={rating.rating} />
            </div>
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
            {new Date(rating.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ReviewsTable