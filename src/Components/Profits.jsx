import axios from "axios";
import { useState, useEffect } from "react";
import Piechart from "./Piechart";
import Navbar from "./Navbar";
import Backcomp from "./Backcomp";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Profits() {
  const [data, setData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [mode, setMode] = useState("day");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("⚠ No token found. Please login.");
      return;
    }

    let url = "";

    if (mode === "day") {
      url = "https://fooddevbackend-production.up.railway.app/api/dayprofits/";
    } else if (mode === "week") {
      url = "https://fooddevbackend-production.up.railway.app/api/weekprofits/";
    } else if (mode === "month") {
      url = "https://fooddevbackend-production.up.railway.app/api/monthprofits/";
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((resp) => {
        const formatted = resp.data.map((item) => ({
          label:
            mode === "day"
              ? item.day
              : mode === "week"
              ? `Week ${item.week}`
              : item.month,
          total: item.total_sum,
          profit: item.total_sum * 0.2,
        }));

        setData(formatted);
      })
      .catch((err) => {
        console.error("❌ API Error:", err);
      });
  }, [mode, token]);

  const onBarClick = (barData) => {
    if (mode === "day" && barData?.activeLabel) {
      setSelectedDay(barData.activeLabel);
    }
  };

  return (
    <>
      <div className="w-full">
        <Navbar />
      </div>

      <div>
        <Backcomp />
      </div>

      <div style={{ width: "100%", height: 500, marginBottom: 40 }}>
        
        {/* MODE BUTTONS */}
        <div className="flex gap-4 mb-4 mt-4">
          <button
            className={`px-4 py-2 rounded ${
              mode === "day" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("day")}
          >
            Daily
          </button>

          <button
            className={`px-4 py-2 rounded ${
              mode === "week" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("week")}
          >
            Weekly
          </button>

          <button
            className={`px-4 py-2 rounded ${
              mode === "month" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("month")}
          >
            Monthly
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-8 text-indigo-700">
          📊 {mode.toUpperCase()} Profit Summary
        </h2>

        <ResponsiveContainer>
          <BarChart
            data={data}
            onClick={mode === "day" ? onBarClick : null}
            barCategoryGap="15%"
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="label"
              tick={{ fill: "#4F46E5", fontWeight: "bold", fontSize: 13 }}
              interval={0}
              tickMargin={10}
            />

            <YAxis />

            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            <Legend />

            <Bar
              dataKey="total"
              fill="#65251cc0"
              name="Total Sales"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="profit"
              fill="#297f37ff"
              name="Profit (20%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {mode === "day" && <Piechart selectedDay={selectedDay} />}
      </div>
    </>
  );
}

export default Profits;