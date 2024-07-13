// -------------------- Imports ------------------------------
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";

// -------------------- Server init --------------------------

dotenv.config(); // load environment variables

const expressServer = express();
const httpServer = createServer(expressServer);

const port = process.env.PORT || 3001; // OR 3001 if PORT unavailable

// ------------------- Middlewares  --------------------------

const corsOptions = {
  // origin: "*"
  origin: (origin, callback) => {
    if (origin && origin.startsWith("http://localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }, // temporarily set to any port on localhost until hosted

  optionSuccessStatus: 200,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

expressServer.use(cors(corsOptions));
expressServer.use(express.json({ limit: "5mb" })); // Define limit due to size of payload (game details)

// routes

// ------------------- Server start --------------------------

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log("Connected to Mongo!");
    httpServer.listen(port, () => {
      console.log("Server running on port", port);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// temporarily with MONGODB for quick set-up. Change to postgreSQL at later point
