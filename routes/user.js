import { Router } from "express";
import User from "../model/user.js";
import path from "path";
import multer from "multer";
import Admin from "../model/admin.js";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/profilepics`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const dpUpload = multer({ storage: storage });


router.get("/signup",(req, res) => {
  if (!res.locals.user) {
    res.render("signup");
  } else {
    res.redirect('/')
  }
});

router.get("/signin", (req, res) => {
  if (!res.locals.user) {
    res.render("signin");
  } else {
    res.redirect('/')
  }
});
router.get("/admin", (req, res) => {
    res.render("admin");
});

// router.get("/createadmin", (req, res) => {
//     res.render("createadmin");
// });

router.post("/signup", dpUpload.single("profilepic"), async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    await User.create({
      username,
      email,
      password,
      profileImageUrl: `/uploads/profilepics/${req.file.filename}`,
    });
    return res.redirect("/user/signin");
  } catch (error) {
    console.log(error);
  }
});

// router.post("/createadmin", dpUpload.single("profilepic"), async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     await Admin.create({
//       username,
//       email,
//       password,
//     });
//     return res.redirect("/user/signin");
//   } catch (error) {
//     console.log(error);
//   }
// });

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // console.log("token", token);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "incorrect email or password",
    });
  }
});

router.post("/admin",async(req,res)=>{
  const {email, password}=req.body;
  try {
    const token = await Admin.adminCheck(email, password);
    // console.log("token", token);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("admin", {
      error: "incorrect email or password",
    });
  }
})

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

export default router;
