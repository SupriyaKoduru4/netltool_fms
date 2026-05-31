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
import Videos from "./pages/Videos";
import VideoDetails from "./pages/VideoDetails";
import ComingSoon from "./pages/ComingSoon";
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
            <Videos/>
          }
        />
        <Route
          path="/video-recorder"
          element={
            <Video/>
          }
        />
        <Route
          path="/videos"
          element={
            <Videos/>
          }
        />
        <Route
          path="/videos/:id"
          element={
            <VideoDetails/>
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
        
        <Route path="/transcripts" element={<ComingSoon title="Transcripts" />} />
        <Route path="/hardwarecomponents" element={<ComingSoon title="Hardware Components" />} />
        <Route path="/tasks" element={<ComingSoon title="Tasks" />} />
        <Route path="/calendar" element={<ComingSoon title="Calendar" />} />
      </Routes>
          
    </div>

  );
}

export default App;