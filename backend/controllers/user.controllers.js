import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../middleware/sendEmail.js";
import crypto from "crypto";

const OTP_EXPIRES_MINUTES = 15;
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res
        .status(400)
        .json({ success: false, message: "Users not Found" });
    }
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while geting users",
    });
  }
};

export const regesterUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username) {
      return res.status(422).json({ message: "username is required" });
    }
    if (!email) {
      return res.status(422).json({ message: "email is required" });
    }
    if (!password) {
      return res.status(422).json({ message: "password is required" });
    }

    // exitUser
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already Exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    // const otp = Math.floor(1000000 + Math.random()*900000).toString();
    const otp = crypto.randomInt(100000, 999999).toString();
    const verifyEmailOtpExpire = Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000;
    const userDate = new User({
      username,
      email,
      password: hashedPassword,
      verifyEmailOtp: otp,
      verifyEmailOtpExpire,
    });

    const user = await userDate.save();
    const { password: pass, verifyEmailOtp: verify, ...rest } = user._doc;

    const htmlMessage = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding:20px;">
                
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px; background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); padding:30px;">
                    
                    <tr>
                        <td style="text-align:center;">
                            <h2 style="margin:0 0 15px; color:#333;">Verify Your Email</h2>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style="color:#555; font-size:15px; line-height:1.6;">
                                You requested to verify your email. Please use the OTP below to continue:
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="text-align:center; padding:20px 0;">
                            <div style="
                                display:inline-block;
                                padding:12px 25px;
                                font-size:22px;
                                font-weight:bold;
                                letter-spacing:3px;
                                background:#4f46e5;
                                color:#ffffff;
                                border-radius:6px;
                            ">
                                ${otp}
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style="color:#555; font-size:14px;">
                                This OTP will expire in <strong>${OTP_EXPIRES_MINUTES} minutes</strong> for security reasons.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="border-top:1px solid #eee; padding-top:15px;">
                            <p style="color:#777; font-size:13px; margin:5px 0;">
                                If you didn’t request this, please ignore this email.
                            </p>
                            <p style="color:#777; font-size:13px; margin:5px 0;">
                                Your account security is important to us.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>

    `;

    const data = {
      email: user?.email,
      subject: "Email Verification Request",
      message: `Please use the following OTP to verify you email: ${otp}`,
      html: htmlMessage,
    };
    await sendEmail(data);
    res.status(201).json({
      success: true,
      message: "Register successfully!",
      user: rest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while registering",
    });
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(422).json({ message: "email is required" });
    }
    if (!password) {
      return res.status(422).json({ message: "password is required" });
    }

    // exitUser
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Doesn't Exists" });
    }

    if (!user.isVerified) {
      const otp = crypto.randomInt(100000, 999999).toString();
      const verifyEmailOtpExpire = Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000;
      user.verifyEmailOtp = otp;
      user.verifyEmailOtpExpire;
      await user.save();
      const htmlMessage = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding:20px;">
                
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px; background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); padding:30px;">
                    
                    <tr>
                        <td style="text-align:center;">
                            <h2 style="margin:0 0 15px; color:#333;">Verify Your Email</h2>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style="color:#555; font-size:15px; line-height:1.6;">
                                You requested to verify your email. Please use the OTP below to continue:
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="text-align:center; padding:20px 0;">
                            <div style="
                                display:inline-block;
                                padding:12px 25px;
                                font-size:22px;
                                font-weight:bold;
                                letter-spacing:3px;
                                background:#4f46e5;
                                color:#ffffff;
                                border-radius:6px;
                            ">
                                ${otp}
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style="color:#555; font-size:14px;">
                                This OTP will expire in <strong>${OTP_EXPIRES_MINUTES} minutes</strong> for security reasons.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="border-top:1px solid #eee; padding-top:15px;">
                            <p style="color:#777; font-size:13px; margin:5px 0;">
                                If you didn’t request this, please ignore this email.
                            </p>
                            <p style="color:#777; font-size:13px; margin:5px 0;">
                                Your account security is important to us.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>

    `;

      const data = {
        email: user?.email,
        subject: "Email Verification Request",
        message: `Please use the following OTP to verify you email: ${otp}`,
        html: htmlMessage,
      };
      await sendEmail(data);
      return res.status(400).json({
        success: false,
        message: "Email not verified. OTP send again",
      });
    }

    const isMatchPassword = bcrypt.compareSync(password, user.password);
    if (!isMatchPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials!",
      });
    }

    const token = jwt.sign({ _id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSize: process.env.NODE_ENV === "production" ? "none" : "lax",
    };
    const { password: pass, ...rest } = user._doc;
    res.status(200).cookie("token", token, options).json({
      success: true,
      message: "Login successfully!",
      user: rest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while login",
    });
  }
};
export const logoutUser = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSize: process.env.NODE_ENV === "production" ? "none" : "lax",
    };
    res.status(200).clearCookie("token", options).json({
      success: true,
      message: "Logout successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while logout",
    });
  }
};
export const profileUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not Found" });
    }
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while logout",
    });
  }
};

