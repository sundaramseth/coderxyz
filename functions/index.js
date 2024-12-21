const commentRoutes = require("./routes/comment.route.js");
const postRoutes = require("./routes/post.route.js");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/users.route.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

dotenv.config();


mongoose.connect(process.env.MANGO).then(
    ()=>{
      console.log("MongoDb is connected");
    }).catch((err)=>{
  console.log(err);
});

const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

// app.listen(3000, ()=>{
//   console.log("Server is running on port 3000 !");
// });

// Define your API routes here
app.get("/api/test", (req, res) => {
  res.send("API is working!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use((err, req, res, next)=>{
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

exports.api = functions.https.onRequest(app);
