import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import periodTrackingRoutes from "./routes/periodTrackingRoutes.js";
import postRoutes from "./routes/postRoutes.js";
dotenv.config();
export const MONGO_URL = process.env.MONGO_URL;
const app = express();
app.use(cors());
app.use(express.json());
connectDb();

app.use("/api/user", authRoutes);
app.use("/api/period", periodTrackingRoutes);
app.use("/api/post", postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
