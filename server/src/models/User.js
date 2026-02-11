import mongoose from "mongoose";
// User Schema Definition
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// This will create a 'users' collection in MongoDB
const User = mongoose.model("User", userSchema);
console.log("User model is ready");
export default mongoose.model("User", userSchema);
