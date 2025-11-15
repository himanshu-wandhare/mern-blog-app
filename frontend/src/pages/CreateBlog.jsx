import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import toast from "react-hot-toast";

export default function CreateBlog() {
    const [title, setTitle] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [featuredImage, setFeaturedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const editorRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize Editor.js
        if (!editorRef.current) {
            editorRef.current = new EditorJS({
                holder: "editorjs",
                tools: {
                    header: {
                        class: Header,
                        config: {
                            levels: [2, 3, 4],
                            defaultLevel: 2,
                        },
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                    },
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                    },
                },
                placeholder: "Start writing your blog content here...",
            });
        }

        return () => {
            if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }
            setFeaturedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Please provide a title");
            return;
        }

        if (!featuredImage) {
            toast.error("Please upload a featured image");
            return;
        }

        setLoading(true);

        try {
            const outputData = await editorRef.current.save();

            if (!outputData.blocks || outputData.blocks.length === 0) {
                toast.error("Please add some content to your blog");
                setLoading(false);
                return;
            }

            // Convert Editor.js output to HTML
            const htmlContent = outputData.blocks
                .map((block) => {
                    switch (block.type) {
                        case "header":
                            return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                        case "paragraph":
                            return `<p>${block.data.text}</p>`;
                        case "list": {
                            const listItems = block.data.items
                                .map((item) => {
                                    // Handle both string and object formats
                                    const itemText =
                                        typeof item === "string"
                                            ? item
                                            : item.content || item.text || "";
                                    return `<li>${itemText}</li>`;
                                })
                                .join("");
                            return block.data.style === "ordered"
                                ? `<ol>${listItems}</ol>`
                                : `<ul>${listItems}</ul>`;
                        }
                        case "quote":
                            return `<blockquote><p>${block.data.text}</p>${
                                block.data.caption
                                    ? `<cite>${block.data.caption}</cite>`
                                    : ""
                            }</blockquote>`;
                        default:
                            return "";
                    }
                })
                .join("");

            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", htmlContent);
            formData.append("visibility", visibility);
            formData.append("featuredImage", featuredImage);

            await axios.post("/blogs", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Blog created successfully!");
            navigate("/my-blogs");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to create blog"
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Create New Blog Post
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your blog title"
                        required
                    />
                </div>

                {/* Featured Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-4 w-full h-64 object-cover rounded-md"
                        />
                    )}
                </div>

                {/* Visibility */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visibility
                    </label>
                    <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="public">
                            Public - Visible to everyone
                        </option>
                        <option value="private">
                            Private - Only visible to you
                        </option>
                    </select>
                </div>

                {/* Editor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                    </label>
                    <div
                        id="editorjs"
                        className="border border-gray-300 rounded-md p-4 min-h-[400px] prose max-w-none"
                    ></div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate("/my-blogs")}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Blog"}
                    </button>
                </div>
            </form>
        </div>
    );
}
