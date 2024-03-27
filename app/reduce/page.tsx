"use client";
import React, { useState } from "react";
import axios from "axios";

const ReduceStock = () => {
  const [items, setItems] = useState({
    Toner: "",
    A4: "",
    "File covers": "",
    Pencil: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItems((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate input values (e.g., ensure they are numeric)

    // Prepare data for API call
    const purchaseData = {
      items: items,
    };

    setIsLoading(true);

    // Make API call to reduce stock
    axios
      .post("http://localhost:5000/buy", purchaseData)
      .then((response) => {
        setSuccessMessage(response.data.message);
        setErrorMessage("");
      })
      .catch((error) => {
        setSuccessMessage("");
        setErrorMessage(error.response?.data?.error || "An error occurred");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container mx-auto mt-16 p-4 bg-white rounded-md shadow-md flex flex-col space-y-10">
      <h2 className="text-3xl">Reduce Stock</h2>

      <form className="grid grid-cols-1 gap-4">
        <div className="flex items-center">
          <label htmlFor="tonerInput" className="w-1/4 mr-2">
            Toner:
          </label>
          <input
            type="number"
            id="tonerInput"
            name="Toner"
            value={items.Toner}
            onChange={handleInputChange}
            className="w-full px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="a4Input" className="w-1/4 mr-2">
            A4:
          </label>
          <input
            type="number"
            id="a4Input"
            name="A4"
            value={items.A4}
            onChange={handleInputChange}
            className="w-full px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="fileCoversInput" className="w-1/4 mr-2">
            File covers:
          </label>
          <input
            type="number"
            id="fileCoversInput"
            name="File covers"
            value={items["File covers"]}
            onChange={handleInputChange}
            className="w-full px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="pencilInput" className="w-1/4 mr-2">
            Pencil:
          </label>
          <input
            type="number"
            id="pencilInput"
            name="Pencil"
            value={items.Pencil}
            onChange={handleInputChange}
            className="w-full px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </form>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? "Reducing Stock..." : "Reduce Stock"}
      </button>

      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default ReduceStock;
