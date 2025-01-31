const postsModel = require('../models/postsModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js')

exports.addPost = async (req, res) => {
    try {
        const { user_name, post_message } = req.body;
        const post_image = req.file;

        let imageUrl = null;
        if (post_image) {
            imageUrl = await fileUpload(post_image);
        }

        const newPost = new postsModel({

            post_message,
            post_image: imageUrl
        });

        await newPost.save();
        res.status(201).json({ message: "Post added successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getSinglePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await postsModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post retrieved successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalPosts = await postsModel.countDocuments();

        const posts = await postsModel.find().skip(skip).limit(limit);
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            message: "Posts retrieved successfully",
            posts,
            pagination: {
                totalPosts,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { user_name, post_message } = req.body;

        const updatedData = {};

        if (post_message) updatedData.post_message = post_message;

        const post_image = req.file;
        if (post_image) {
            updatedData.post_image = await fileUpload(post_image);
        }

        const updatedPost = await postsModel.findByIdAndUpdate(postId, updatedData, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const deletedPost = await postsModel.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully", post: deletedPost });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
