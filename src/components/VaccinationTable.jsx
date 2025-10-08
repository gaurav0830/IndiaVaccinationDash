import React from "react";

const VaccinationTable = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No vaccination data available.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 overflow-x-auto bg-white/70 rounded-xl p-4 shadow-md">
        <h2 className="font-semibold text-lg mb-4">States Overview</h2>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-3">State</th>
              <th className="py-2 px-3">Vaccinated</th>
              <th className="py-2 px-3">Population</th>
              <th className="py-2 px-3">Vaccination Rate</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, Math.ceil(data.length / 2)).map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition-colors border-b border-gray-200"
              >
                <td className="py-2 px-3">{item.state}</td>
                <td className="py-2 px-3">{item.vaccinated.toLocaleString()}</td>
                <td className="py-2 px-3">{item.population.toLocaleString()}</td>
                <td className="py-2 px-3">{item.vaccination_rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex-1 overflow-x-auto bg-white/70 rounded-xl p-4 shadow-md">
        <h2 className="font-semibold text-lg mb-4">Additional Info</h2>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-3">State</th>
              <th className="py-2 px-3">Top Vaccine</th>
              <th className="py-2 px-3">Last Updated</th>
              <th className="py-2 px-3">Region</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(Math.ceil(data.length / 2)).map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition-colors border-b border-gray-200"
              >
                <td className="py-2 px-3">{item.state}</td>
                <td className="py-2 px-3">{item.top_vaccine}</td>
                <td className="py-2 px-3">{item.last_updated}</td>
                <td className="py-2 px-3">{item.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VaccinationTable;
