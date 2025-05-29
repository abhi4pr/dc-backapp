import express from "express";
import {
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  getCommentsByPost,
  getLikeCount,
  getCommentCount,
} from "../controllers/postInteractionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Like/Unlike
router.post("/like/:postId", authMiddleware, likePost);
router.delete("/unlike/:postId", authMiddleware, unlikePost);

// Comments
router.post("/comment/:postId", authMiddleware, addComment);
router.delete("/comment/:commentId", authMiddleware, deleteComment);
router.get("/comments/:postId", authMiddleware, getCommentsByPost);

// like and comment counts
router.get("/like-count/:postId", authMiddleware, getLikeCount);
router.get("/comment-count/:postId", authMiddleware, getCommentCount);

export default router;
