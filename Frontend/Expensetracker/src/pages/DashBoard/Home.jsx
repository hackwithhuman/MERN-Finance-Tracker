import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../Components/Loader";
import { color } from "framer-motion";

const Home = () => {
  const [data, setData] = useState(null);
  const COLORS = ["#34d399", "#f87171"]; // Modern pastel shades for Income / Expense

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3030/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  if (!data) return <Loader />;

  const pieData = [
    { name: "Income", value: data.totalIncome },
    { name: "Expense", value: data.totalExpense },
  ];

  const barData = [
    {
      name: "Last 60 Days",
      Income: data.incomeLast60Days || 0,
      Expense: data.expenseLast60Days || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 md:p-10">
      <h1 className="text-4xl font-extrabold text-center text-white mb-8">
        Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Income"
          value={`₹${data.totalIncome}`}
          color="text-green-500"
        />
        <SummaryCard
          title="Total Expense"
          value={`₹${data.totalExpense}`}
          color="text-red-500"
        />
        <SummaryCard
          title="Balance"
          value={`₹${data.balanceAbsolute}`}
          color={
            data.balance > 0
              ? "text-green-500"
              : data.balance < 0
              ? "text-red-500"
              : "text-gray-500"
          }
        />
        <SummaryCard
          title="Status"
          value={data.balanceStatus}
          color="text-blue-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        {/* Pie Chart */}
        <div className="bg-gray-700 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-lg font-semibold mb-4 text-center text-white">
            Income vs Expense (Last 60 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-700 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-lg font-semibold mb-4 text-center text-white">
            Income & Expense Trend
          </h2>
          <ResponsiveContainer color="white" width="100%" height={300}>
            <BarChart  data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Income" fill="#34d399" barSize={40} radius={[6, 6, 0, 0]} />
              <Bar dataKey="Expense" fill="#f87171" barSize={40} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Last Transactions Table */}
      <div className="bg-gray-700 mt-10 rounded-2xl shadow-md p-6 overflow-x-auto hover:shadow-xl transition-all duration-300">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Last 5 Transactions
        </h2>
        <table className="w-full text-sm md:text-base border-collapse text-center">
          <thead>
            <tr className="bg-gray-700 text-white uppercase text-xs md:text-sm">
              <th className="py-3 px-4 border-b">Type</th>
              <th className="py-3 px-4 border-b">Category/Source</th>
              <th className="py-3 px-4 border-b">Amount</th>
              <th className="py-3 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.last5Transactions.length > 0 ? (
              data.last5Transactions.map((t) => (
                <tr
                  key={t._id}
                  className="border-b hover:bg-gray-600 transition duration-150"
                >
                  <td className="py-2 px-4 capitalize text-gray-200">
                    {t.category ? "Expense" : "Income"}
                  </td>
                  <td className="py-2 px-4 text-gray-200">
                    {t.category || t.source || "-"}
                  </td>
                  <td
                    className={`py-2 px-4 font-semibold ${
                      t.category ? "text-red-400" : "text-green-600"
                    }`}
                  >
                    ₹{t.amount}
                  </td>
                  <td className="py-2 px-4 text-gray-200">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ✅ Reusable Summary Card Component
const SummaryCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
    <h2 className="text-gray-500 font-medium">{title}</h2>
    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

export default Home;
