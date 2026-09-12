import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: false, unique: false, trim: false },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  verified: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/boswoxq1/image/upload/v1789147190/default.png",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
