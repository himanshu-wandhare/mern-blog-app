import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/");
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="text-2xl font-bold text-indigo-600"
                        >
                            BlogSpace
                        </Link>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Home
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/my-blogs"
                                    className="text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    My Blogs
                                </Link>
                                <Link
                                    to="/create"
                                    className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 whitespace-nowrap"
                                >
                                    Create
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                                <div className="hidden md:flex items-center text-sm text-gray-600 pl-2 border-l border-gray-300">
                                    <span className="" title={user.name}>
                                        Hi,{" "}
                                        <span className="font-semibold">
                                            {user.name}
                                        </span>
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 whitespace-nowrap"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
