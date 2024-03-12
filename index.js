// // const http = require("http"); //inbuilt module
// import http from "http";
// import { gfName, gfName1, gfName2 } from "./features.js";
// import { generateLovePercent } from "./features.js";
// // const gfNames = require("./features")

// import fs from "fs";

// const hello = fs.readFileSync("./index.html");
// console.log(gfName);
// console.log(gfName1);
// console.log(gfName2);
// console.log(generateLovePercent());
// const server = http.createServer((req, res) => {
//   // console.log(req.url)
//   // res.end("<h1>Hello</h1>");
//   console.log(req.method);
//   if (req.url === "/") {
//     res.end(`<h1>Love is ${generateLovePercent()} </h1>`);
//   } else if (req.url === "/about") {
//     // fs.readFile("./index.html", (err,data) => {
//     //     res.end(data);
//     //   });
//     res.end(hello);
//   } else if (req.url === "/contact") {
//     res.end("<h1>contact page</h1>");
//   } else {
//     res.end("<h1>Page Not Found</h1>");
//   }
// });

// server.listen(5000, () => {
//   console.log("server is working");
// });

//express -> nodejs framework

import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//database connection mongodb
mongoose
  .connect("mongodb://localhost:27017", {
    dbName: "backend",
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

//creating schema

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
});

//creating schema for login
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
// creating modules for message
const Message = new mongoose.model("Message", messageSchema);

// creating modules for message
const User = new mongoose.model("users", userSchema);

const app = express();
const users = [];

//for form using middleware

app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// console.log((path.resolve(), "public"));
//setting up view engine
app.set("view engine", "ejs");

//authentication function

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    // res.render("logout");
    const decoded = jwt.verify(token, "kffjsdgjkd");
    req.user = await User.findById(decoded._id);
    next();
  } else {
    res.redirect("/login");
  }
};

// app.get("/", (req, res) => {
//   //   res.send("Welcome");
//   //   res.sendStatus(404);
//   //   res.sendStatus(500);
//   //   res.json({
//   //     success: true,
//   //     data: [
//   //       {
//   //         id: 1,
//   //         name: "Jay",
//   //       },
//   //     ],
//   //   });
//   //   res.status(400).send("gand mara");
//   const pathLocation = path.resolve();
//   //   res.sendFile(path.join(pathLocation, "./index.html"));
//   res.render("index", { name: "Janamjay" });
//   //   console.log(path.join(pathLocation, "gand mara"));
//   //   const file =fs.readFileS
//   //   res.sendFile("./index.html");
// });
app.get("/success", (req, res) => {
  res.render("success");
});

//for authentication
app.get("/", isAuthenticated, (req, res) => {
  // console.log(req.user)
  res.render("logout", { name: req.user.name });
});
app.get("/register", (req, res) => {
  // console.log(req.user)
  res.render("register");
});
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user = await User.create({ name, email, password: hashedPassword });
  const token = jwt.sign({ _id: user._id }, "kffjsdgjkd");
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user)
    // //  return console.log("Register First")
    return res.redirect("/register");
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.render("login", { email, message: "Incorrect password" });
  }
  const token = jwt.sign({ _id: user._id }, "kffjsdgjkd");
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});
app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.post("/contact", async (req, res) => {
  // console.log(req.body.name);
  // users.push({ userName: req.body.name, email: req.body.email });
  // const messageData =({ name: req.body.name, email: req.body.email });
  // console.log(messageData)
  const { name, email } = req.body;
  await Message.create({ name, email });
  res.redirect("/success");
});

//api for users

app.get("/users", (req, res) => {
  res.json({ users });
});

//mongodb
// app.get("/add", async(req, res) => {
//  await Message.create({name:"jay mIshra",email:"jay2@gmail.com"}).then(()=>{res.end("nice")})
//   // res.end("ni/ce")
// });
app.listen(5000, () => {
  console.log("server is working 9470000018");
});
