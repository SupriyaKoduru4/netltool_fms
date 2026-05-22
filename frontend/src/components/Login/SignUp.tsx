// // src/components/Login/SignUp.tsx

// import { useState } from "react";

// import CustomInput from "../../components/Login/CustomInput";
// import officeBg from "../../assets/Login/backgroundimage.png";
// import signupImage from "../../assets/Login/Register.png";
// import googleIcon from "../../assets/Login/Google.svg";
// import githubIcon from "../../assets/Login/git.svg";



// type Props = {
//   setShowRegister:
//     React.Dispatch<
//       React.SetStateAction<boolean>
//     >;

//   setIsLoggedIn:
//     React.Dispatch<
//       React.SetStateAction<boolean>
//     >;
// };

// function SignUp({
//   setShowRegister,
//   setIsLoggedIn,
// }: Props) {

//   const [formData, setFormData] = useState({
//       fullname: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     });

//   const [showPassword, setShowPassword] = useState(false);
//   const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);

//   const handleChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]:
//         e.target.value,
//     });

//   };

//   const handleRegister = () => {

//     if (
//       formData.fullname &&
//       formData.email &&
//       formData.password &&
//       formData.confirmPassword
//     ) {

//       if (
//         formData.password !==
//         formData.confirmPassword
//       ) {

//         alert(
//           "Passwords do not match"
//         );

//         return;
//       }

//       setIsLoggedIn(true);

//     } else {

//       alert(
//         "Please fill all fields"
//       );

//     }

//   };

//   return (
//     <div className=" relative min-h-screen flex items-center justify-center overflow-hidden" >  
//          <div className=" absolute inset-0 bg-cover bg-center blur-[1.5px] scale-105 "
//            style={{ backgroundImage: `url(${officeBg})`,
//         }}
//       />

//       <div className="absolute inset-0 bg-black/20"></div>

//   <div className="relative z-10 w-full max-w-[860px] bg-white rounded-2xl overflow-hidden grid md:grid-cols-2 shadow-2xl">

//         <div className=" bg-[#d6d4d4] p-5 flex flex-col " >
 
//           <div className="flex items-center gap-3">
//             <div className=" bg-black text-white w-8 h-8 rounded-md flex items-center justify-center font-semibold " >
//               N
//             </div>

//             <div>
//                <h1 className="font-bold text-lg text-black">Netltool_FMS</h1>
//                <p className="text-sm text-gray-600">Founder Management System </p>
//             </div>

//           </div>


//           <div className="mt-7">
//             <h3 className="text-2xl font-bold text-gray-800">  Create Account </h3>
//            <p className="text-gray-600 mt-1"> Fill your details to get started </p>
//           </div>

//           <img src={signupImage} alt="signup" className=" w-full mx-auto mt-10 " />

//         </div>

        
//         <div className=" p-8 flex flex-col justify-center " >
//              <h2 className="text-1xl font-bold text-gray-800">Create Account</h2>

//           <div className="mt-8">
//           <CustomInput
//             label="Full Name"
//             name="fullname"
//             placeholder="Enter your full name"
//             value={formData.fullname}
//             onChange={handleChange}      
//           />
//           </div>

//           <div className="mt-3">
//             <CustomInput
//               label="Email address"
//               name="email"
//               type="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}           
//             />
//           </div>

//           <div className="mt-3 relative">
//             <CustomInput
//               label="Password"
//               name="password"
//               type={
//                 showPassword
//                   ? "text"
//                   : "password"
//               }
//               placeholder="Create password"
//               value={formData.password}
//               onChange={handleChange}         
//             />

//             <div
//               onClick={() =>
//                 setShowPassword(
//                   !showPassword
//                 )
//               }
//               className="  absolute  right-4  top-[44px] cursor-pointer "  >
//             </div>
//           </div>

//           <div className="mt-3 relative">
//             <CustomInput
//               label="Confirm Password"
//               name="confirmPassword"
//               type={
//                 showConfirmPassword
//                   ? "text"
//                   : "password"
//               }
//               placeholder="Confirm your password"
//               value={ formData.confirmPassword }
//               onChange={handleChange}          
//             />

//             <div
//               onClick={() =>
//                 setShowConfirmPassword(
//                   !showConfirmPassword
//                 )
//               }
//               className=" absolute right-4 top-[44px] cursor-pointer " >
//             </div>
//           </div>

//           <div className="flex items-center gap-2 mt-3">
//             <input type="checkbox" />
//             <p className="text-sm text-gray-600">
//               I agree to the
//               <span className="font-semibold ml-1">
//                 Terms & Conditions
//               </span>
//             </p>
//           </div>

//           <button
//             onClick={handleRegister}
//             className=" w-full bg-black text-white py-2 rounded-md mt-5" >
//             Register
//           </button>

//             <div className="flex items-center gap-3 mt-4">
//             <div className="flex-1 h-[1px] bg-gray-300"></div>
//             <p className="text-sm text-gray-500"> Or continue with </p>
//             <div className="flex-1 h-[1px] bg-gray-300"></div>

//           </div>

    
//             <div className="grid grid-cols-2 gap-4 mt-4">
//                      <button 
//                       className=" border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-100 duration-300 " >
         
//                        <img
//                          src={googleIcon}
//                          alt="google"
//                          className="w-4 h-4"
//                        />
//                        Google
//                      </button>
         
//                      <button
//                        className=" border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-100 duration-300 " >
         
