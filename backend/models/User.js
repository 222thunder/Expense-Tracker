import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: false, unique: false, trim: false },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
