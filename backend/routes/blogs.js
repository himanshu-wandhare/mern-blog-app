const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { body, validationResult } = require("express-validator");
const Blog = require("../models/Blog");
const { protect } = require("../middleware/auth");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    },
});

// @route   GET /api/blogs/public
// @desc    Get all public blogs
// @access  Public
router.get("/public", async (req, res) => {
    try {
        const blogs = await Blog.find({ visibility: "public" })
            .populate("author", "name email")
            .sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/blogs/my-blogs
// @desc    Get current user's blogs
// @access  Private
router.get("/my-blogs", protect, async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.id })
            .populate("author", "name email")
            .sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog
// @access  Public/Private (depends on visibility)
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate(
            "author",
            "name email"
        );

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // If blog is private, check if user is the author
        if (blog.visibility === "private") {
            // Check if user is authenticated
            let token;
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")
            ) {
                token = req.headers.authorization.split(" ")[1];
                const jwt = require("jsonwebtoken");
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                if (blog.author._id.toString() !== decoded.id) {
                    return res
                        .status(403)
                        .json({ message: "Not authorized to view this blog" });
                }
            } else {
                return res
                    .status(403)
                    .json({ message: "Not authorized to view this blog" });
            }
        }

        res.json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private
router.post(
    "/",
    protect,
    upload.single("featuredImage"),
    [
        body("title").trim().notEmpty().withMessage("Title is required"),
        body("content").trim().notEmpty().withMessage("Content is required"),
        body("visibility")
            .isIn(["public", "private"])
            .withMessage("Visibility must be public or private"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            if (!req.file) {
                return res
                    .status(400)
                    .json({ message: "Featured image is required" });
            }

            // Upload image to Cloudinary
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "blog-images" },
                async (error, result) => {
                    if (error) {
                        console.error(error);
                        return res
                            .status(500)
                            .json({ message: "Error uploading image" });
                    }

                    const { title, content, visibility } = req.body;

                    const blog = await Blog.create({
                        title,
                        content,
                        featuredImage: result.secure_url,
                        visibility,
                        author: req.user.id,
                    });

                    const populatedBlog = await Blog.findById(
                        blog._id
                    ).populate("author", "name email");

                    res.status(201).json(populatedBlog);
                }
            );

            uploadStream.end(req.file.buffer);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put(
    "/:id",
    protect,
    upload.single("featuredImage"),
    [
        body("title").trim().notEmpty().withMessage("Title is required"),
        body("content").trim().notEmpty().withMessage("Content is required"),
        body("visibility")
            .isIn(["public", "private"])
            .withMessage("Visibility must be public or private"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const blog = await Blog.findById(req.params.id);

            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }

            // Check if user is the author
            if (blog.author.toString() !== req.user.id) {
                return res.status(403).json({ message: "Not authorized" });
            }

            const { title, content, visibility } = req.body;

            // If new image is uploaded, upload to Cloudinary
            if (req.file) {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "blog-images" },
                    async (error, result) => {
                        if (error) {
                            console.error(error);
                            return res
                                .status(500)
                                .json({ message: "Error uploading image" });
                        }

                        blog.title = title;
                        blog.content = content;
                        blog.featuredImage = result.secure_url;
                        blog.visibility = visibility;

                        await blog.save();

                        const updatedBlog = await Blog.findById(
                            blog._id
                        ).populate("author", "name email");

                        res.json(updatedBlog);
                    }
                );

                uploadStream.end(req.file.buffer);
            } else {
                blog.title = title;
                blog.content = content;
                blog.visibility = visibility;

                await blog.save();

                const updatedBlog = await Blog.findById(blog._id).populate(
                    "author",
                    "name email"
                );

                res.json(updatedBlog);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private
router.delete("/:id", protect, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if user is the author
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await blog.deleteOne();

        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
