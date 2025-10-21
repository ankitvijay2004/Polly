// https://polly-backend.onrender.com

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import signupRoutes from "./routes/auth.route.js";
import pollRoutes from "./routes/poll.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", signupRoutes);
app.use("/api/poll", pollRoutes);

try {
  mongoose.connect(process.env.DB_URI);
  console.log("connected to database");
} catch (err) {
  console.log(`cannot connect to database ${err}`);
}
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on https://polly-backend.onrender.com`);
});
