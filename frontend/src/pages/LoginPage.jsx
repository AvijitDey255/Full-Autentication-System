import React, { useState } from "react";

const LoginPage = () => {
  const { authType, setAuthType } = useState("login");
  const { userData, setUserData } = useState({
    userName: "",
    email: "",
    password: "",
    conformPassword: "",
    newPassword: "",
    otp: "",
  });

  const { error, setError } = useState({});
  const { showpass, setShowPass } = useState(false);
  const { loading, setLoading } = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const validedForm = (e) => {
    const newErrors = {};
    const emailRegex = "/^[^s@]+@[^s@]+.[^s@]+$/";
    // login
    if (authType === "login") {
      if (!userData.email) newErrors.email = "Email is required";
      else if (!emailRegex.text(userData.email))
        newErrors.email = "Invalid Email";

      if (!userData.password) newErrors.password = "Password is required";
    }
    // register
    else if (authType === "register") {
      if (!userData.userName) newErrors.userName = "username is required";
      if (!userData.email) newErrors.email = "Email is required";
      else if (!emailRegex.text(userData.email))
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
    }
    // forgot-password
    else if (authType === "forgot-password") {
      if (!userData.email) newErrors.email = "Email is required";
      else if (!emailRegex.text(userData.email))
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
      else if (userData.newPassword !== userData.conformPassword )
        newErrors.conformPassword = "password doesn't match";
    }
    setError(newErrors)
    return Object.keys(newErrors).length === 0
  };
  return <div></div>;
};

export default LoginPage;
