import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyEmailOtp: {
    type: String,
  },
  verifyEmailOtpExpire: Date,
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: Date,
},{timestamps:true,});

const User = mongoose.model("User", userSchema);
export default User;
