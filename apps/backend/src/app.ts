import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { notFoundHandler } from "./middlewares/not-found.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

const allowedOrigins = env.allowedOrigin.split(",").map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(env.uploadDir));

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", storage: env.uploadDir } });
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
