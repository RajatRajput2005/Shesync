import bcryptjs from "bcryptjs";
import { User } from "../models/userModel.js";
import JWT from "jsonwebtoken";
export async function signupController(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "please fill all the fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email already exists" });
    }

    const hashedpassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ name, email, password: hashedpassword });

    await newUser.save();
    res.status(201).json({ message: "You have signed up essfully" });
  } catch (error) {
    console.log("Error while signing you up", error);
    res.status(500).json({ message: "Error during signup" });
  }
}
export async function loginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Missing email or password");
    return res
      .status(400)
      .json({ message: "Please provide both email and password." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found with this email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log("User found:", user);

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Password mismatch for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = await JWT.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    console.log("Login successful for email:", email, token);
    return res.status(200).json({
      message: "You have logged in successfully",
      userId: user._id,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}
