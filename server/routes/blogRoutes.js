import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  togglePublish,
} from "../controllers/blogController.js";
import upload from "../middlewares/multer.js";
import auth from "../middlewares/auth.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);

blogRouter.post("/add-comment", addComment);
blogRouter.get("/comments/:blogId", getBlogComments);

blogRouter.post("/generate", generateContent);
blogRouter.get("/:blogId", getBlogById);

export default blogRouter;
