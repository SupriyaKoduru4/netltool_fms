import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomInput from "../../components/Login/CustomInput";
// @ts-ignore - image import may not have type declarations in this project
import officeBg from "../../assets/Login/backgroundimage.png"
// @ts-ignore - image import may not have type declarations in this project
import SigninImage from "../../assets/Login/signin.png";
// @ts-ignore - image import may not have type declarations in this project
import mailIcon from "../../assets/Login/mail.svg";
// @ts-ignore - image import may not have type declarations in this project
import Eye from "../../assets/Login/eye.svg";
// @ts-ignore - image import may not have type declarations in this project
import Eyeclose from "../../assets/Login/Eyeclose.svg";
// @ts-ignore - image import may not have type declarations in this project
import lockIcon from "../../assets/Login/password.svg";
import { useAppData } from "../../context/AppDate";

import Button from "../../components/UI/Button";

type Props = {
  setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const {login , authLoading , isError , error} = useAppData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleLogin = () => {
    try {

    if (formData.email && formData.password) {
      login({ email: formData.email, password: formData.password });
    } else {
      alert("Please fill all fields");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("An error occurred during login. Please try again.");
  }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background — same blurred office image */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[1.5px] scale-105"
        style={{ backgroundImage: `url(${officeBg})` }}
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* ── MAIN CARD — wider: max-w-4xl ── */}
      <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl grid md:grid-cols-[50%_50%]">

        {/* ── LEFT PANEL — same #d6d4d4 grey ── */}
        <div className="bg-[#d6d4d4] p-8 flex flex-col relative overflow-hidden">

          {/* Subtle decorative circle in corner */}
          <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-black/5" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-black/5" />

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-black text-white w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base shadow-md">
              N
            </div>
            <div>
              <h1 className="font-bold text-lg text-black leading-tight">Netltool_FMS</h1>
              <p className="text-xs text-gray-500 font-medium">Founder Management System</p>
            </div>
          </div>

          {/* Welcome text */}
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Good to see you
            </p>
            <h3 className="text-3xl font-black text-gray-800 leading-tight">
              Welcome back
            </h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Login to access your<br />management dashboard.
            </p>
          </div>

          {/* Signin illustration — same image */}
          <img
            src={SigninImage}
            alt="signin"
            className="w-full mt-auto pt-8 drop-shadow-md"
          />
        </div>

        {/* ── RIGHT PANEL — same white ── */}
        <div className="p-10 flex flex-col justify-center bg-white">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Login to your account</h2>
            <p className="text-sm text-gray-400 mt-1">Enter your credentials below</p>
          </div>

          {/* Email */}
          <div className="mb-5">
           
            <CustomInput
            label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              icon={mailIcon}
            />
          </div>

          {/* Password */}
          <div className="mb-5 relative">
        
            <CustomInput
            label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              icon={lockIcon}
            />
            {/* Eye toggle — positioned relative to the input wrapper */}
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            >
              <img
                src={showPassword ? Eyeclose : Eye}
                alt="toggle password"
                className="w-4 h-4"
              />
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between mt-1 mb-7">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 accent-black cursor-pointer"
              />
              <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                Remember me
              </span>
            </label>
            <button 
              className="text-sm font-semibold text-black cursor-pointer hover:underline underline-offset-2 transition-all"
              onClick={() => navigate("/forgot-password")}
                >
              Forgot Password?
            </button>
          </div>

          {/* Login button — same black, polished */}
         <Button onClick={handleLogin} text="Login" isLoading={authLoading} type="button" disabled={authLoading} />

          {/* Divider with trust note */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex-1 h-px bg-gray-100" />
            <p className="text-xs text-gray-300 whitespace-nowrap">Secured with 256-bit SSL</p>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;