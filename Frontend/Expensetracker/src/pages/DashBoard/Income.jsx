import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../Components/Loader";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPath";
import { UserContext } from "../../Context/UserContaxt";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [form, setForm] = useState({ icon: "", source: "", amount: "", date: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { triggerDashboardUpdate } = useContext(UserContext);


  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.INCOME.GET);
      setIncomes(res.data.incomes || []);
      setTotalIncome(res.data.totalIncome || 0);
    } catch (err) {
      toast.error("Failed to fetch incomes");
      console.error("fetchIncomes error:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

 const handleAddIncome = async (e) => {
  e.preventDefault();

  // ... validate 
  const payload = {
  icon: form.icon?.trim() || "",       // optional icon field
  source: form.source.trim(),          // income source (required)
  amount: Number(form.amount),         // amount in number (required)
  date: form.date                      // date string (required)
};

  const res = await axiosInstance.post(API_PATHS.INCOME.ADD, payload);
  if (res.status === 201 || res.data?.income) {
    toast.success("Income added successfully");
    setForm({ icon: "", source: "", amount: "", date: "" });
    fetchIncomes(); // keep table updated
    triggerDashboardUpdate(); // 🔑 notify Home dashboard
  }
};

const handleDelete = async (id) => {
  await axiosInstance.delete(`${API_PATHS.INCOME.DELETE}${id}`);
  toast.success("Income deleted");
  fetchIncomes();
  triggerDashboardUpdate(); // 🔑 notify Home dashboard
};

  const handleDownload = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "incomes.xlsx");
      document.body.appendChild(link);
      link.click();
      toast.success("Download started");
    } catch (err) {
      toast.error("Failed to download incomes");
      console.error("download error:", err?.response?.data || err.message);
    }
  };

  if (loading) return <Loader />;

  // Aggregate incomes by source
  const pieData = Object.values(
    incomes.reduce((acc, curr) => {
      if (acc[curr.source]) {
        acc[curr.source].value += Number(curr.amount);
      } else {
        acc[curr.source] = { name: curr.source, value: Number(curr.amount) };
      }
      return acc;
    }, {})
  );

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

  const monthMap = {};
  incomes.forEach(i => {
    const month = new Date(i.date).toLocaleString("default", { month: "short", year: "numeric" });
    monthMap[month] = (monthMap[month] || 0) + Number(i.amount);
  });
  const barData = Object.keys(monthMap).map(month => ({ month, amount: monthMap[month] }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-6 flex flex-col items-center space-y-8">
      <h1 className="text-3xl font-bold text-center text-green-400">💰 Income Management</h1>

      <form onSubmit={handleAddIncome} className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
        <input type="text" name="icon" placeholder="Icon" value={form.icon} onChange={handleChange} className="bg-white/10 text-white rounded-lg p-3 focus:ring-2 focus:ring-green-400" />
        <input type="text" name="source" placeholder="Source*" value={form.source} onChange={handleChange} className="bg-white/10 text-white rounded-lg p-3 focus:ring-2 focus:ring-green-400" required />
        <input type="number" name="amount" placeholder="Amount*" value={form.amount} onChange={handleChange} className="bg-white/10 text-white rounded-lg p-3 focus:ring-2 focus:ring-green-400" required />
        <input type="date" name="date" value={form.date} onChange={handleChange} className="bg-white/10 text-white rounded-lg p-3 focus:ring-2 focus:ring-green-400" required />
        <button disabled={submitting} type="submit" className={`col-span-1 sm:col-span-1 ${submitting ? "opacity-60 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-emerald-500"} text-white font-semibold p-3 rounded-lg shadow-lg hover:scale-105 transition-transform`}>
          {submitting ? "Adding..." : "Add Income"}
        </button>
      </form>

      <div className="w-full max-w-4xl text-right">
        <span className="text-xl font-semibold text-green-300">Total: ₹{totalIncome}</span>
      </div>

      <button onClick={handleDownload} className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white font-semibold shadow-lg transition-transform hover:scale-105">⬇️ Download Excel</button>

      {/* ... charts & table remain same ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-white/20">
          <h2 className="text-lg font-semibold text-center mb-4 text-green-400">Income by Source</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

        </div>

        <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-white/20">
          <h2 className="text-lg font-semibold text-center mb-4 text-green-400">Monthly Income</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="amount" fill="#36A2EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-x-auto w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-green-400/30 text-white">
              <th className="py-2 px-4">Icon</th>
              <th className="py-2 px-4">Source</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((inc) => (
              <tr key={inc._id} className="border-b border-white/20 hover:bg-white/10 transition-all">
                <td className="py-2 px-4">{inc.icon || "-"}</td>
                <td className="py-2 px-4">{inc.source}</td>
                <td className="py-2 px-4 text-green-300 font-semibold">₹{inc.amount}</td>
                <td className="py-2 px-4">{new Date(inc.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                  <button onClick={() => handleDelete(inc._id)} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-white font-semibold">Delete</button>
                </td>
              </tr>
            ))}
            {incomes.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-gray-300">No incomes found 😔</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Income;
