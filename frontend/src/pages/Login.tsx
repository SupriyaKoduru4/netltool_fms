// src/pages/Login.tsx

import { useState } from "react";

import SignIn from "../components/Login/SignIn";
import SignUp from "../components/Login/SignUp";

type Props = {
  setIsLoggedIn:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;
};

function Login() {

  
  return (

    <div>

      

       

        <SignIn
         
        />

      

    </div>

  );
}

export default Login;