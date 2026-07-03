import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  image: {
    type: String,
  },
  uid: {
    type: String,
    required: [true, "Firebase UID is required"],
    unique: true,
  },
  authProvider: {
    type: String,
    enum: ["google", "email"],
    default: "google",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
