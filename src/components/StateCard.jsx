function StatCard({ label, value }) {
    return (
        <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className={label ==="Total income" ? "text-2xl text-emerald-600 font-bold tracking-tight" : "text-red-600 text-2xl font-bold tracking-tight"}>{value}</p>
            </div>
        </div>
    );
}

export default StatCard