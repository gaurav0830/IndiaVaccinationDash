import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const RangeBarChart = ({
  data = [],
  maxValue, 
  title = "Welcome User 👋",
  subtitle = "Here are the top states with the highest vaccination coverage.",
  colors = ["#34d399", "#3b82f6", "#f97316", "#f43f5e"],
  barWidth = 200,
  animationDuration = 1000,
}) => {
  const [loaded, setLoaded] = useState(false);

  const maxRate = maxValue || Math.max(...data.map((d) => parseFloat(d.vaccination_rate) || 0));

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-black/90 mb-2" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
        {title}
      </h1>

      <p className="text-sm text-black/70 font-semibold mb-4" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
        {subtitle}
      </p>

      <div className="flex flex-col gap-4">
        {data.map((item, index) => {
          const rate = parseFloat(item.vaccination_rate) || 0; 
          const percentage = Math.round((rate / maxRate) * 100); 
          const barColor = colors[index % colors.length];

          return (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-black/80 w-20 mr-6">{item.state}</span>

                <div
                  className="relative flex-1 bg-gray-200 rounded-full h-3 cursor-pointer backdrop-blur-md shadow-lg"
                  style={{ maxWidth: "300px" }}
                  data-tooltip-id={`tooltip-${index}`}
                  data-tooltip-content={`${rate.toFixed(1)}% vaccinated`}
                >
                  <div
                    className="h-3 rounded-full transition-all ease-out"
                    style={{
                      width: loaded ? `${percentage}%` : "0%",
                      backgroundColor: barColor,
                      transitionDuration: `${animationDuration}ms`,
                    }}
                  />
                </div>

                <span className="text-sm font-semibold text-black/80">{rate.toFixed(1)}%</span>

                <Tooltip id={`tooltip-${index}`} place="top" effect="solid" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RangeBarChart;
