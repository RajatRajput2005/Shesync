import JWT from "jsonwebtoken";
import { User } from "../models/userModel.js";
export async function checkUser(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "You are not authorized" });
  }
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "You are not authorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error while verifying token", error);
    return res.status(401).json({ message: "You are not authorized" });
  }
}
