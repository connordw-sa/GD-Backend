import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// ensure user passwords are more secure
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (!passwordRegex.test(this.password)) {
      const error = new Error(
        "Password must be 6 characters or longer, with uppercase, lowercase, number and special characters"
      );
      return next(error);
    }

    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// destructure to exclude fields
UserSchema.methods.toJSON = function () {
  const { password, __v, createdAt, updatedAt, ...userObject } =
    this.toObject();
  return userObject;
};

// find by email or username, return error according to specific cases
// user can login with username or password
UserSchema.statics.checkCredentials = async function (identifier, plainPW) {
  try {
    const user = await this.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      throw new Error("Incorrect username/email");
    }

    const isPasswordValid = await bcrypt.compare(plainPW, user.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect password");
    }
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default mongoose.model("User", UserSchema);
