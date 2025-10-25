import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from '../../Components/Loader' // optional, use previous loader component
import { API_PATHS } from "../../Utils/apiPath";
import axiosInstance from "../../Utils/axiosInstance";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: "",
  });

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.EXPENSES.GET);
      console.log(res)
      setExpenses(res.data.expenses);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch expenses");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.date) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axios.post("/api/expense/add", form);
      toast.success("Expense added successfully");
      setForm({ category: "", amount: "", date: "" });
      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding expense");
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await axios.delete(`/api/expense/delete/${id}`);
      toast.success("Expense deleted");
      fetchExpenses();
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  // Download as Excel
  const handleDownload = async () => {
    try {
      const res = await axios.get("/api/expense/download", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.xlsx");
      document.body.appendChild(link);
      link.click();
      toast.success("Download started");
    } catch (error) {
      toast.error("Failed to download expenses");
    }
  };

  if (loading) return <Loader/>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-center text-pink-400 mb-6">💸 Expense Tracker</h2>

        {/* Form Section */}
        <form
          onSubmit={handleAddExpense}
          className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8"
        >
          <input
            type="text"
            placeholder="Category"
            className="w-full md:w-1/4 bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            className="w-full md:w-1/4 bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            type="date"
            className="w-full md:w-1/4 bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <button
            type="submit"
            className="w-full md:w-1/4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            Add Expense
          </button>
        </form>

        {/* Download Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:scale-105 transition-all px-5 py-2 rounded-lg font-semibold text-black"
          >
            ⬇️ Download Excel
          </button>
        </div>

        {/* Expense List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white/5 rounded-lg overflow-hidden">
            <thead>
              <tr className="text-pink-400 border-b border-white/10">
                <th className="p-3">Category</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr
                  key={exp._id}
                  className="border-b border-white/10 hover:bg-white/10 transition-all"
                >
                  <td className="p-3 capitalize">{exp.category}</td>
                  <td className="p-3 text-pink-300 font-semibold">₹{exp.amount}</td>
                  <td className="p-3">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="text-red-400 hover:text-red-600 transition-all font-medium"
                    >
                      ✖ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {expenses.length === 0 && (
            <p className="text-center text-gray-400 py-6">No expenses found 😔</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expense;
