import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { getUsers } from "../services/authService";
import { FaSignOutAlt } from "react-icons/fa"
import { logout } from "../services/authService"

const getInitials = (fullName = "") => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "U";
    return parts
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();
};

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUserProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getUsers();
            // Adjust to your backend response shape (res.data or res)
            const data = res?.data ?? res;
            setUser(Array.isArray(data) ? data[0] : data);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            setError("Couldn't load your profile");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
        toast.info("Logout successfully!");
    };

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    if (loading) {
        return (
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen overall-bg">
                <div className="flex flex-col items-center gap-3 py-6" aria-busy="true">
                    <div className="h-24 w-24 animate-pulse rounded-full bg-slate-200" />
                    <div className="h-4 w-36 animate-pulse rounded-full bg-slate-200" />
                    <div className="h-3 w-44 animate-pulse rounded-full bg-slate-100" />
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen overall-bg">
                <div
                    role="alert"
                    className="flex flex-col items-center gap-2 py-6 text-center text-sm text-rose-600"
                >
                    <span>{error || "No user data found"}</span>
                    <button
                        onClick={fetchUserProfile}
                        className="rounded-lg bg-rose-50 px-3 py-1.5 font-medium text-rose-700 transition hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen overall-bg">
            <div className="flex flex-col items-center py-6 text-center">
                {/* Avatar: soft lavender ring, photo if available, else initials */}
                <div className="rounded-full bg-violet-100 p-1 ring-2 ring-violet-300">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-24 w-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-(--primary-color) text-3xl font-semibold text-white">
                            {getInitials(user.name)}
                        </div>
                    )}
                </div>

                <h2 className="mt-4 max-w-full truncate text-base font-bold text-slate-900">
                    {user.name}
                </h2>
                <p className="mt-0.5 max-w-full truncate text-sm text-slate-400">
                    {user.email}
                </p>
                {/* Logout */}
                <div className="py-2">

                    <button
                        type="button"
                        onClick={handleLogout}
                        className=" w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-black hover:text-white border"
                    >
                        <FaSignOutAlt className="text-lg" />

                        <span className="text-sm font-medium">
                            Sign out
                        </span>
                    </button>

                </div>
            </div>

        </div>
    );
}

export default Profile;