import { FaStar } from "react-icons/fa";

const RatingDistributionChart = ({ ratings }) => {
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r.rating === star).length,
  }));

  const total = ratings.length;
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      {distribution.map(({ star, count }) => {
        const width = (count / maxCount) * 100;
        const percentage = total ? (count / total) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-4">
            <div className="flex items-center w-16">
              <span className="mr-1 text-sm font-semibold">{star}</span>
              <FaStar className="text-yellow-400" />
            </div>
            <div className="flex-grow bg-gray-200 rounded h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-width"
                style={{ width: `${width}%` }}
              />
            </div>
            <div className="w-20 text-sm text-right">
              {count} ({percentage.toFixed(1)}%)
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingDistributionChart