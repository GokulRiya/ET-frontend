import { useEffect, useState, useCallback } from "react"
import { getMonthlyReport } from "../services/reportService"
import { toast } from "react-toastify"
import { BsCalendar2MonthFill } from "react-icons/bs"

function MonthlyReport() {

    const [loading, setLoading] = useState(true);
    const today = new Date();
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const minMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 7);
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

    const [report, setReport] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        categoryData: [],
        expenses: []
    });

    const int = (number) => {
        return "₹ " + Number(number).toLocaleString("en-IN");
    };

    const fetchReport = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getMonthlyReport(month);
            if (response?.data) {
                setReport(response.data);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Report fetch failed!"
            );
        } finally {
            setLoading(false);
        }
    }, [month]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReport();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchReport]);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-4 bg-slate-50/50 min-h-screen overall-bg">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Monthly Report
                    </h1>
                    <p className="text-sm font-medium text-slate-500">
                        View your monthly income and expense report
                    </p>
                </div>

                <div className="relative w-full sm:w-64">
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
            </div>

            {loading ? (
                <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-sm text-slate-500" role="status">
                    <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" aria-hidden="true" />
                    <span className="font-medium tracking-wide">Loading report...</span>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Income Card */}
                        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border-1 border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-slate-400">
                                    Total Income
                                </p>
                                <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-emerald-600 mt-3 tracking-tight">
                                {int(report.totalIncome)}
                            </h2>
                        </div>

                        {/* Expense Card */}
                        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border-1 border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-slate-400">
                                    Total Expense
                                </p>
                                <span className="h-2 w-2 rounded-full bg-rose-500 ring-4 ring-rose-50" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-rose-600 mt-3 tracking-tight">
                                {int(report.totalExpense)}
                            </h2>
                        </div>

                        {/* Balance Card */}
                        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border-1 border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-slate-400">
                                    Net Balance
                                </p>
                                <span className="h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-indigo-50" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-indigo-600 mt-3 tracking-tight">
                                {int(report.balance)}
                            </h2>
                        </div>
                    </div>

                    {/* Category Summary */}
                    <div className="bg-white rounded-2xl border-1 border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 md:p-7">
                        <div className="mb-4 pb-3 border-b border-slate-100">
                            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                                Expense by Category
                            </h2>
                        </div>

                        {report.categoryData.length === 0 ? (
                            <div className="text-sm text-slate-400">
                                No data found for this month.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {report.categoryData.map((item) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between py-2.5 hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
                                    >
                                        <span className="text-sm font-medium text-slate-600">
                                            {item.name}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-900 tabular-nums">
                                            {int(item.value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Expenses Table */}
                    <div className="bg-white rounded-2xl border-1 border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                                Day Wise Expenses
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold tracking-wider text-slate-500">
                                    <tr>
                                        <th className="py-2.5 px-6">Date</th>
                                        <th className="py-2.5 px-6">Category</th>
                                        <th className="py-2.5 px-6">Type</th>
                                        <th className="py-2.5 px-6">Description</th>
                                        <th className="py-2.5 px-6 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {report.expenses.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-6 text-sm text-slate-400">
                                                No data found for this month.
                                            </td>
                                        </tr>
                                    ) : (
                                        report.expenses.map((item) => (
                                            <tr
                                                key={item._id}
                                                className="hover:bg-slate-50/60 transition-colors duration-150"
                                            >
                                                <td className="py-2.5 px-6 text-slate-500 text-xs font-medium tabular-nums">
                                                    {new Date(
                                                        item.date
                                                    ).toLocaleDateString("en-IN")}
                                                </td>
                                                <td className="py-2.5 px-6 font-medium text-slate-800">
                                                    {item.categoryId?.categoryName || "-"}
                                                </td>
                                                <td className="py-2.5 px-6 capitalize">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-6 text-slate-500 max-w-xs truncate">
                                                    {item.description || "-"}
                                                </td>
                                                <td className="py-2.5 px-6 text-right font-semibold text-slate-900 tabular-nums">
                                                    {int(item.amount)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default MonthlyReport;