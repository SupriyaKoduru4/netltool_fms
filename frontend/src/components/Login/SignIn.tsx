import React, { useState } from "react";

import CustomInput from "../../components/Login/CustomInput";
import officeBg from "../../assets/Login/backgroundimage.png";
import SigninImage from "../../assets/Login/signin.png";
import googleIcon from "../../assets/Login/Google.svg";
import githubIcon from "../../assets/Login/git.svg";
import mailIcon from "../../assets/Login/mail.svg";
import lockIcon from "../../assets/Login/password.svg";
import Eye from "../../assets/Login/eye.svg";
import Eyeclose from "../../assets/Login/Eyeclose.svg";

type Props = {
  setShowRegister:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;

  setIsLoggedIn:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;
};


function SignIn({
  setShowRegister,
  setIsLoggedIn
}: Props) {


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

   const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const handleLogin = () => {
    if (
      formData.email &&
      formData.password
    ) {
      setIsLoggedIn(true);
    } else {
      alert("Please fill all fields");
    }
  };


  return (
   <div className=" relative min-h-screen flex items-center justify-center overflow-hidden" >  
      <div className=" absolute inset-0 bg-cover bg-center blur-[1.5px] scale-105 "
        style={{ backgroundImage: `url(${officeBg})`,
        }}
      />

      <div className="absolute inset-0 bg-black/20"></div>

      <div className=" relative z-10 w-full max-w-2xl bg-white rounded-2xl overflow-hidden grid md:grid-cols-2 shadow-2xl " >

        <div className=" bg-[#d6d4d4] p-5 flex flex-col " >
 
          <div className="flex items-center gap-3">
            <div className=" bg-black text-white w-8 h-8 rounded-md flex items-center justify-center font-semibold " >
              N
            </div>

            <div>
               <h1 className="font-bold text-lg text-black">Netltool_FMS</h1>
               <p className="text-sm text-gray-600">Founder Management System </p>
            </div>

          </div>

          <div className="mt-12">
           <h3 className="text-2xl font-bold text-gray-800">Welcome Back</h3>
           <p className="text-gray-600 mt-1">Login to your account</p>
          </div>

          <img src={SigninImage} alt="signin" className=" w-full mx-auto mt-10 " />
       </div>


        <div className=" p-8 flex flex-col justify-center " >
          <h2 className="text-1xl font-bold text-gray-800">Login to your account</h2>

          <div className="mt-8"> 
            <CustomInput
              label="Email address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              icon={mailIcon}
            />
         </div>

          <div className="mt-5">
             <CustomInput
              label="Password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              icon={lockIcon}
            />
              <div
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="
                absolute
                right-10
                top-[230px]
                cursor-pointer
                text-gray-500
                text-xl
              "
            >
              <img 
              src = {
                showPassword
                ? Eyeclose
                : Eye
              }
              alt = "eye"
              className="w-4 h-4"
              />

            </div>
          </div>

          <div className=" flex items-center justify-between mt-4 " >
            <div className="flex items-center gap-2">
              <input type="checkbox" />
              <p className="text-sm text-gray-600"> Remember me </p>
            </div>
            <p className=" text-sm font-semibold text-black cursor-pointer " > Forgot Password? </p>
          </div>

          <button
            onClick={handleLogin}
            className=" w-full bg-black text-white py-2 rounded-md mt-6 hover:bg-gray-800 duration-300 " >
            Login
          </button>

          <div className="flex items-center gap-3 mt-4">

            <div className="flex-1 h-[1px] bg-gray-300"></div>

            <p className="text-sm text-gray-500"> Or continue with </p>

            <div className="flex-1 h-[1px] bg-gray-300"></div>

          </div>


          <div className="grid grid-cols-2 gap-4 mt-4">
            <button 
             className=" border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-100 duration-300 " >

              <img
                src={googleIcon}
                alt="google"
                className="w-4 h-4"
              />
              Google
            </button>

            <button
              className=" border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-100 duration-300 " >

              <img
                src={githubIcon}
                alt="github"
                className="w-4 h-4"
              />
              GitHub
            </button>
          </div>


          <p className="text-center text-sm text-gray-500 mt-4">
             Don't have an account?
            <span  onClick={() =>
                setShowRegister(true)
              } className=" text-black font-semibold ml-1 cursor-pointer " >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

