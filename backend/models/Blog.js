const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"],
        trim: true,
        maxlength: [200, "Title cannot be more than 200 characters"],
    },
    content: {
        type: String,
        required: [true, "Please provide content"],
    },
    featuredImage: {
        type: String,
        required: [true, "Please provide a featured image"],
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt timestamp before saving
blogSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Blog", blogSchema);
