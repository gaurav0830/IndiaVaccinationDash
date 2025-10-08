import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartLoader from "./ChartLoader";
import { FiRefreshCw } from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VaccinationBarChart = ({ data: chartData, loading = false }) => {
  const [data, setData] = useState(chartData);
  const [isLoading, setIsLoading] = useState(loading);

  const loadData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData({
        labels: ["MH", "KA", "TN", "UP", "GJ", "WB", "KL"],
        datasets: [
          {
            label: "Vaccinations (in millions)",
            data: [185, 162, 150, 210, 140, 130, 120],
            backgroundColor: [
              "#007bff",
              "#28a745",
              "#ffc107",
              "#dc3545",
              "#17a2b8",
              "#6f42c1",
              "#fd7e14",
            ],
            borderColor: "#ffffff",
            borderWidth: 2,
            borderRadius: 10,
            barThickness: 30,
          },
        ],
      });
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (!chartData) loadData();
  }, [chartData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#222" } },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "#ccc",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Vaccinations (in millions)" },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: { grid: { display: false } },
    },
  };

  if (isLoading || !data) return <ChartLoader />;

  return (
    <div className="w-full h-full flex flex-col gap-2 p-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-700 font-bold text-lg">
          State-wise Vaccination Coverage
        </h3>
        <button
          onClick={loadData}
          className="flex items-center gap-1 bg-gray-100 text-black px-2 py-1 rounded-sm hover:bg-gray-200 transition cursor-pointer"
        >
          <FiRefreshCw size={15} />
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1 h-[220px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default VaccinationBarChart;
