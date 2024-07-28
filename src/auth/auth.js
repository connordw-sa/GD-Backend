import createHttpError from "http-errors";
import { verifyAccessToken } from "verifyTokens.js";

export const jwtAuthMiddleware = async (req, res, next) => {
  // destructure auth header
  const { authorization } = req.headers;

  // early return if !auth to reduce nesting of if statements
  if (!authorization) {
    return next(
      createHttpError(
        401,
        "Please provide Bearer Token in the authorization header!"
      )
    );
  }

  try {
    const accessToken = authorization.replace("Bearer ", "");
    const payload = await verifyAccessToken(accessToken);
    req.user = { _id: payload._id };
    next();
  } catch (error) {
    console.error(error);
    next(createHttpError(401, "Token not valid!"));
  }
};
