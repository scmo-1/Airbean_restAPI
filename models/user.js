import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    minlength: 4,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    lowercase: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
