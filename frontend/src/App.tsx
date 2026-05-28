// src/App.tsx

import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Blogs from "./pages/Blogs";
import Projects from "./pages/Projects";
import BlogEditor from "./pages/BlogEditor";
import Video from "./pages/Video";
import ProjectUpdates from "./pages/ProjectUpdates";
import Settings from "./pages/Settings";

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
          path="/studio"
          element={
            <Video/>
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
        <Route path="/blog-editor" element={<BlogEditor/>} />

        <Route path="/project-updates/:projectId" element={<ProjectUpdates />} />

        <Route path="/settings" element={<Settings/>} />
      </Routes>
          
    </div>

  );
}

export default App;