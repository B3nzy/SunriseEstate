require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

// Connecting to the database
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MongoDB Database!");
  })
  .catch((err) => {
    console.log(`${err}`);
  });

// allowing access from client origin
app.use(
  cors({
    origin: "*",
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// Running the server on specified PORT
app.listen(PORT, (req, res) => {
  console.log(`Server running on port ${PORT}`);
});

// All the APIs
// Authetication API
const authRouter = require("./routes/auth.route");
app.use("/api/auth", authRouter);

// User Related API
const userRouter = require("./routes/user.route");
app.use("/api/user", userRouter);

// Listing Related API
const listingRouter = require("./routes/listing.route");
app.use("/api/listing", listingRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "INternal Server Error!";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
