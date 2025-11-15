import { Link } from "react-router-dom";

export default function BlogCard({ blog, showActions, onDelete }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getExcerpt = (content) => {
        // Create a temporary div to decode HTML entities
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        const plainText = tempDiv.textContent || tempDiv.innerText || "";
        return plainText.length > 150
            ? plainText.substring(0, 150) + "..."
            : plainText;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            blog.visibility === "public"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {blog.visibility}
                    </span>
                    <span className="text-sm text-gray-500">
                        {formatDate(blog.createdAt)}
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-indigo-600">
                    <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                </h2>

                <p className="text-gray-600 mb-4">{getExcerpt(blog.content)}</p>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        By{" "}
                        <span className="font-semibold">
                            {blog.author.name}
                        </span>
                    </div>

                    <div className="flex space-x-2">
                        <Link
                            to={`/blog/${blog._id}`}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                            Read More →
                        </Link>

                        {showActions && (
                            <>
                                <Link
                                    to={`/edit/${blog._id}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => onDelete(blog._id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
