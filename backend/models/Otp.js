import moongose from "mongoose";

const otpSchema = new moongose.Schema({
  email: {
    type: String,
    required: true,
  },
  user: {
    type: moongose.Schema.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 * 2, // 10 minutes
  },
});

const Otp = moongose.model("Otp", otpSchema);

export default Otp;
