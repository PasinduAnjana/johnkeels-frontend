//@ts-nocheck
"use client";
import React, { useState } from "react";
import axios from "axios";

const PredictStock = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [warning, setWarning] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    axios
      .post("http://localhost:5000/predict")
      .then((response) => {
        if (response.data && response.data.stock_end_dates) {
          setPredictionResult(response.data.stock_end_dates);
          setWarning(response.data.warning || null); // Set warning message if exists
          setError(null);
        } else {
          setError("Unexpected response format");
          setPredictionResult(null);
          setWarning(null);
        }
      })
      .catch((error) => {
        setError(error.response?.data?.error || "An error occurred");
        setPredictionResult(null);
        setWarning(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container mx-auto mt-10 shadow-md px-16 py-8 flex flex-col rounded-lg  bg-white">
      <h1 className="text-3xl py-4">Predict Stock</h1>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? "Predicting..." : "Predict Stock"}
      </button>

      {predictionResult && (
        <div className="mt-4">
          <h2 className="text-2xl font-medium">Stock End Dates:</h2>
          <ul className="list-disc p-4 bg-gray-50 border  rounded-md my-4 pl-10">
            {Object.entries(predictionResult).map(([item, endDate]) => (
              <li key={item} className="text-gray-700 p-2 font-semibold">
                {item}: {new Date(endDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {warning && (
        <p className="text-yellow-600 text-lg font-light">{warning}</p>
      )}
      {error && <p className="text-red-500 font-bold">{error}</p>}
    </div>
  );
};

export default PredictStock;
