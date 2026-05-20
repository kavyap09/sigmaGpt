// import express from "express";
// import passport from "passport";
// import User from "../models/User.js";

// const router = express.Router();


// router.get("/me", (req, res) => {
//   if (!req.user) return res.status(401).json({ error: "Unauthorized" });
//   res.json({ _id: req.user._id, username: req.user.username });
// });

// // ✅ Signup Route
// router.post("/signup", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = new User({ username });
//     const registeredUser = await User.register(user, password);
//     res.status(201).json({ message: "Signup successful", user: registeredUser });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Login Route
// router.post("/login",
//   passport.authenticate("local", { failureMessage: "Invalid credentials" }),
//   (req, res) => {
//     res.json({ message: "Login successful", user: req.user });
//   }
// );

// // ✅ Logout Route
// router.get("/logout", (req, res) => {
//   req.logout(err => {
//     if (err) return res.status(500).json({ error: "Error logging out" });
//     res.json({ message: "Logged out successfully" });
//   });
// });

// export default router;

import express from "express";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

// check logged in user
router.get("/me", (req, res) => {

  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  res.json({
    _id: req.user._id,
    username: req.user.username,
  });
});

// signup
router.post("/signup", async (req, res) => {

  try {

    const { username, password } = req.body;

    const user = new User({ username });

    const registeredUser = await User.register(
      user,
      password
    );

    req.login(registeredUser, (err) => {

      if (err) {
        return res.status(500).json({
          error: "Login after signup failed",
        });
      }

      res.status(201).json({
        message: "Signup successful",
        user: {
          _id: registeredUser._id,
          username: registeredUser.username,
        },
      });

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });

  }
});

// login
router.post(
  "/login",
  passport.authenticate("local"),
  (req, res) => {

    res.json({
      message: "Login successful",
      user: {
        _id: req.user._id,
        username: req.user.username,
      },
    });

  }
);

// logout
router.get("/logout", (req, res) => {

  req.logout((err) => {

    if (err) {
      return res.status(500).json({
        error: "Logout failed",
      });
    }

    req.session.destroy(() => {

      res.clearCookie("connect.sid");

      res.json({
        message: "Logged out successfully",
      });

    });

  });

});

export default router;