export const emailVerify = async (req, res) => {
  const { otp } = req.body;
  try {
    if (!otp) {
      return res.status(422).json({ message: "otp is required" });
    }

    // exitUser
    const user = await User.findOne({ verifyEmailOtp: otp });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Doesn't Exists" });
    }

    if (user.verifyEmailOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyEmailOtpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP is Expired please request new one",
      });
    }

    user.verifyEmailOtp = undefined;
    user.verifyEmailOtpExpire = undefined;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ _id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSize: process.env.NODE_ENV === "production" ? "none" : "lax",
    };
    const { password: pass, ...rest } = user._doc;

    res.status(200).cookie("token", token, options).json({
      success: true,
      message: "OTP Verify successfully!",
      user: rest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while emailVerify",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Doesn't Exists" });
    }

    const genrateToken = crypto.randomBytes(20).toString();
    if (!genrateToken) {
      return res.status(400).json({
        success: false,
        message: "An Error occured. Please try again",
      });
    }

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(genrateToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTENT_URL}/login?token${user.resetPasswordToken}`;

    const htmlMessage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:24px;">

            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
              style="max-width:520px; background:#ffffff; border-radius:10px; box-shadow:0 6px 18px rgba(0,0,0,0.08); padding:32px;">

              <tr>
                <td align="center" style="padding-bottom:16px;">
                  <h2 style="margin:0; color:#1f2937; font-size:22px;">
                    Password Reset Request
                  </h2>
                </td>
              </tr>

              <tr>
                <td>
                  <p style="color:#4b5563; font-size:15px; line-height:1.7; margin:0 0 16px;">
                    We received a request to reset your password. Click the button below to set a new password.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:24px 0;">
                  <a href="${resetPasswordUrl}" target="_blank"
                    style="
                      display:inline-block;
                      padding:14px 28px;
                      background:#4f46e5;
                      color:#ffffff;
                      text-decoration:none;
                      font-size:16px;
                      font-weight:600;
                      border-radius:8px;
                    ">
                    Reset Password
                  </a>
                </td>
              </tr>
                      <tr>
                        <td>
                            <p style="color:#555; font-size:14px;">
                                This link will expire in <strong>${OTP_EXPIRES_MINUTES} minutes</strong> for security reasons.
                            </p>
                        </td>
                    </tr>
              <tr>
                <td>
                  <p style="color:#6b7280; font-size:14px; margin:0 0 6px;">
                    If the button doesn’t work, copy and paste this link into your browser:
                  </p>
                  <p style="word-break:break-all; color:#2563eb; font-size:14px; margin:0;">
                    ${resetPasswordUrl}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding-top:24px;">
                  <hr style="border:none; border-top:1px solid #e5e7eb;" />
                </td>
              </tr>

              <tr>
                <td>
                  <p style="color:#6b7280; font-size:13px; margin:12px 0 6px;">
                    If you did not request a password reset, please ignore this email. Your password will remain unchanged.
                  </p>
                  <p style="color:#6b7280; font-size:13px; margin:0;">
                    Your account security is important to us.
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
    `;

    const data = {
      email: user?.email,
      subject: "Password reset request",
      message: `Please use the following link to reset you password: ${genrateToken}`,
      html: htmlMessage,
    };
    await sendEmail(data);
    return res.status(200).json({
      success: true,
      message: "If the email exists, a password reset link has been send",
      
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while forgotpassword",
    });
  }
};


export const resetPassword = async (req,res)=>{
  try {
    
    const {password,confirmPassword} = req.body;

    const user = await User.findOne({ 
      resetPasswordToken:req.params.token,
      resetPasswordExpire:{$gt:Date.now()},
     });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "reset password token is invalid of has expired" });
    }

    if(password != confirmPassword){
      return res
        .status(400)
        .json({ success: false, message: "password doesn't match" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save()
    res.status(200).json({
      success: true,
      message: "password changed successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while reseting password",
    });
  }
}