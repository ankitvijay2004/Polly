import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const SignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(401).json({ message: "Account already exists" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(402).json({ message: "Choose a unique Username" });
    }

    const user = new User({
      username: username,
      email: email,
      password: password,
    });

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    await user.save();

    res
      .status(200)
      .json({ message: "User Created", username, email, token, id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default SignUp;
