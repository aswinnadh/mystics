import { Schema, model } from "mongoose";
import { createHmac, randomBytes } from "crypto";
import { createTokenForUser } from "../services/auth.js";
const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/assets/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "ADMIN",
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashPassword;
  next();
});


adminSchema.static(
  "adminCheck",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("user not Found");

    const salt = user.salt;
    const hashPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashPassword !== userProvidedHash) {
      throw new Error("incorrect password");
    }
    const token = createTokenForUser(user);
    return token;
  }
);

const Admin = model("admin", adminSchema);
export default Admin;