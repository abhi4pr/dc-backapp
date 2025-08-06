import express from "express";
import {
  addPost,
  getPostById,
  updatePost,
  deletePost,
  getAllPostsOfUser,
  searchPosts,
} from "../controllers/caseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/add_post",
  authMiddleware,
  upload.single("image"),
  fileUpload,
  addPost
);
router.get("/single_post/:_id", authMiddleware, getPostById);
router.put(
  "/:_id",
  authMiddleware,
  upload.single("image"),
  fileUpload,
  updatePost
);
router.delete("/:_id", authMiddleware, deletePost);
router.get("/get_user_posts/:_id", authMiddleware, getAllPostsOfUser);
router.get("/search", authMiddleware, searchPosts);

export default router;
