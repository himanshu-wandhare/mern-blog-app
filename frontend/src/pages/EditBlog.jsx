import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import toast from "react-hot-toast";

export default function EditBlogNew() {
    const [title, setTitle] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [featuredImage, setFeaturedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [editorBlocks, setEditorBlocks] = useState(null);

    const editorRef = useRef(null);
    const editorInitialized = useRef(false);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlog();

        return () => {
            if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
                editorRef.current = null;
                editorInitialized.current = false;
            }
        };
    }, [id]);

    const fetchBlog = async () => {
        try {
            const { data } = await axios.get(`/blogs/${id}`);
            setTitle(data.title);
            setVisibility(data.visibility);
            setCurrentImage(data.featuredImage);

            // Convert HTML content back to Editor.js blocks
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.content, "text/html");
            const blocks = [];

            doc.body.childNodes.forEach((node) => {
                if (
                    node.nodeName === "H2" ||
                    node.nodeName === "H3" ||
                    node.nodeName === "H4"
                ) {
                    blocks.push({
                        type: "header",
                        data: {
                            text: node.innerHTML, // Use innerHTML to preserve formatting
                            level: parseInt(node.nodeName.charAt(1)),
                        },
                    });
                } else if (node.nodeName === "P") {
                    blocks.push({
                        type: "paragraph",
                        data: {
                            text: node.innerHTML, // Use innerHTML to preserve formatting
                        },
                    });
                } else if (node.nodeName === "UL" || node.nodeName === "OL") {
                    const items = Array.from(node.querySelectorAll("li")).map(
                        (li) => li.innerHTML // Use innerHTML to preserve formatting
                    );
                    blocks.push({
                        type: "list",
                        data: {
                            style:
                                node.nodeName === "OL"
                                    ? "ordered"
                                    : "unordered",
                            items: items,
                        },
                    });
                } else if (node.nodeName === "BLOCKQUOTE") {
                    blocks.push({
                        type: "quote",
                        data: {
                            text: node.querySelector("p")?.innerHTML || "", // Use innerHTML
                            caption:
                                node.querySelector("cite")?.innerHTML || "", // Use innerHTML
                        },
                    });
                }
            });

            setEditorBlocks(blocks);
            setInitialLoading(false);
        } catch (error) {
            toast.error("Failed to fetch blog");
            console.error(error);
            navigate("/my-blogs");
        }
    };
    useEffect(() => {
        if (!editorBlocks) return;

        const holder = document.getElementById("editorjs");
        if (!holder) return; // DOM not ready yet

        if (editorInitialized.current) return;

        const editor = new EditorJS({
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
            data: {
                blocks: editorBlocks,
            },
            placeholder: "Start writing your blog content here...",
            onReady: () => {
                editorInitialized.current = true;
            },
        });
        editorRef.current = editor;
    }, [editorBlocks]);

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

        if (!editorRef.current) {
            toast.error("Editor is still loading, please wait...");
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
                            return `<blockquote><p>${block.data.text}</p><cite>${block.data.caption}</cite></blockquote>`;
                        default:
                            return "";
                    }
                })
                .join("");

            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", htmlContent);
            formData.append("visibility", visibility);
            if (featuredImage) {
                formData.append("featuredImage", featuredImage);
            }

            await axios.put(`/blogs/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Blog updated successfully!");
            navigate("/my-blogs");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update blog"
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Edit Blog Post
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
                    />
                    <img
                        src={imagePreview || currentImage}
                        alt="Preview"
                        className="mt-4 w-full h-64 object-cover rounded-md"
                    />
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
                        {loading ? "Updating..." : "Update Blog"}
                    </button>
                </div>
            </form>
        </div>
    );
}
