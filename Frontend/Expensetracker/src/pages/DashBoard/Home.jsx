import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPath";
import Loader from "../../Components/Loader";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";
import { UserContext } from "../../Context/UserContaxt"; // we’ll use dashboard refresh trigger

const COLORS = ["#10b981", "#ef4444", "#3b82f6"];

const Home = () => {
  const [data, setData] = useState(null);
  const { dashboardUpdated } = useContext(UserContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.DASHBOARD);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, [dashboardUpdated]); // ✅ now listens to changes


  if (!data) return <Loader />;

  const chartData = [
    { name: "Income", value: data.totalIncome },
    { name: "Expense", value: data.totalExpense },
    { name: "Balance", value: data.balance },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-5 sm:p-8 transition-all duration-500">
      <h1 className="text-3xl font-semibold tracking-tight mb-8 text-purple-500">
        Dashboard Overview
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card title="Total Income" value={data.totalIncome} color="emerald" />
        <Card title="Total Expense" value={data.totalExpense} color="rose" />
        <Card title="Balance" value={data.balance} color="blue" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* Bar Chart */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all">
          <h2 className="text-xl font-semibold mb-4 text-purple-500">Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barGap={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                }}
              />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {chartData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all">
          <h2 className="text-xl font-semibold mb-4 text-purple-500">Distribution Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {chartData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                }}
              />
              <Legend wrapperStyle={{ color: "#9ca3af" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 mt-10">
        <h2 className="text-xl font-semibold mb-4 text-purple-500">Recent Transactions</h2>
        <ul className="divide-y divide-gray-700">
          {data.last5Transactions.map((t, i) => (
            <li key={i} className="py-4 flex justify-between items-center px-3 hover:bg-gray-700/50 rounded-md">
              {t.type === "income"
                ? <FaArrowTrendUp className="text-emerald-400" />
                : <FaArrowTrendDown className="text-rose-400" />}
              <span className="text-gray-300">{t.source || t.category}</span>
              <span className={`font-semibold ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                ₹{t.amount}
              </span>
              <span className="text-gray-500 text-sm">{new Date(t.date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div className={`bg-gradient-to-br from-${color}-500/20 to-${color}-600/30 p-6 rounded-2xl border border-gray-700 shadow-md hover:shadow-lg transition-transform transform hover:scale-105`}>
    <h2 className="text-gray-300 text-sm uppercase tracking-wide">{title}</h2>
    <p className="text-3xl font-bold text-gray-100 mt-2">₹{value}</p>
  </div>
);

export default Home;
