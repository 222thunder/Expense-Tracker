//external
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

//local
import config from "./config/config.js";
import authRouter from "./routes/authRouter.js";
import transactionRouter from "./routes/transactionRouter.js";
import { notFound, errorHandler } from "./controllers/errorController.js";

const app = express();
app.use(
  cors({
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = config.port;
const DB_PATH = config.mongoUri;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });
