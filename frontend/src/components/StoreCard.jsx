import { useState } from "react";
import { FaStar } from "react-icons/fa";

const StoreCard = ({ store, onRatingSubmit }) => {
  const [selectedRating, setSelectedRating] = useState(store.userRating || 0);
  const [submitting, setSubmitting] = useState(false);

  const handleRatingSubmit = async () => {
    if (selectedRating === 0) {
      alert('Please select a rating');
      return;
    }
    setSubmitting(true);
    await onRatingSubmit(store._id, selectedRating);
    setSubmitting(false);
  };

  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`text-xl ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-500 transition-colors' : ''}`}
        onClick={interactive ? () => setSelectedRating(index + 1) : undefined}
        aria-label={interactive ? `Rate ${index + 1} stars` : undefined}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : -1}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === 'Enter') setSelectedRating(index + 1);
              }
            : undefined
        }
      />
    ));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h4 className="text-xl font-bold text-gray-900 mb-2">{store.name}</h4>
        <p className="text-gray-600 mb-3">
          <span className="font-medium">Address:</span> {store.address}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Overall Rating:</span>
            <div className="flex items-center space-x-1">
              {renderStars(Math.round(store.averageRating))}
              <span className="ml-2 font-bold text-gray-700">
                {store.averageRating.toFixed(1)} / 5
              </span>
            </div>
          </div>
          <div className="text-xs">
            ({store.totalRatings} reviews)
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-gray-700">Your Rating:</span>
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              store.userRating
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {store.userRating ? `${store.userRating}/5` : 'Not rated'}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate this store:
            </label>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {renderStars(selectedRating, true)}
              </div>
              <span className="text-sm text-gray-500">
                {selectedRating > 0 ? `${selectedRating}/5` : 'Select rating'}
              </span>
            </div>
          </div>

          <button
            onClick={handleRatingSubmit}
            disabled={submitting || selectedRating === 0}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              store.userRating
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {submitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </div>
            ) : store.userRating ? (
              'Update Rating'
            ) : (
              'Submit Rating'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard