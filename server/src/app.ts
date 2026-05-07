import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import jobroutes from "./routes/job.routes";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobroutes);
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;