import React from 'react'

const Card = ({ title, value, unit = '', subtitle }) => (
  <div className="bg-white rounded-lg shadow p-6 text-center">
    <h4 className="text-lg font-semibold text-gray-700 mb-2">{title}</h4>
    <div className="flex justify-center items-center mb-1 text-indigo-600 text-4xl font-extrabold">
      {value} {unit}
    </div>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
);

export default Card