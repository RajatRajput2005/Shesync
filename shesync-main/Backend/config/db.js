import mongoose from "mongoose";
import { MONGO_URL } from "../index.js";
export async function connectDb() {
  try {
    mongoose
      .connect(MONGO_URL)
      .then(() => {
        console.log("Successfully connected to MongoDB");
        console.log(MONGO_URL);
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        console.log(MONGO_URL);
      });
  } catch (error) {
    console.log(error);
  }
}
