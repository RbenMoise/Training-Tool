import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["team-lead", "admin"], default: "team-lead" },
    department: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("UserAtt", userSchema);
export default User;
