import dotenv from 'dotenv';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import userRoute from "./routes/user.js";
import blogRoute from "./routes/blog.js";
import nocache from "nocache";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { checkForAuthenticationCookie } from "./middlewares/auth.js";
import Blog from "./model/blog.js";
import methodOverride from "method-override";


const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL).then((e) => {
  console.log("mongodb connected");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/assets", express.static(path.join(__dirname, "/public/assets")));
app.use(express.static(path.resolve("./public")));
app.use(express.static(path.resolve("./public/uploads/profilepics")));
app.use(express.urlencoded({ extended: false }));
app.use(nocache());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(methodOverride("_method"));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate("createdBy");
    res.render("home", { user: req.user, blogs: allBlogs });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
