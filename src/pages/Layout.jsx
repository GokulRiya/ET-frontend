import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { logout } from "../services/authService"
import { toast } from "react-toastify"
import { BsGridFill } from "react-icons/bs"
import { MdCategory } from "react-icons/md"
import { FaRupeeSign, FaSignOutAlt } from "react-icons/fa"
import { CgMenuRightAlt } from "react-icons/cg"
import { HiDocumentChartBar } from "react-icons/hi2"
import { useState, useRef, useEffect } from "react"

function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(false);
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const mainContentRef = useRef(null);

    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo(0, 0);
        }
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
        toast.info("Logout successfully!");
    };

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <BsGridFill />,
        },
        {
            name: "Incomes / Expenses",
            path: "/expense",
            icon: <FaRupeeSign />,
        },
        {
            name: "Categories",
            path: "/category",
            icon: <MdCategory />,
        },
        {
            name: "Monthly Reports",
            path: "/monthly-report",
            icon: <HiDocumentChartBar />,
        },
    ];

    const handleNavbar = () => setShowNavbar((isOpen) => !isOpen);

    return (
        <div className="flex h-screen overflow-hidden">

            {/* ================= SIDEBAR ================= */}
            {showNavbar && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={() => setShowNavbar(false)}
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                />
            )}
            <aside className={`fixed left-0 top-0 bottom-0 z-50 bg-(--primary-color) flex w-64 flex-col border border-black/10 text-white shadow-2xl transition-transform duration-200 lg:translate-x-0 ${showNavbar ? "translate-x-0" : "translate-x-[-110%]"}`}>

                {/* Logo */}
                <div className="h-16 flex items-center justify-start px-6 gap-3 border-b border-white/10">
                    <Link to="/dashboard" onClick={() => setShowNavbar(false)} className="flex items-center gap-3">
                        <img
                            src={"/assets/icon-192.webp"}
                            alt="logo"
                            className="h-10 w-10 object-contain rounded-xl bg-white shadow-sm transition-transform hover:scale-105 duration-200"
                        />
                        <span className="text-md font-bold tracking-tight text-white">Expense Analytics</span>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4 py-6 overflow-auto">

                    <nav className="space-y-2">

                        {menuItems.map((item) => {
                            const active = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setShowNavbar(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                        ${active
                                            ? "bg-white text-[var(--primary-color)] shadow-lg shadow-indigo-600/20"
                                            : "text-white hover:bg-white hover:text-[var(--primary-color)]"
                                        }
                                    `}
                                >
                                    <span className="text-lg">
                                        {item.icon}
                                    </span>

                                    <span className="text-sm font-medium">
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}

                    </nav>

                    {/* Logout */}
                    <div className="py-2">

                        <button
                            type="button"
                            onClick={handleLogout}
                            className=" w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-white hover:text-red-400 hover:bg-red-500/10 transition"
                        >
                            <FaSignOutAlt className="text-lg" />

                            <span className="text-sm font-medium">
                                Logout
                            </span>
                        </button>

                    </div>
                </div>

            </aside>


            {/* ================= MAIN ================= */}
            <main ref={mainContentRef} className="ml-0 h-dvh min-h-0 flex-1 overflow-y-auto rounded-2xl lg:ml-64">

                {/* Topbar */}
                <header className="fixed top-0 right-0 z-30 flex h-16 w-full lg:w-[calc(100%-16rem)] items-center justify-between border-b border-black/10 bg-[var(--primary-color)] px-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] sm:px-5 lg:px-6">
                    {/* Mobile Brand / Logo */}
                    <div className="flex items-center">
                        <Link
                            to="/dashboard"
                            onClick={() => setShowNavbar(false)}
                            className="flex lg:hidden items-center gap-3"
                        >
                            <img
                                src="/assets/icon-192.webp"
                                alt="logo"
                                className="h-10 w-10 rounded-xl bg-white object-contain shadow-sm transition-transform duration-200 hover:scale-105"
                            />
                            <span className="text-md font-bold tracking-tight text-white">
                                Expense Analytics
                            </span>
                        </Link>
                    </div>

                    {/* User & Menu */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* User Details */}
                        <div className="hidden lg:block text-right">
                            <p className="text-sm font-semibold leading-tight text-white" title={name}>
                                {name?.length > 15 ? `${name.slice(0, 15)}...` : name}
                            </p>
                            <p className="text-xs text-white/80" title={email}>
                                {email?.length > 15 ? `${email.slice(0, 10)}...` : email}
                            </p>
                        </div>

                        {/* Avatar */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                            <span className="text-sm font-semibold uppercase text-[var(--primary-color)]">
                                {name?.charAt(0) || "U"}
                            </span>
                        </div>

                        {/* Mobile Toggle Button */}
                        <button
                            type="button"
                            onClick={handleNavbar}
                            aria-label="Toggle navigation menu"
                            className="cursor-pointer rounded-full p-1 sm:p-1.5 text-white transition hover:bg-white/10 lg:hidden"
                        >
                            <CgMenuRightAlt size={30} />
                        </button>
                    </div>
                </header>


                {/* Page Content */}
                <section className="w-full min-h-screen pt-[76px] sm:pt-[60px]">
                    <Outlet />
                </section>

            </main>

        </div>
    );
}

export default Layout;