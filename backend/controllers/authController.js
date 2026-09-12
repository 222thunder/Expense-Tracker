import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config, { jwt_secret } from "../config/config.js";
import Session from "../models/Session.js";
import crypto from "node:crypto";
import { sendEmail } from "../services/emailService.js";
import { getOtpHtml, generateOtp } from "../utils/utils.js";
import Otp from "../models/Otp.js";

export const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    if (!user.verified)
      return res.status(401).json({ message: "Please verify email first!" });

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      jwt_secret,
      {
        expiresIn: "7d",
      },
    );

    const session = await Session.create({
      userId: user._id,
      refreshTokenHash: crypto
        .createHmac("sha256", jwt_secret)
        .update(refreshToken)
        .digest("hex"),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const accessToken = jwt.sign(
      {
        id: user._id,
        sessionId: session._id,
      },
      jwt_secret,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        username: user.username,
      },
      accessToken: accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

export const postLogout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh Token not found" });

    const refreshTokenHash = crypto
      .createHmac("sha256", jwt_secret)
      .update(refreshToken)
      .digest("hex");

    const session = await Session.findOne({ refreshTokenHash, revoke: false });
    if (!session)
      return res.status(400).json({ message: "Invalid Refresh Token" });

    session.revoke = true;
    await session.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Logged Out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    next(error);
  }
};

export const postRegister = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const isAlreadyRegistered = await User.findOne({ email });
    if (isAlreadyRegistered)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    const otp = generateOtp();
    const html = getOtpHtml(otp, username);

    const otpHash = crypto
      .createHmac("sha256", jwt_secret)
      .update(otp)
      .digest("hex");

    await Otp.create({
      email,
      user: user._id,
      otp: otpHash,
    });

    try {
      await sendEmail(email, "Expense Tracker - Verify your email", "", html);
    } catch (emailError) {
      await User.findByIdAndDelete(user._id);
      await Otp.deleteMany({ user: user._id });
      throw new Error("Failed to send verification email");
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        email: user.email,
        username: user.username,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  res.status(200).json({ message: "User authenticated", user: req.user });
};

export const getRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "refresh token not found" });

    const decoded = jwt.verify(refreshToken, jwt_secret);

    const refreshTokenHash = crypto
      .createHmac("sha256", jwt_secret)
      .update(refreshToken)
      .digest("hex");

    const session = await Session.findOne({ refreshTokenHash, revoke: false });
    if (!session)
      return res.status(401).json({ message: "Invalid refresh token" });

    const accessToken = jwt.sign(
      {
        id: decoded.id,
      },
      jwt_secret,
      { expiresIn: "15m" },
    );

    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
      },
      jwt_secret,
      { expiresIn: "7d" },
    );

    const newRefreshTokenHash = crypto
      .createHmac("sha256", jwt_secret)
      .update(newRefreshToken)
      .digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;

    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: config.cookieSecret === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error("Refresh token error:", error);
    next(error);
  }
};

export const getLogoutAll = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh Token not found" });

    const decoded = jwt.verify(refreshToken, jwt_secret);

    await Session.updateMany(
      { userId: decoded.id, revoke: false },
      { revoke: true },
    );

    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error("Logout all error:", error);
    next(error);
  }
};

export const getVerifyEmail = async (req, res, next) => {
  try {
    const { otp, email } = req.body;

    const otpHash = crypto
      .createHmac("sha256", jwt_secret)
      .update(otp)
      .digest("hex");

    const otpDoc = await Otp.findOne({ email, otp: otpHash });

    if (!otpDoc) {
      return res.status(400).json({
        message: "Invalid Otp",
      });
    }

    const user = await User.findByIdAndUpdate(
      otpDoc.user,
      { verified: true },
      { new: true },
    );

    if (!user) {
      await Otp.deleteMany({ user: otpDoc.user });
      return res.status(404).json({ message: "User not found" });
    }

    await Otp.deleteMany({
      user: otpDoc.user,
    });

    return res.status(200).json({
      message: "Email verified ",
      user: {
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error("Verify email error:", error);
    next(error);
  }
};

export const getResetOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Remove any previous active OTPs for this user
    await Otp.deleteMany({ user: user._id });

    const newOtp = generateOtp();
    const otpHash = crypto
      .createHmac("sha256", jwt_secret)
      .update(newOtp)
      .digest("hex");

    await Otp.create({
      email,
      user: user._id,
      otp: otpHash,
    });

    const html = getOtpHtml(newOtp, user.username);

    try {
      await sendEmail(email, "Expense Tracker - Verify your email", "", html);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      await Otp.deleteMany({ user: user._id, otp: otpHash });
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    res.status(200).json({
      message: "New OTP sent to your email successfully",
    });
  } catch (error) {
    console.error("Reset OTP error:", error);
    next(error);
  }
};

