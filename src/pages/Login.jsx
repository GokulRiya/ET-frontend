import { useState } from "react"
import logo from "../../public/assets/icon-192.webp"
import {
    BsFillEnvelopeFill,
    BsEyeSlashFill, BsEye,
    BsFillLockFill
} from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"
import { login } from '../services/authService'
import { toast } from "react-toastify"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await login({
                email,
                password
            });
            if (response) {
                navigate('/dashboard', { replace: true });
                toast.success("Login Successful");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Login failed!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">

            <div className="w-full max-w-md">

                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg">
                        <img src={logo} alt="logo" className="rounded-2xl" />
                    </div>

                    <h1 className="text-2xl font-bold text-(--primary-color) sm:text-3xl">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm text-(--secondary-color) ">
                        Login to your ETS account
                    </p>
                </div>

                {/* Login Card - using <main> to satisfy landmark requirement */}
                <main className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-(--primary-color)">
                                Email Address
                            </label>

                            <div className="relative">
                                <BsFillEnvelopeFill size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-(--primary-color) outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/10"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-(--primary-color)">
                                    Password
                                </label>
                            </div>

                            <div className="relative">
                                <BsFillLockFill size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 pr-12 text-sm text-(--primary-color) outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                                {/* 40x40px touch target (exceeds the 24px min, comfortably hits the 48px touch recommendation) */}
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-md cursor-pointer text-gray-400 hover:text-(--primary-color) transition-colors"
                                >
                                    {showPassword ? <BsEye size={18} /> : <BsEyeSlashFill size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-(--primary-color) cursor-pointer px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-(--secondary-color) focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99]"
                        >
                            Login
                        </button>

                    </form>

                    {/* Register */}
                    <div className="mt-6 text-center">
                        <p className="text-sm">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-semibold text-(--secondary-color)">
                                Create account
                            </Link>
                        </p>
                    </div>

                </main>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-600">
                    © 2026 Expenslytic. All rights reserved.
                </p>

            </div>
        </div>
    );
}

export default Login;