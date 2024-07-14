import jwt from "jsonwebtoken";
import { promisify } from "util";

// promisify to convert sign + verify to promise based functions
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

const createAccessToken = async (payload) => {
  try {
    return await signAsync(payload, process.env.JWT_SECRET, {
      expiresIn: "1 week",
    });
  } catch (err) {
    throw new Error(err);
  }
};

const verifyAccessToken = async (token) => {
  try {
    console.log(token, process.env.JWT_SECRET);
    return await verifyAsync(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error(err);
  }
};

export { createAccessToken, verifyAccessToken };
