import { useState } from "react"
import {
    BsFillEnvelopeFill, BsFillPersonFill,
    BsEyeSlashFill, BsEye,
    BsFillLockFill
} from "react-icons/bs"
import { Link } from "react-router-dom"
import { register } from "../services/authService"
import { toast } from "react-toastify"
import logo from "../../public/assets/icon-192.webp"
import { useNavigate } from "react-router-dom"

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await register({
                name,
                email,
                password,
                role: 'user'
            });
            toast.success("Registration successful!");
            setName("");
            setEmail("");
            setPassword("");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Registration failed!');
        }
    }
    return (
        <>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">

                <div className="w-full max-w-md">

                    {/* Logo / Brand */}
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg">
                            <img src={logo} alt="logo" className="rounded-2xl" />
                        </div>

                        <p className="text-(--primary-color) text-2xl font-extrabold leading-tight mb-3">
                            Join the <span className="text-(--secondary-color)">ETS</span> team.
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Create an account to manage expense, categories, and routes from one dashboard.
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                                <div className="relative">
                                    <BsFillPersonFill size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                                </div>

                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <BsFillEnvelopeFill size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email" required
                                        className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/10" /> </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                </div>

                                <div className="relative">
                                    <BsFillLockFill size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 pr-20 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-(--primary-color) hover:text-(--primary-color)"
                                    >
                                        {showPassword ? <BsEye /> : <BsEyeSlashFill />}
                                    </button>
                                </div>
                            </div>


                            {/* Register Button */}
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-(--primary-color) cursor-pointer px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-(--secondary-color) focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99]"
                            >
                                Register
                            </button>

                        </form>

                        {/* Register */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                Already have an account? {" "}
                                <Link
                                    className="font-semibold text-(--primary-color) hover:text-(--secondary-color)"
                                    to="/login">
                                    Login
                                </Link>
                            </p>
                        </div>

                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-gray-400">
                        © 2026 Expenslytic. All rights reserved.
                    </p>

                </div>
            </div>
        </>
    )
}

export default Register