function StatCard({ label, value }) {
    return (
        <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold tracking-tight">{value}</p>
            </div>
        </div>
    );
}

export default StatCard