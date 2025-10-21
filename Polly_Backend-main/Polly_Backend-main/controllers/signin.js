import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const SignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return res
        .status(403)
        .json({ message: "Invalid email or user does not exist" });
    }

    const isPasswordCorrect = await currentUser.comparePasswords(password);
    if (!isPasswordCorrect) {
      return res.status(406).json({ message: "Incorrect password" });
    }

    if (!process.env.JWT_SECRET_KEY) {
      console.error("JWT_SECRET_KEY is not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      {
        userId: currentUser._id,
        username: currentUser.username,
        email: currentUser.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Sign-in successful",
      username: currentUser.username,
      email,
      token,
      id: currentUser._id,
    });
  } catch (err) {
    console.error("Error during sign-in:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default SignIn;
