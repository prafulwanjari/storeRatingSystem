import { FaStar } from "react-icons/fa";

const Stars = ({ count }) => (
  <div className="flex space-x-0.5 text-yellow-400">
    {[...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < count ? '' : 'text-gray-300'} />
    ))}
  </div>
);

export default Stars