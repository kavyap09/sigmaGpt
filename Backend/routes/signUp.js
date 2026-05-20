const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("./models/User.js");
const app = express();

const sessionOptions = {
  secret: 'yourSecretKey', // ensure this is a string
  resave: false,           // set resave option to false
  saveUninitialized: false // set saveUninitialized option to false
};

app.use(session(sessionOptions));  // Corrected session options
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));  // User.authenticate() should now work
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/signup",(req,res)=>{
  res.render('./users/signup.ejs')
})

app.get("/login", (req, res) => {
  res.render("./users/login");
});

app.post("/login", 
  passport.authenticate("local", {
    failureRedirect: '/login',
  }),
  async (req, res) => {
     res.send("Welcome to your account");
  }
);
app.post("/signup",async (req,res)=>{
  let {username,email,password}=req.body;
  const newUser =new User({username,email});
  const regUser= await User.register(newUser,password);
  console.log(regUser.username)
  res.send("welcome to your account")
})