import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { FiRefreshCw } from "react-icons/fi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartLoader from "./ChartLoader";

ChartJS.register(ArcElement, Tooltip, Legend);

const VaccineDoughnutChart = ({
  data: chartData,
  loading = false,
  onRefresh,
}) => {
  const [data, setData] = useState(chartData);

  useEffect(() => {
    if (!chartData) {
      setTimeout(() => {
        setData({
          labels: ["Covishield", "Covaxin", "Sputnik", "Others"],
          datasets: [
            {
              label: "Vaccine Distribution",
              data: [55, 30, 10, 5],
              backgroundColor: ["#007bff", "#28a745", "#ffc107", "#6c757d"],
              borderWidth: 1,
            },
          ],
        });
      }, 1000);
    }
  }, [chartData]);

  if (loading || !data) return <ChartLoader />;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-700 font-bold text-lg">
          Vaccine Distribution
        </h3>
        <button
          onClick={() => {
            setData(null); 
            setTimeout(() => {
              setData({
                labels: ["Covishield", "Covaxin", "Sputnik", "Others"],
                datasets: [
                  {
                    label: "Vaccine Distribution",
                    data: [55, 30, 10, 5],
                    backgroundColor: [
                      "#007bff",
                      "#28a745",
                      "#ffc107",
                      "#6c757d",
                    ],
                    borderWidth: 1,
                  },
                ],
              });
            }, 1000);
          }}
          className="flex items-center gap-1 bg-gray-100 text-black px-2 py-1 rounded-sm hover:bg-gray-200 transition cursor-pointer"
        >
          <FiRefreshCw size={15} />
        </button>
      </div>

      <div className="h-[220px]">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default VaccineDoughnutChart;
