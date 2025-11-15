import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ViewBlog() {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            const { data } = await axios.get(`/blogs/${id}`);
            setBlog(data);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch blog"
            );
            console.error(error);
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                await axios.delete(`/blogs/${id}`);
                toast.success("Blog deleted successfully");
                navigate("/my-blogs");
            } catch (error) {
                toast.error("Failed to delete blog");
                console.error(error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!blog) {
        return null;
    }

    const isAuthor = user && user._id === blog.author._id;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            blog.visibility === "public"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {blog.visibility}
                    </span>
                    {isAuthor && (
                        <div className="flex space-x-2">
                            <Link
                                to={`/edit/${blog._id}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {blog.title}
                </h1>

                <div className="flex items-center text-gray-600 mb-6">
                    <span className="font-semibold">By {blog.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(blog.createdAt)}</span>
                    {blog.updatedAt !== blog.createdAt && (
                        <>
                            <span className="mx-2">•</span>
                            <span className="text-sm">
                                Updated {formatDate(blog.updatedAt)}
                            </span>
                        </>
                    )}
                </div>

                <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
            </div>

            {/* Content */}
            <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:list-disc prose-ul:ml-6 prose-ul:my-4 prose-ol:list-decimal prose-ol:ml-6 prose-ol:my-4 prose-li:my-2 prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Back Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
                <button
                    onClick={() => navigate(-1)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    ← Back to blogs
                </button>
            </div>
        </div>
    );
}
