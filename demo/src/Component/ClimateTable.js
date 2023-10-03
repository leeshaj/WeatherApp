import React from "react";
import "./ClimateTable.css";

const ClimateTable = ({ data }) => {
  if (!data || !data.length) {
    return <p>No climate data available.</p>;
  }

  const dataNames = Object.keys(data[0].daily);

  return (
    <div className="table-cont col-sm-10">
      <table>
        <thead>
          <tr>
            {dataNames.map((name) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              {dataNames.map((name) => (
                <td key={name}>{item.daily[name]}°C</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClimateTable;