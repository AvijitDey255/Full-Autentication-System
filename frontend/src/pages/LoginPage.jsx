import React, { useState } from "react";
import { CiLock, CiMail, CiUser } from "react-icons/ci";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { FiArrowLeft } from "react-icons/fi";
import { axiosInstance } from "../lib/axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
const LoginPage = () => {
  const [authType, setAuthType] = useState("login");
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
    conformPassword: "",
    newPassword: "",
    otp: "",
  });

  const [error, setError] = useState({});
  const [showpass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const validateForm = (e) => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // login
    if (authType === "login") {
      if (!userData.email) newErrors.email = "Email is required";
      else if (!emailRegex.test(userData.email))
        newErrors.email = "Invalid Email";

      if (!userData.password) newErrors.password = "Password is required";
    }
    // register
    else if (authType === "register") {
      if (!userData.userName) newErrors.userName = "username is required";
      if (!userData.email) newErrors.email = "Email is required";
      else if (!emailRegex.test(userData.email))
        newErrors.email = "Invalid Email";

      if (!userData.password) newErrors.password = "Password is required";
      else if (userData.password.length < 6)
        newErrors.password = "Password must be atleast 6 character";
    }
    // OTP
    else if (authType === "send-otp") {
      if (!userData.otp) newErrors.otp = "OTP is required";
      else if (userData.otp.length < 6)
        newErrors.otp = "OTP must be atleast 6 Digits";
    } else if (authType === "verify-email") {
      if (!userData.otp) newErrors.otp = "OTP is required";
      else if (userData.otp.length < 6)
        newErrors.otp = "OTP must be atleast 6 Digits";
    }
    // forgot-password
    else if (authType === "forgot-password") {
      if (!userData.email) newErrors.email = "Email is required";
      else if (!emailRegex.test(userData.email))
        newErrors.email = "Invalid Email";
    }
    // reset-password
    else if (authType === "reset-password") {
      if (!userData.newPassword)
        newErrors.newPassword = "new Password is required";
      else if (userData.newPassword.length < 6)
        newErrors.newPassword = "new Password must be atleast 6 character";
      if (!userData.conformPassword)
        newErrors.conformPassword = "conform Password is required";
      else if (userData.newPassword !== userData.conformPassword)
        newErrors.conformPassword = "password doesn't match";
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // switchfun

 const switchView = (newView) => {
    setAuthType(newView);
    setError({});
    setUserData({
      userName: "",
      email: "",
      password: "",
      conformPassword: "",
      newPassword: "",
      otp: "",
    });
  };
  const submitHabdler = async (e) => {
    e.preventDefault();
    setError({});
    if (!validateForm()) return;
    setLoading(true);
    if (authType === "login") {
      try {
        const { data } = await axiosInstance.post("/api/users/login", userData);
        if (data?.success) {
          dispatch(setUser(data?.user));
          navigate("/")
        }else{
          switchView("verify-email")
        }
      } catch (error) {
        TransformStream.error(data.response.message || "login failed")
      }
    }
    else if (authType === "register") {
      try {
        const { data } = await axiosInstance.post("/api/users/register", userData);
        if (data?.success) {
          dispatch(setUser(data?.user));
          switchView("verify-email")
        }
      } catch (error) {
        TransformStream.error(data.response.message || "register failed")
      }
    }
    else if (authType === "verify-email") {
      try {
        const { data } = await axiosInstance.post("/api/users/email-verify", userData);
        if (data?.success) {
          dispatch(setUser(data?.user));
          navigate("/")
        }
      } catch (error) {
        TransformStream.error(data.response.message || "email verify failed")
      }
    }
  };


 
  // register
  const renderRegisterForm = () => {
    return (
      <>
        <h2 className="text-3xl font-bold md-6 text-center text-white ">
          Create Account
        </h2>
        <p className="md-6 text-center text-gray-300 ">
          Join out platform Today
        </p>
        {/* Username */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <CiUser className="w-5 h-5" />
            </span>
            <input
              type="text"
              name="userName"
              value={userData.userName}
              onChange={onChangeHandler}
              className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl  focus:ring-2 focus:ring-indigo-500 ${
                error.userName ? "border-red-500" : "bg-gray-700"
              }`}
            />
          </div>
          <p className="text-red-500 text-xs mt-1 ml-1 h-4">{error.userName}</p>
        </div>
        {/* email */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <CiMail className="w-5 h-5" />
            </span>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={onChangeHandler}
              className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl  focus:ring-2 focus:ring-indigo-500 ${
                error.email ? "border-red-500" : "bg-gray-700"
              }`}
            />
          </div>
          <p className="text-red-500 text-xs mt-1 ml-1 h-4">{error.email}</p>
        </div>
        {/* password */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <CiLock className="w-5 h-5" />
            </span>
            <input
              type={showpass ? `text` : `password`}
              name="password"
              value={userData.password}
              onChange={onChangeHandler}
              className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl  focus:ring-2 focus:ring-indigo-500 ${
                error.password ? "border-red-500" : "bg-gray-700"
              }`}
            />
            <span
              onClick={() => setShowPass(!showpass)}
              className="absolute right-3 top-4 text-gray-300 cursor-pointer"
            >
              {showpass ? <IoEyeOff /> : <IoEye />}
            </span>
          </div>
          <p className="text-red-500 text-xs mt-1 ml-1 h-4">{error.password}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-indigo-500 to-pink-500 text-white p-3 rounded-xl hover:scale-105 transition"
        >
          {loading ? "proccessing..." : "Register"}
        </button>
        <div className="mt-6 text-center text-gray-400 text-xm">
          Already have an Account?
          <button
            onClick={() => switchView("login")}
            type="button"
            className="text-blue-500 hover:text-blue-400 hover:cursor-pointer"
          >
            Login
          </button>
        </div>
      </>
    );
  };
  // login
  const renderLoginForm = () => {
    return (
      <>
        <h2 className="text-3xl font-bold md-6 text-center text-white ">
          Welcome Back
        </h2>
        <p className="md-6 text-center text-gray-300 ">
          Sign in your account to continue
        </p>

        {/* email */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <CiMail className="w-5 h-5" />
            </span>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={onChangeHandler}
              className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl  focus:ring-2 focus:ring-indigo-500 ${
                error.email ? "border-red-500" : "bg-gray-700"
              }`}
            />
          </div>
          <p className="text-red-500 text-xs mt-1 ml-1 h-4">{error.email}</p>
        </div>

        {/* password */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <CiLock className="w-5 h-5" />
            </span>
            <input
              type={showpass ? `text` : `password`}
              name="password"
              value={userData.password}
              onChange={onChangeHandler}
              className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl  focus:ring-2 focus:ring-indigo-500 ${
                error.password ? "border-red-500" : "bg-gray-700"
              }`}
            />
            <span
              onClick={() => setShowPass(!showpass)}
              className="absolute right-3 top-4 text-gray-300 cursor-pointer"
            >
              {showpass ? <IoEyeOff /> : <IoEye />}
            </span>
          </div>
          <p className="text-red-500 text-xs mt-1 ml-1 h-4">{error.password}</p>
        </div>
        {/* forgot password */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => switchView("forgot-password")}
            type="button"
            className="text-blue-500 hover:text-blue-400 hover:cursor-pointer"
          >
            Forgot Password
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-indigo-500 to-pink-500 text-white p-3 rounded-xl hover:scale-105 transition"
        >
          {loading ? "proccessing..." : "Login"}
        </button>
        <div className="mt-6 text-center text-gray-400 text-xm">
          Do not have an Account?
          <button
            onClick={() => switchView("register")}
            type="button"
            className="text-blue-500 hover:text-blue-400 hover:cursor-pointer"
          >
            Register
          </button>
        </div>
      </>
    );
  };

  // forgot password
  const renderForgotPasswordForm = () => {
    return (
      <>
        <button
          onClick={() => switchView("login")}
          type="button"
          className="absolute top-2 left-0 text-gray-300 hover:text-white"
        >
          <FiArrowLeft />
        </button>
        <h2 className="text-3xl font-bold md-6 text-center text-white ">
          Forgot Password
        </h2>
        <p className="md-6 text-center text-gray-300 ">
          Enter you email to receive a reset password link
        </p>

        {/* email */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <CiMail />
            </span>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={onChangeHandler}
              className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl  focus:ring-2 focus:ring-indigo-500 ${
                error.email ? "border-red-500" : "bg-gray-700"
              }`}
            />
          </div>
          <p className="text-red-500 text-xs mt-1 ml-1 h-4">{error.email}</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-indigo-500 to-pink-500 text-white p-3 rounded-xl hover:scale-105 transition"
        >
          {loading ? "proccessing..." : "Send"}
        </button>
      </>
    );
  };

  // Reset Password
  const renderResetPasswordForm = () => {
    return (
      <>
        <h2 className="text-3xl font-bold md-6 text-center text-white ">
          Welcome Back
        </h2>
        <p className="md-6 text-center text-gray-300 ">
          Sign in your account to continue
        </p>

        {/* New password */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <CiLock />
            </span>
            <input
              type={showpass ? `text` : `password`}
              name="newPassword"
              value={userData.newPassword}
              onChange={onChangeHandler}
              className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl  focus:ring-2 focus:ring-indigo-500 ${
                error.newPassword ? "border-red-500" : "bg-gray-700"
              }`}
            />
            <span
              onClick={() => setShowPass(!showpass)}
              className="absolute right-3 top-3 text-gray-300 cursor-pointer"
            >
              {showpass ? <IoEyeOff /> : <IoEye />}
            </span>
          </div>
          <p className="text-red-500 text-xs mt-1 ml-1 h-4">
            {error.newPassword}
          </p>
        </div>
        {/*  conform password */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <CiLock />
            </span>
            <input
              type={showpass ? `text` : `password`}
              name="conformPassword"
              value={userData.conformPassword}
              onChange={onChangeHandler}
              className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl  focus:ring-2 focus:ring-indigo-500 ${
                error.conformPassword ? "border-red-500" : "bg-gray-700"
              }`}
            />
            <span
              onClick={() => setShowPass(!showpass)}
              className="absolute right-3 top-3 text-gray-300 cursor-pointer"
            >
              {showpass ? <IoEyeOff /> : <IoEye />}
            </span>
          </div>
          <p className="text-red-500 text-xs mt-1 ml-1 h-4">
            {error.conformPassword}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-indigo-500 to-pink-500 text-white p-3 rounded-xl hover:scale-105 transition"
        >
          {loading ? "proccessing..." : "Send"}
        </button>
      </>
    );
  };

  // Verify Email to send OTP
  const renderVerifyEmailForm = () => {
    return (
      <>
        <button
          onClick={() => switchView("login")}
          type="button"
          className="absolute top-2 left-0 text-gray-300 hover:text-white"
        >
          <FiArrowLeft />
        </button>
        <h2 className="text-3xl font-bold md-6 text-center text-white ">
          Verify Email
        </h2>
        <p className="md-6 text-center text-gray-300 ">
          Enter you OTP to verify you Email
        </p>

        {/* email */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <CiMail />
            </span>
            <input
              type="text"
              maxLength={6}
              name="otp"
              value={userData.otp}
              onChange={onChangeHandler}
              className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-xl  focus:ring-2 focus:ring-indigo-500 ${
                error.otp ? "border-red-500" : "bg-gray-700"
              }`}
            />
          </div>
          <p className="text-red-500 text-xs mt-1 ml-1 h-4">{error.otp}</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-indigo-500 to-pink-500 text-white p-3 rounded-xl hover:scale-105 transition"
        >
          {loading ? "proccessing..." : "Send"}
        </button>
      </>
    );
  };

  const renderForm = () => {
    switch (authType) {
      case "login":
        return renderLoginForm();
      case "register":
        return renderRegisterForm();
      case "forgot-password":
        return renderForgotPasswordForm();
      case "reset-password":
        return renderResetPasswordForm();
      case "verify-email":
        return renderVerifyEmailForm();
      default:
        return renderLoginForm();
    }
  };
  return (
    <div className="bg-gray-800 bg-opacity-95 text-white min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md backdrop:blur-xl bg-gray-700 p-8 rounded-3xl shadow-2xl">
        <form
          onSubmit={submitHabdler}
          className="w-full relative animate-fadeInUp"
        >
          {renderForm()}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