//                        <img
//                          src={githubIcon}
//                          alt="github"
//                          className="w-4 h-4"
//                        />
//                        GitHub
//                      </button>
//                    </div>


//           <p className="text-center mt-4">  Already have an account?
//             <span
//               onClick={() =>
//                 setShowRegister(false)
//               }
//               className=" font-bold ml-1 cursor-pointer " >
//               Login
//             </span>

//           </p>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;


// src/components/Login/SignUp.tsx

import { useState } from "react";

import CustomInput from "../../components/Login/CustomInput";

import officeBg from "../../assets/Login/backgroundimage.png";
import signupImage from "../../assets/Login/Register.png";

import googleIcon from "../../assets/Login/Google.svg";
import githubIcon from "../../assets/Login/git.svg";

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

function SignUp({
  setShowRegister,
  setIsLoggedIn,
}: Props) {

  const [formData, setFormData] =
    useState({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleRegister = () => {

    if (
      formData.fullname &&
      formData.email &&
      formData.password &&
      formData.confirmPassword
    ) {

      if (
        formData.password !==
        formData.confirmPassword
      ) {

        alert(
          "Passwords do not match"
        );

        return;
      }

      setIsLoggedIn(true);

    } else {

      alert(
        "Please fill all fields"
      );

    }

  };

  return (

    <div
      className="
        relative
        min-h-screen
        flex
        items-center
        justify-center
        overflow-hidden
        px-4
      "
    >

      {/* BACKGROUND */}
      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          blur-[1.5px]
          scale-105
        "
        style={{
          backgroundImage:
            `url(${officeBg})`,
        }}
      />

      <div className="absolute inset-0 bg-black/20"></div>

      {/* MAIN CARD */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-[890px]
          bg-white
          rounded-2xl
          overflow-hidden
          grid
          md:grid-cols-2
          shadow-2xl
        "
      >

        {/* LEFT */}
        <div
          className="
            bg-[#d6d4d4]
            px-6
            py-5
            flex
            flex-col
            justify-center
          "
        >

          {/* LOGO */}
          <div className="flex items-center gap-3">

            <div
              className="
                bg-black
                text-white
                w-9
                h-9
                rounded-md
                flex
                items-center
                justify-center
                font-semibold
              "
            >
              N
            </div>

            <div>

              <h1
                className="
                  font-bold
                  text-xl
                  text-black
                "
              >
                Netltool_FMS
              </h1>

              <p className="text-gray-600">
                Founder Management System
              </p>

            </div>

          </div>

          {/* TITLE */}
          <div className="mt-8">

            <h3
              className="
                text-4xl
                font-bold
                text-[#0d2240]
              "
            >
              Create Account
            </h3>

            <p
              className="
                text-gray-700
                mt-2
                text-xl
              "
            >
              Fill your details to get started
            </p>

          </div>

          {/* IMAGE */}
          <img
            src={signupImage}
            alt="signup"
            className="
              w-[62%]
              mx-auto
              mt-5
            "
          />

        </div>

        {/* RIGHT */}
        <div
          className="
            px-8
            py-5
            flex
            flex-col
            justify-center
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-gray-800
            "
          >
            Create Account
          </h2>

          {/* FULL NAME */}
          <div className="mt-5">

            <CustomInput
              label="Full Name"
              name="fullname"
              placeholder="Enter your full name"
              value={formData.fullname}
              onChange={handleChange}
            />

          </div>

          {/* EMAIL */}
          <div className="mt-3">

            <CustomInput
              label="Email address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          {/* PASSWORD */}
          <div className="mt-3">

            <CustomInput
              label="Password"
              name="password"
              type="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
            />

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mt-3">

            <CustomInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
            />

          </div>

          {/* TERMS */}
          <div className="flex items-center gap-2 mt-3">

            <input type="checkbox" />

            <p className="text-sm text-gray-600">

              I agree to the

              <span className="font-semibold ml-1">
                Terms & Conditions
              </span>

            </p>

          </div>

          {/* BUTTON */}
          <button
            onClick={handleRegister}
            className="
              w-full
              bg-black
              text-white
              py-3
              rounded-md
              mt-4
              font-semibold
            "
          >
            Register
          </button>

          {/* DIVIDER */}
          <div
            className="
              flex
              items-center
              gap-3
              mt-4
            "
          >

            <div className="flex-1 h-[1px] bg-gray-300"></div>

            <p className="text-gray-500">
              Or continue with
            </p>

            <div className="flex-1 h-[1px] bg-gray-300"></div>

          </div>

          {/* SOCIAL */}
          <div
            className="
              grid
              grid-cols-2
              gap-4
              mt-4
            "
          >

            <button
              className="
                border
                border-gray-300
                rounded-md
                py-3
                flex
                items-center
                justify-center
                gap-2
              "
            >

              <img
                src={googleIcon}
                alt="google"
                className="w-5 h-5"
              />

              Google

            </button>

            <button
              className="
                border
                border-gray-300
                rounded-md
                py-3
                flex
                items-center
                justify-center
                gap-2
              "
            >

              <img
                src={githubIcon}
                alt="github"
                className="w-5 h-5"
              />

              GitHub

            </button>

          </div>

          {/* FOOTER */}
          <p className="text-center mt-4 text-gray-600">

            Already have an account?

            <span
              onClick={() =>
                setShowRegister(false)
              }
              className="
                font-bold
                ml-1
                cursor-pointer
                text-black
              "
            >
              Login
            </span>

          </p>

        </div>
      </div>
    </div>
  );
}

export default SignUp;