import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import Settings from "./Components/Settings/Settings";
import ProtectedRoute from "./Components/ProtectedRoutes/ProtectedRoute";
import Analytics from "./Components/Analytics/Analytics";
import Task from "./Components/Task/Task";
import NotFound from "./Components/NotFound/NotFound";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute Component={Dashboard} />}
          />
          <Route
            path="/analytics"
            element={<ProtectedRoute Component={Analytics} />}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute Component={Settings} />}
          />
          <Route path="/tasks/:taskId" element={<Task />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
