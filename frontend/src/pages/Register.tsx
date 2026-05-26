import { useState } from "react";
import CustomInput from "../components/Login/CustomInput";

const Register = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* Left Panel */}
      <div className="bg-[#0f0f0f] flex flex-col justify-between p-20 min-h-screen">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-xl" />
          <span className="text-white text-xl font-semibold tracking-widest uppercase">
            Netltool
          </span>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[3px] text-gray-600 mb-4">
            Core Team Onboarding
          </p>
          <h1 className="text-5xl font-bold text-white leading-tight mb-5">
            Welcome aboard,
            <span className="text-gray-400 ml-2">Udai.</span>
          </h1>
          <p className="text-gray-500 text-lg ">
            We're going to have a wild ride of innovation, creativity, and fun.
            Thrilled to have you on the Core Team.
          </p>

          <div className="mt-10 flex flex-col gap-3">
            {[
              { label: "Platform", value: "Operational", active: true },
              { label: "Team access", value: "Core Team", active: true },
              { label: "Fleet nodes", value: "Syncing...", active: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-3 border-t border-[#1c1c1c]">
                <span className={`w-2 h-2 rounded-full ${item.active ? "bg-gray-500" : "bg-[#2a2a2a]"}`} />
                <span className="text-[12px] text-gray-600">
                  {item.label} <span className="text-gray-400">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-gray-700">© 2026 Netltool Robotics</p>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center bg-gray-50 p-10 min-h-screen">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-10">
          <p className="text-[11px] uppercase tracking-[2px] text-gray-400 mb-2">
            Get started
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Create your account
          </h2>

          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <CustomInput label="First Name" name="firstName" placeholder="Udai" type="text" />
              <CustomInput label="Last Name" name="lastName" placeholder="Sai" type="text" />
            </div>  

            <CustomInput label="Phone Number" name="phone" placeholder="+91 98765 43210" type="tel" />

            <CustomInput label="Password" name="password" placeholder="Min. 8 chars" type="password" />

            <CustomInput label="Profile Photo" name="profileImage" placeholder="" type="file" />

            <button
              type="submit"
              className="mt-2 w-full bg-gray-900 hover:bg-black text-white text-sm font-medium py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Create account
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            <p className="text-center text-xs text-gray-400 mt-1">
              Already have an account?{" "}
              <a href="/login" className="text-gray-700 font-medium hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Register;