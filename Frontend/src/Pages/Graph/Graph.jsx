import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  CartesianGrid,
} from "recharts";

const COLORS = {
  2024: "#8884d8",
  2020: "#82ca9d",
  2021: "#ffc658",
  2022: "#ff7300",
  2023: "#00C49F",
};

const Graph = ({ last }) => {
  const [data, setData] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [yAxisDomain, setYAxisDomain] = useState([0, "auto"]);
  const [visibleLines, setVisibleLines] = useState({
    2024: true,
    2020: true,
    2021: true,
    2022: true,
    2023: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (last.degree === "engineering") {
          response = await fetch(
            last.caste === "GM"
              ? "/eng/dataset.csv"
              : `/eng/${last.caste}_Data.csv`
          );
        } else if (last.degree === "veterinary") {
          response = await fetch(
            last.caste === "GM"
              ? "/vet/gm_data.csv"
              : `/vet/${last.caste.toLowerCase()}_data.csv`
          );
        } else {
          response = await fetch(
            last.caste === "GM"
              ? "/agri/agriData.csv"
              : `/agri/${last.caste}_Data.csv`
          );
        }

        const csvText = await response.text();
        const rows = csvText.split("\n");

        const parsedData = rows
          .slice(1)
          .map((row) => {
            const values = row.split(",");
            return {
              college_id: values[0],
              college_name: values[1],
              branch: values[2],
              2023: parseInt(values[3]),
              2022: parseInt(values[4]),
              2021: parseInt(values[5]),
              2020: parseInt(values[6]),
              2024: parseInt(values[7]),
            };
          })
          .filter((item) => !isNaN(item["2023"]));

        setData(parsedData);
        if (parsedData.length > 0) {
          setSelectedCollege(parsedData[0].college_id);
        }
      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    fetchData();
  }, [last.degree, last.caste, last.branch]);

  useEffect(() => {
    if (data.length > 0) {
      const filteredData = data.filter(
        (item) => item.college_id === selectedCollege
      );
      const years = Object.keys(visibleLines).filter(
        (year) => visibleLines[year]
      );

      let minValue = Infinity,
        maxValue = -Infinity;

      filteredData.forEach((item) => {
        years.forEach((year) => {
          const value = item[year];
          if (value) {
            minValue = Math.min(minValue, value);
            maxValue = Math.max(maxValue, value);
          }
        });
      });

      setYAxisDomain([
        Math.floor(minValue / 10000) * 10000,
        Math.ceil(maxValue / 10000) * 10000,
      ]);
    }
  }, [selectedCollege, visibleLines, data]);

  const uniqueColleges = [...new Set(data.map((item) => item.college_id))];
  const filteredData = data.filter(
    (item) => item.college_id === selectedCollege
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg text-xs sm:text-sm">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.stroke }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value) => `${(value / 1000).toFixed(0)}k`;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="font-bold text-xl sm:text-2xl text-center my-4 mb-8">
        Analyse Last 5 Years Cutoff
      </h1>

      <div className="mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="font-medium">Select College:</label>
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="border rounded p-2 w-full sm:w-auto min-w-[200px] sm:min-w-[400px]">
            {uniqueColleges.map((collegeId) => {
              const collegeName = data.find(
                (item) => item.college_id === collegeId
              )?.college_name;
              return (
                <option key={collegeId} value={collegeId}>
                  {collegeId} - {collegeName}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="h-[400px] sm:h-[600px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {last.degree === "engineering" && (
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 20, left: 40, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="branch"
                angle={window.innerWidth < 640 ? -45 : 0}
                textAnchor="end"
                height={window.innerWidth < 640 ? 60 : 40}
                interval={0}
                fontSize={12}
              />
              <YAxis
                label={{
                  value: "Cutoff Rank",
                  angle: -90,
                  position: "insideLeft",
                }}
                domain={yAxisDomain}
                ticks={Array.from(
                  { length: (yAxisDomain[1] - yAxisDomain[0]) / 10000 + 1 },
                  (_, i) => yAxisDomain[0] + i * 10000
                )}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={48} />
              {Object.keys(visibleLines).map(
                (year) =>
                  visibleLines[year] && (
                    <Line
                      key={year}
                      type="monotone"
                      dataKey={year}
                      stroke={COLORS[year]}
                      strokeWidth={2}
                      name={`Cutoff ${year}`}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graph;
