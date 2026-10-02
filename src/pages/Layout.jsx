import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { logout } from "../services/authService"
import { toast } from "react-toastify"
import {
    BsGridFill
} from "react-icons/bs"
import { MdCategory } from "react-icons/md"
import { FaRupeeSign, FaSignOutAlt } from "react-icons/fa"
import { HiMenuAlt1 } from "react-icons/hi"
import { HiDocumentChartBar } from "react-icons/hi2"
import logo from "../assets/violet_bg.png"
import { useState } from "react"

function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(false);
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

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
            name: "Income / Expense",
            path: "/expense",
            icon: <FaRupeeSign />,
        },
        {
            name: "Category",
            path: "/category",
            icon: <MdCategory />,
        },
        {
            name: "Monthly Report",
            path: "/monthly-report",
            icon: <HiDocumentChartBar />,
        },
    ];

    const handleNavbar = () => setShowNavbar((isOpen) => !isOpen);

    return (
        <div className="min-h-screen bg-white flex">

            {/* ================= SIDEBAR ================= */}
            {showNavbar && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={() => setShowNavbar(false)}
                    className="fixed inset-0 z-40 bg-black/30 md:hidden"
                />
            )}
            <aside className={`fixed left-0 top-0 bottom-0 z-50 bg-(--primary-color) flex w-64 flex-col border border-black/10 text-white shadow-2xl transition-transform duration-200 md:translate-x-0 ${showNavbar ? "translate-x-0" : "translate-x-[-110%]"}`}>

                {/* Logo */}
                <div className="h-16 flex items-center justify-center px-4 border-b border-white/10">
                    <div className="h-12 w-auto overflow-hidden rounded-sm bg-white flex items-center justify-center">
                        <img
                            src={"/assets/logo-white-bg.png"}
                            alt="logo"
                            className="h-full w-auto object-contain"
                        />
                    </div>
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
            <main className="ml-0 h-dvh min-h-0 flex-1 overflow-y-auto rounded-2xl md:ml-64">

                {/* Topbar */}
                <header className="py-2 fixed top-0 right-1 z-30 sm:h-[64px] w-full md:w-[calc(100%-260px)] bg-(--primary-color)
 border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-3 sm:px-5 lg:px-6 flex items-center justify-between
                ">

                    <button
                        type="button"
                        onClick={handleNavbar}
                        className="text-white md:hidden cursor-pointer hover:bg-amber-50/10 p-3 rounded-full transition"
                    >
                        <HiMenuAlt1 size={24} />
                    </button>

                    <div>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-3">

                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold text-white">
                                {name}
                            </p>

                            <p className="text-xs text-white">
                                {email}
                            </p>
                        </div>

                        <div className="
                            w-8 h-8
                            rounded-full
                            bg-white
                            flex items-center justify-center
                        " >
                            <p className="text-sm font-semibold uppercase text-[var(--primary-color)]">
                                {name.charAt(0)}
                            </p>
                        </div>

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