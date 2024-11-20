import { Router } from "express";
import multer from "multer";
import path from "path";
import Blog from "../model/blog.js";
import Comment from "../model/comment.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from "fs";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/addblog", (req, res) => {
  res.render("addblog", { user: req.user });
});

router.get("/blog", (req, res) => {
  res.render("blog", { user: req.user });
});

router.get("/userdtl", (req, res) => {
  res.render("userdtl", { user: req.user });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageUrl: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    // Optionally, remove the associated file
    // const filePath = path.join(
    //   __dirname,
    //   "..",
    //   "public",
    //   "uploads",
    //   blog.coverImageUrl
    // );
    // console.log("Attempting to delete file:", filePath);
    // if (fs.existsSync(filePath)) {
    //   fs.unlink(filePath, (err) => {
    //     if (err) {
    //       console.error("Failed to delete cover image:", err);
    //     } else {
    //       console.log("Cover image deleted successfully");
    //     }
    //   });
    // } else {
    //   console.log("File does not exist:", filePath);
    // }

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while deleting the blog.");
  }
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("blog", {
    user: req.user,
    blog: blog,
    comments: comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.delete("/comment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).send("Comment not found");
    }
    return res.redirect(`/blog/${comment.blogId}`);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("An error occurred while deleting the comment.");
  }
});

router.put("/adminmsg/:id", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    blog.message = message;
    await blog.save();
    return res.redirect(`/blog/${id}`);
  } catch (error) {
    console.error("Error updating message:", error);
  }
});

export default router;
