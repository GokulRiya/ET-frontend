
function Profile() {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    // console.log(user);

    return (
        <div className="group relative flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700/80 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 min-w-0">
                {/* Avatar with Online Status Indicator */}
                <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center font-semibold text-white shadow-inner text-sm tracking-wider ring-1 ring-white/20">
                        {/* {initials} */}
                    </div>
                    {/* Active status pulse */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                </div>

                {/* User Info with Ellipsis handling */}
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-100 truncate tracking-tight group-hover:text-white">
                        {name}
                    </span>
                    <span className="text-xs text-slate-400 truncate font-mono">
                        {email}
                    </span>
                </div>
            </div>

        </div>
    )
}

export default Profile