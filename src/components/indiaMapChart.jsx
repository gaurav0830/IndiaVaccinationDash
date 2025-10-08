import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import * as d3 from "d3";

const normalizeName = (name) =>
  name?.toLowerCase().replace(/\s/g, "").replace(/\./g, "");

const IndiaMapChart = ({
  geoUrl = "/india-states.geojson",
  data = [],
  colorRange = ["#d0f1c9ff", "#034a21ff"],
  onHover, 
}) => {
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [indiaGeo, setIndiaGeo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((geoData) => {
        setIndiaGeo(geoData);
        setIsLoading(false);
      })
      .catch((err) => console.error("Error loading India GeoJSON:", err));
  }, [geoUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const maxVaccinated = Math.max(...data.map((d) => d.vaccinated || 0));
  const colorScale = d3
    .scaleLinear()
    .domain([0, maxVaccinated])
    .range(colorRange);

  return (
    <div className="w-full h-full relative flex flex-col p-4">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">
        India Vaccination Map
      </h2>

      <div className="relative flex-1 flex items-center justify-center">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 1400, center: [82, 22.5] }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={indiaGeo}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName =
                  geo.properties?.ST_NM || geo.properties?.NAME_1;
                if (!stateName) return null;

                const stateData = data.find(
                  (d) => normalizeName(d.state) === normalizeName(stateName)
                );

                const fillColor = stateData
                  ? colorScale(stateData.vaccinated)
                  : "#eee";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#000"
                    onMouseEnter={(e) => {
                      const rect = e.target.getBoundingClientRect();
                      const mapContainer =
                        e.currentTarget.ownerSVGElement.getBoundingClientRect();

                      setTooltipPos({
                        x: e.clientX - mapContainer.left,
                        y: e.clientY - mapContainer.top,
                      });

                      const rate =
                        typeof stateData?.vaccination_rate === "string"
                          ? parseFloat(
                              stateData.vaccination_rate.replace("%", "")
                            )
                          : stateData?.vaccination_rate || 0;

                      const tooltipInfo = {
                        state: stateName,
                        vaccinated: stateData?.vaccinated || "No Data",
                        vaccination_rate: `${rate.toFixed(1)}%`,
                        top_vaccine: stateData?.top_vaccine || "N/A",
                        region: stateData?.region || "N/A",
                      };

                      setTooltipData(tooltipInfo);

                      if (onHover)
                        onHover({
                          ...stateData,
                          state: stateName,
                          vaccination_rate: rate, 
                        });
                    }}
                    onMouseMove={(e) => {
                      const mapContainer =
                        e.currentTarget.ownerSVGElement.getBoundingClientRect();
                      setTooltipPos({
                        x: e.clientX - mapContainer.left,
                        y: e.clientY - mapContainer.top,
                      });
                    }}
                    onMouseLeave={() => {
                      setTooltipData(null);
                      if (onHover) onHover(null);
                    }}
                    style={{
                      default: {
                        outline: "none",
                        transition: "fill 0.4s ease",
                      },
                      hover: { fill: "#5ea372", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {tooltipData && (
          <div
            style={{
              position: "absolute",
              top: tooltipPos.y + 10,
              left: tooltipPos.x + 10,
              background: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "8px 10px",
              borderRadius: "6px",
              pointerEvents: "none",
              fontSize: "13px",
              minWidth: "140px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              zIndex: 10,
              transition: "opacity 0.2s ease",
            }}
          >
            <strong>{tooltipData.state}</strong>
            <br />
            Vaccinated:{" "}
            {typeof tooltipData.vaccinated === "number"
              ? tooltipData.vaccinated.toLocaleString()
              : tooltipData.vaccinated}
            <br />
            Rate: {tooltipData.vaccination_rate}
            <br />
            Top Vaccine: {tooltipData.top_vaccine}
            <br />
            Region: {tooltipData.region}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndiaMapChart;
