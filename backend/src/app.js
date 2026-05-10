import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import adminRouter from "./routes/admin.routes.js";
import applicationRouter from "./routes/application.routes.js";
import authRouter from "./routes/auth.routes.js";
import chatbotRouter from "./routes/chatbot.routes.js";
import companyRouter from "./routes/company.routes.js";
import jobRouter from "./routes/job.routes.js";
import profileRouter from "./routes/profile.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());

app.get("/api/v1/health", (_, res) => {
  res.status(200).json({ success: true, message: "Job Portal API is healthy" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/chatbot", chatbotRouter);

app.use(errorHandler);

export { app };
