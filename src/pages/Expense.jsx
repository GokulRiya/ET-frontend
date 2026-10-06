import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { getExpenses, createExpense, getExpenseById, updateExpense, deleteExpense } from "../services/expenseService"
import { toast } from 'react-toastify'
import { FaPlusCircle, FaRupeeSign, FaSearch } from "react-icons/fa"
import { RiEdit2Fill } from "react-icons/ri"
import { MdDelete, MdDateRange } from "react-icons/md"
import { BsCalendar2MonthFill } from "react-icons/bs"
import { getCategorys } from "../services/categoryService"

function Expense() {
    const [loading, setLoading] = useState(true);
    const [Expense, setExpense] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newExpense, setNewExpense] = useState(
        {
            categoryId: '',
            date: '',
            amount: "",
            description: ""
        });
    const [editExpense, setEditExpense] = useState(null);
    const [searchCategory, setSearchCategory] = useState("");
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const today = new Date();

    const minMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().slice(0, 7);
    const maxMonth = today.toISOString().slice(0, 7);

    const handleMonthChange = (e) => {
        const selected = e.target.value;

        if (selected > maxMonth) {
            setMonth(maxMonth);
            toast.warning("Future months cannot be selected");
            return;
        }

        if (minMonth && selected < minMonth) {
            setMonth(minMonth);
            toast.warning("You can only select up to the last 3 months");
            return;
        }

        setMonth(selected);
    };

    const int = (n) => "₹" + n.toLocaleString("en-IN");

    // Fetch Expense
    const fetchExpense = async (search = "", month = '') => {
        setLoading(true);
        try {
            const response = await getExpenses(search, month);
            if (response && response.data) {
                setExpense(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Fetch failed!');
        } finally {
            setLoading(false);
        }
    };

    // Fetch  Expense
    const fetchCategory = async () => {
        try {
            const response = await getCategorys({});
            if (response && response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Fetch failed!');
        }
    };

    useEffect(() => {
        if (searchCategory != "" && month != "") {
            const timer = setTimeout(() => {
                fetchExpense(searchCategory, month);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            fetchExpense(searchCategory, month);
        }

    }, [searchCategory, month]);

    // Handle form submit for adding a Expense
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            let response;
            if (editExpense) {
                response = await updateExpense(editExpense._id, newExpense);
            } else {
                response = await createExpense(newExpense);
            }
            if (!response.success) {
                toast.error(response.message || "Expense already exists");
                return;
            }
            toast.success(editExpense ? "Expense updated successfully!" : "Expense added successfully!");
            setShowModal(false);
            setEditExpense(null);
            setNewExpense({
                categoryId: "",
                date: "",
                amount: "",
                description: ""
            });
            fetchExpense(searchCategory, month);
        } catch (error) {
            toast.error(error.response?.data?.message || (editExpense ? "Failed to update Expense" : "Failed to add Expense"));
            setLoading(false);
        }
    };

    // Edit Expense
    const handleEdit = async (e) => {
        try {
            fetchCategory();
            const response = await getExpenseById(e._id);
            const data = response.data;
            setEditExpense(data);
            setShowModal(true);
            setNewExpense({
                categoryId: data.categoryId?._id,
                date: new Date(data.date).toISOString().split("T")[0],
                amount: data.amount,
                description: data.description
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load Expense");
        }
    }

    // Delete Expense
    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            toast.success("Expense deleted successfully!");
            fetchExpense(searchCategory, month);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete Expense");
        }

    }
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen overall-bg">
            {/* Header Section */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Income / Expense</h1>
                <p className="mt-1 text-sm text-slate-500">Manage income and expense records registered under your administration.</p>
            </div>
            {/* Button to trigger Add Expense Modal */}
            <div className="flex flex-col md:flex-row justify-end gap-4 mb-4">
                {/* Button to trigger Add Category Modal */}
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <BsCalendar2MonthFill size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="month"
                            value={month}
                            onChange={handleMonthChange}
                            placeholder="Search by month"
                            required
                            min={minMonth}
                            max={maxMonth}
                            className="block
                            w-full
                            min-w-0
                            max-w-full
                            appearance-none rounded-lg border border-gray-300 px-4 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                    </div>
                    <div className="relative">
                        <FaSearch size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="text"
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            placeholder="Search by description, amount"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                    </div>
                </div>
                <button
                    onClick={() => {
                        fetchCategory();
                        setEditExpense(null);
                        setNewExpense({
                            categoryId: "",
                            date: "",
                            amount: "",
                            description: ""
                        });
                        setShowModal(true);
                    }}
                    className="inline-flex items-center justify-center rounded-lg bg-(--primary-color) cursor-pointer px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-(--secondary-color) transition duration-200"
                >
                    <FaPlusCircle size={19} className="pointer-events-none mr-2" /> Add Expense
                </button>

            </div>

            {/* Modal Overlay */}
            {showModal && createPortal((
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 h-screen">
                    <div className="flex w-full min-w-0 max-w-md flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl max-h-[90dvh]">

                        {/* Header */}
                        <div className="shrink-0 border-b border-slate-100 px-4 py-3 sm:px-6">
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                                {editExpense ? 'Edit Expense' : 'New Expense'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                            {/* Scrollable body */}
                            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        name="categoryId"
                                        value={newExpense.categoryId}
                                        onChange={(e) => setNewExpense({ ...newExpense, categoryId: e.target.value })}
                                        required
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base sm:text-sm text-gray-900 outline-none transition focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/10"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.categoryName} ({category.type})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Amount</label>
                                    <div className="relative">
                                        <FaRupeeSign size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            inputMode="decimal"
                                            value={newExpense.amount}
                                            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                            placeholder="Enter amount"
                                            min="1"
                                            required
                                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-base sm:text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                                    <div className="relative">
                                        <MdDateRange size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            value={newExpense.date}
                                            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                            min={new Date(today.getFullYear(), today.getMonth() - 2, 2).toISOString().split("T")[0]}
                                            max={new Date().toISOString().split("T")[0]}
                                            required
                                            className="block min-h-[46px] w-full min-w-0 max-w-full appearance-none rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-base sm:text-sm text-gray-900 outline-none transition focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        rows={3}
                                        value={newExpense.description}
                                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                        placeholder="Enter description"
                                        required
                                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-base sm:text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/10"
                                    />
                                </div>
                            </div>

                            {/* Pinned footer */}
                            <div className="shrink-0 flex flex-col-reverse gap-2 border-t border-slate-100 px-4 py-3 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditExpense(null); fetchExpense(searchCategory, month); }}
                                    className="w-full sm:w-auto cursor-pointer rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto cursor-pointer rounded-lg bg-(--primary-color) px-4 py-2.5 text-sm font-medium text-white hover:bg-(--secondary-color) disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? 'Please wait...' : editExpense ? 'Update Expense' : 'Save Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ), document.body)}

            {/* Table Container with modern shadows & rounding */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-4">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        {/* Table Header */}
                        <thead className="bg-gray-100 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="dark:text-gray-300 px-6 py-4">Date</th>
                                <th scope="col" className="dark:text-gray-300 px-6 py-4">Type</th>
                                <th scope="col" className="dark:text-gray-300 px-6 py-4">Category</th>
                                <th scope="col" className="dark:text-gray-300 px-6 py-4">Description</th>
                                <th scope="col" className="dark:text-gray-300 px-6 py-4">Amount</th>
                                <th scope="col" className="dark:text-gray-300 px-6 py-4">Action</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center">
                                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500" role="status">
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" aria-hidden="true" />
                                            <span>Loading expenses...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : Expense && Expense.length > 0 ? (
                                Expense.map((value, index) => (
                                    <tr key={index} className="hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/50">

                                        <td className="whitespace-nowrap px-6 py-2.5 font-medium text-slate-900 dark:text-slate-200">
                                            {new Date(value.date).toLocaleDateString()}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-2.5 font-medium text-slate-900 dark:text-slate-200 capitalize">
                                            {value.type}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-2.5 font-medium text-slate-900 dark:text-slate-200 capitalize">
                                            {value.categoryId?.categoryName}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-2.5 font-medium text-slate-900 dark:text-slate-200">
                                            {value.description}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-2.5 font-medium text-slate-900 dark:text-slate-200 capitalize">
                                            {int(value.amount)}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-2.5 flex gap-4">
                                            <RiEdit2Fill onClick={() => handleEdit(value)} size={19} title="Edit" className="cursor-pointer text-indigo-500 hover:text-indigo-700" />
                                            <MdDelete onClick={() => handleDelete(value._id)} size={19} title="Delete" className="cursor-pointer text-red-500 hover:text-red-700" />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                /* Empty State */
                                <tr className="p-6 w-full text-sm text-slate-400">
                                    <td colSpan="3" className="p-6">
                                        No Incomes / Expenses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Expense;
