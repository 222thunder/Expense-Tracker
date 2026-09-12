import express from "express";

//local imports
import {
  postLogin,
  postRegister,
  postLogout,
  getMe,
  getRefreshToken,
  getLogoutAll,
  getVerifyEmail,
  getResetOtp,
} from "../controllers/authController.js";

import { authenticate } from "../middleware/authentication.js";

const authRouter = express.Router();

authRouter.get("/hello", (req, res, next) => {
  res.json({ message: "Hello" });
});

// for authenticate -  req.headers.authorization (bearer+" token")

authRouter.post("/login", postLogin); //expects {email,password} in req.body
authRouter.post("/register", postRegister); //expects { email, password, username } in req.body ,
authRouter.post("/logout", postLogout); //expects req.cookies.refreshToken
authRouter.get("/refresh-token", getRefreshToken); //expects req.cookies.refreshToken
authRouter.get("/me", authenticate, getMe); //req.user already there through middleware || auth
authRouter.post("/logout-all", authenticate, getLogoutAll); //expects req.cookies.refreshToken || auth
authRouter.post("/verify-email", getVerifyEmail); //expects {otp,email}
authRouter.post("/resend-otp", getResetOtp); //expects {email}
authRouter.post("/reset-otp", getResetOtp); //expects {email}

export default authRouter;
