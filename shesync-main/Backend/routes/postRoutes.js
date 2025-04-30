import express from "express";
import {
  getPosts,
  createPost,
  likePost,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/createPost", createPost);
router.get("/getPost", getPosts);
router.get("/like/:id", likePost);
export default router;
