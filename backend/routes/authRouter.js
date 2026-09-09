import express from "express";
import {
  postLogin,
  postRegister,
  postLogout,
  getMe,
  getRefreshToken,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.get("/hello", (req, res, next) => {
  res.json({ message: "Hello" });
});

authRouter.post("/login", postLogin);
authRouter.post("/register", postRegister);
authRouter.post("/logout", postLogout);
authRouter.get("/refresh-token", getRefreshToken);
authRouter.get("/me", getMe);

export default authRouter;
