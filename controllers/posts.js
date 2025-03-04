const postsModel = require('../models/postsModel');
const commentModel = require('../models/commentModel');
const likesModel = require('../models/likesModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js')

exports.addPost = async (req, res) => {
    try {
        const { user_name, post_title, post_message } = req.body;
        const post_image = req.fileUrl;

        if (!post_image) {
            return res.status(400).json({ message: "Post image is required" });
        }

        const newPost = new postsModel({
            user_name,
            post_title,
            post_message,
            post_image: post_image
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
        const { user_name, post_title, post_message } = req.body;

        const existingPost = await postsModel.findById(postId);
        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        const updatedData = {
            user_name: user_name || existingPost.user_name,
            post_title: post_title || existingPost.post_title,
            post_message: post_message || existingPost.post_message,
            post_image: existingPost.post_image
        };

        if (req.file) {
            updatedData.post_image = req.fileUrl;
        }

        const updatedPost = await postsModel.findByIdAndUpdate(postId, updatedData, { new: true });

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

exports.addLike = async (req, res) => {
    try {
        const { user_id, post_id } = req.body;

        const newLike = new likesModel({
            user_id,
            post_id
        });

        await newLike.save();
        res.status(201).json({ message: "Like added successfully", comment: newLike });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { user_id, post_id, comment_message } = req.body;

        const newComment = new commentModel({
            user_id,
            post_id,
            comment_message
        });

        await newComment.save();
        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await commentModel.find({ post_id: postId });

        if (!comments) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json({ message: "Comments retrieved successfully", comments });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};