import express from "express";
import "dotenv/config";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";

import User from "./models/User.js";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = 8080;

// middleware
app.use(express.json());

// cors
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://sigmagpt-1-so4n.onrender.com"
    ],
    credentials: true,
  })
);

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

// routes
app.use("/api", chatRoutes);
app.use("/auth", authRoutes);

// db connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected with DB");
  } catch (err) {
    console.log("DB connection failed:", err);
  }
};

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await connectDB();
});
