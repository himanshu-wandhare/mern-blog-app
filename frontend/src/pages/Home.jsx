import { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import toast from "react-hot-toast";

export default function Home() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get("/blogs/public");
            setBlogs(data);
        } catch (error) {
            toast.error("Failed to fetch blogs");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to BlogSpace
                </h1>
                <p className="text-lg text-gray-600">
                    Discover stories, thinking, and expertise from writers on
                    any topic.
                </p>
            </div>

            {blogs.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">
                        No blogs yet. Be the first to write!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <BlogCard
                            key={blog._id}
                            blog={blog}
                            showActions={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
