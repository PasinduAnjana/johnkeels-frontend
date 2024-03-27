// @ts-nocheck
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Chart from "chart.js/auto";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      const formattedStartDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
      const formattedEndDate = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");

      axios
        .get(
          `http://localhost:5000/get_sales_data?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
        )
        .then((response) => {
          const parsedData = JSON.parse(response.data.sales_data);
          setSalesData(parsedData);
          renderChart(parsedData); // Call renderChart function with sales data
        })
        .catch((error) => {
          console.error("Error fetching sales data:", error);
          setSalesData([]);
        });
    }
  }, [startDate, endDate]);

  const renderChart = (data: any) => {
    const ctx = document.getElementById("salesChart");

    // Extract unique items from data
    const items = [...new Set(data.map((item) => item.item))];

    // Initialize an object to store total quantities for each item
    const totalQuantitiesByItem = {};

    // Calculate total quantities for each item within the selected date range
    items.forEach((item) => {
      totalQuantitiesByItem[item] = data
        .filter((entry) => entry.item === item)
        .reduce((total, entry) => total + entry.quantity_sold, 0);
    });

    // Create the chart
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: items,
        datasets: [
          {
            label: "Total Quantity Sold",
            data: items.map((item) => totalQuantitiesByItem[item]),
            backgroundColor: "rgb(75, 192, 192)",
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Items",
            },
          },
          y: {
            title: {
              display: true,
              text: "Total Quantity Sold",
            },
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <main className="flex  flex-col items-center justify-between min-h-screen p-16">
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-8">
          Sales Data Visualization
        </h2>
        <div className="mb-4 flex">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="px-4 py-2 mr-2 rounded border"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="px-4 py-2 rounded border"
          />
        </div>
        <canvas id="salesChart" className="m-16"></canvas>
      </div>
    </main>
  );
}
