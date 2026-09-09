import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config, { jwt_secret } from "../config/config.js";
import Session from "../models/Session.js";
import crypto from "node:crypto";

export const postLogin = async (req, res, next) => {};

export const postLogout = async (req, res, next) => {};

export const postRegister = async (req, res, next) => {
  const { email, password, username } = req.body;
  const isAlreadyRegistered = await User.findOne({ email });
  if (isAlreadyRegistered)
    return res.status(409).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ email, password: hashedPassword, username });

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    jwt_secret,
    {
      expiresIn: "7d",
    },
  );

  const refreshTokenHash = crypto
    .createHash("sanyamdhawan222")
    .update(refreshToken)
    .digest("hex");

  const session = await Session.create({
    userId: user._id,
    refreshTokenHash: refreshToken,
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

  const newRefreshToken = jwt.sign(
    {
      id: user._id,
    },
    jwt_secret,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      email: user.email,
      username: user.username,
    },
    accessToken: accessToken,
  });
};

export const getMe = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No authorization header provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, jwt_secret);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User authenticated",
      user,
    });
  } catch (error) {
    console.error("JWT error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export const getRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "refresh token not found" });

  const decoded = jwt.verify(refreshToken, jwt_secret);
  const accessToken = jwt.sign(
    {
      id: decoded.id,
    },
    jwt_secret,
    { expiresIn: "15m" },
  );

  res.status(200).json({
    message: "Access token refreshed successfully",
    accessToken,
  });
};
