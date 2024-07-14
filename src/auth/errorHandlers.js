import mongoose from "mongoose";

export const errorHandler = (err, req, res, next) => {
  console.log("Error:", err);

  // destructure status directly from err object
  const { status } = err;

  // use return to remove need for break within switch cases
  switch (true) {
    case status === 400 || err instanceof mongoose.Error.ValidationError:
      return res.status(400).send({ message: "Bad request" });
    case status === 401:
      return res.status(401).send({ message: "Unauthorized" });
    case status === 403:
      return res.status(403).send({ success: false, message: "Forbidden" });
    case status === 404:
      return res.status(404).send({ message: "Not found" });
    default:
      return res.status(500).send({ message: "Server Error" });
  }
};
