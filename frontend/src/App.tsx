// src/App.tsx

import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Blogs from "./pages/Blogs";
import Projects from "./pages/Projects";

function App() {

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  return (

    <div>
      
      <Routes>
        <Route
          path="/login"
          element={
            <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route 
          path="/register"
          element={
            <Register />
          }
        />
        <Route
          path="/"
          element={
            <Homepage/>
          }
        />
        <Route 
        path="/blogs"
        element={<Blogs/>}
        />
        <Route 
        path="/projects"
        element={<Projects/>}
        />
      </Routes>

    </div>

  );
}

export default App;