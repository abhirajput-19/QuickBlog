import jwt from "jsonwebtoken";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin credentials match
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generate a JWT token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    return res.json({ success: false, message: "Internal server error" });
  }
};

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("blogId")
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const totalBlogs = await Blog.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalDrafts = await Blog.countDocuments({ isPublished: false });

    const dashboardData = {
      recentBlogs,
      totalBlogs,
      totalComments,
      totalDrafts,
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const deleteCommentById = async (req, res) => {
  const { commentId } = req.body;

  try {
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const approveCommentById = async (req, res) => {
  const { commentId } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(commentId, {
      isApproved: true,
    });
    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }
    res.json({
      success: true,
      message: "Comment approved successfully",
      comment,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
