// -------------------- Imports ------------------------------
import express from "express";
import createHttpError from "http-errors";
import UserSchema from "../models/users.js";
import { createAccessToken } from "../auth/verifyTokens.js";
import { jwtAuthMiddleware } from "../auth/auth.js";
import mongoose from "mongoose";

// -------------------- CRUD ------------------------------

const userRouter = express.Router();
export default userRouter

  // -------------------- Get all users ------------------------------

  .get("/allUsers", jwtAuthMiddleware, async (req, res, next) => {
    try {
      const currentUserId = req.user?._id;
      const allOtherUsers = await UserSchema.find({
        _id: {
          $ne: currentUserId,
        },
      });
      res.send(allOtherUsers.map((user) => user.toJSON()));
    } catch (error) {
      next(error);
    }
  })

  // -------------------- Login ------------------------------

  .post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await UserSchema.checkCredentials(email, password);
      if (user) {
        const payload = { _id: user._id };
        const token = await createAccessToken(payload);
        res.send({ user, token });
        console.log(user.email, "logged in");
      } else {
        next(createHttpError(401, "Invalid email or password"));
      }
    } catch (error) {
      next(error);
    }
  })

  // -------------------- Register ------------------------------

  .post("/register", async (req, res, next) => {
    try {
      const { username, password, email } = req.body;
      const sameEmailUsername = await UserSchema.findOne({
        $or: [{ email }, { username }],
      });
      if (sameEmailUsername) {
        return res
          .status(400)
          .send({ error: "Email or username already in use" });
      }
      const createUser = new UserSchema({
        username,
        email,
        password,
      });
      const { _id } = await createUser.save();
      const payload = { _id };
      const token = await createAccessToken(payload);
      res.status(201).send({ user: createUser, token });
    } catch (error) {
      next(error);
    }
  });
