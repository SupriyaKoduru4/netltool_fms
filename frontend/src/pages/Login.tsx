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

function Login({
  setIsLoggedIn,
}: Props) {

  const [showRegister, setShowRegister] =
    useState(false);

  return (

    <div>

      {showRegister ? (

        <SignUp
          setShowRegister={setShowRegister}
          setIsLoggedIn={setIsLoggedIn}
        />

      ) : (

        <SignIn
          setShowRegister={setShowRegister}
          setIsLoggedIn={setIsLoggedIn}
        />

      )}

    </div>

  );
}

export default Login;