import express from "express";
import cors from "cors";

import notesRoutes from "./routes/notes.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Core middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notes", notesRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;