import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import jobroutes from "./routes/job.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://jobtracker-front.netlify.app",
  ]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobroutes);
app.use("/api/users", userRoutes);
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;