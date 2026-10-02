import StatCard from "../components/StateCard"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import { getDashboardData } from "../services/expenseService";
import { toast } from "react-toastify";

const inr = (n) => "₹" + n.toLocaleString("en-IN");
const chartColors = ["#0f766e", "#f97316", "#2563eb", "#e11d48", "#ca8a04", "#0891b2", "#0121b2", "#0891d2", "#0885b2"];

const ChartTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const data = payload[0].payload;

    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2">
            <p className="text-xs font-medium text-slate-500">
                {data.name}
            </p>

            <p className="text-sm font-semibold text-slate-800">
                ₹{data.value.toLocaleString("en-IN")}
            </p>
        </div>
    );
};

function Dashboard() {

    const [loading, setLoading] = useState(true);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [pieData, setpieData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));


    // Fetch expense
    const fetchExpense = async (month = "") => {
        setLoading(true);
        try {
            const response = await getDashboardData(month);
            setTotalIncome(response.data.totalIncome);
            setTotalExpense(response.data.totalExpense);
            setpieData(response.data.chartData.map((item, index) => ({
                ...item,
                color: chartColors[index % chartColors.length],
            })));
            setMonthlyData(response.data.expenses.map((item) => (
                {
                    name: item.categoryId.categoryName,
                    value: item.amount
                }
            )))
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Fetch failed!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            fetchExpense(month);
        }, 500);
        return () => clearTimeout(timer);
    }, [month]);


    const balance = totalIncome - totalExpense;
    const percentage = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen">
            <div className="min-h-screen text-slate-800">
                <div className="space-y-6">
                    <header className="flex flex-col">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Expense Tracker
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Your money at a glance for this month.
                            </p>

                        </div>
                    </header>

                    {loading ? (
                        <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-slate-500" role="status">
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" aria-hidden="true" />
                            <span>Loading dashboard...</span>
                        </div>
                    ) : (
                        <>
                            {/* Balance + income / expense */}
                            <section className="grid gap-4 lg:grid-cols-5">
                    <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white lg:col-span-3 sm:p-8">
                        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
                        <p className="text-sm text-slate-400">Balance</p>
                        <p className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">
                            {inr(balance)}
                        </p>

                        <div className="mt-8">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>{percentage}% of income spent</span>
                                <span>{inr(totalIncome)} earned</span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-emerald-400"
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
                        <StatCard
                            label="Total income"
                            value={inr(totalIncome)}
                            tone="emerald"
                            icon="M12 19V5m0 0l-6 6m6-6l6 6"
                        />
                        <StatCard
                            label="Total expense"
                            value={inr(totalExpense)}
                            tone="rose"
                            icon="M12 5v14m0 0l6-6m-6 6l-6-6"
                        />
                    </div>
                </section>

                {/* Charts */}
                <section className="grid min-w-0 gap-4 lg:grid-cols-2">
                    <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
                        <div className="mb-3">
                            <h2 className="text-sm font-semibold text-slate-800">Spending by category</h2>
                            <p className="mt-1 text-xs text-slate-500">Expense distribution</p>
                        </div>
                        {pieData.length > 0 ? (
                            <div className="flex min-w-0 flex-col items-center gap-3 sm:flex-row">
                                <div className="relative aspect-square w-full max-w-56 shrink-0 sm:w-1/2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius="66%"
                                                outerRadius="94%"
                                                paddingAngle={3}
                                                cornerRadius={4}
                                                stroke="none"
                                            >
                                                {pieData.map((item) => (
                                                    <Cell key={item.name} fill={item.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<ChartTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xs text-slate-500">Total spent</span>
                                        <span className="text-base font-bold text-slate-900">{inr(totalExpense)}</span>
                                    </div>
                                </div>
                                <ul className="w-full space-y-2.5">
                                    {pieData.map((item) => (
                                        <li key={item.name} className="flex min-w-0 items-center gap-2 text-xs">
                                            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
                                            <span className="min-w-0 flex-1 truncate text-slate-600">{item.name}</span>
                                            <span className="shrink-0 font-semibold text-slate-800">{inr(item.value)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="flex h-56 items-center justify-center text-sm text-slate-400">
                                No expense data yet
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
                        <div className="mb-3">
                            <h2 className="text-sm font-semibold text-slate-800">Monthly expenses</h2>
                        </div>
                        <div className="h-56 min-w-0 sm:h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={monthlyData}
                                    margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="monthlyExpenseFill"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#0f766e"
                                                stopOpacity={1}
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#2dd4bf"
                                                stopOpacity={0.75}
                                            />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        vertical={false}
                                        stroke="#e2e8f0"
                                        strokeDasharray="4 4"
                                    />

                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                                        tickFormatter={(value) =>
                                            value >= 1000 ? `${value / 1000}k` : value
                                        }
                                    />

                                    <Tooltip
                                        content={<ChartTooltip />}
                                        cursor={{ fill: "#f1f5f9" }}
                                    />

                                    <Bar
                                        dataKey="value"
                                        fill="url(#monthlyExpenseFill)"
                                        radius={[5, 5, 0, 0]}
                                        maxBarSize={38}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                            </section>
                        </>
                    )}
            </div>
        </div>
        </div >
    )
}

export default Dashboard