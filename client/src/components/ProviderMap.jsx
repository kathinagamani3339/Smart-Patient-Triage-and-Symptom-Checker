import React from "react";

const ProviderMap = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-md p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">
          Nearby Clinics
        </h2>

        <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded mb-4">
          <span className="text-gray-600">
            Google Map will be displayed here
          </span>
        </div>

        <ul className="space-y-2 text-gray-700">
          <li className="border p-2 rounded">City Hospital – 2.1 km</li>
          <li className="border p-2 rounded">Care Clinic – 3.5 km</li>
          <li className="border p-2 rounded">Health Plus – 4.0 km</li>
        </ul>
      </div>
    </div>
  );
};

export default ProviderMap;
