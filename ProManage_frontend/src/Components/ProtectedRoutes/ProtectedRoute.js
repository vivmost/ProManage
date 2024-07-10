import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./Authenticated";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = (props) => {
  const { Component } = props;
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("Is Authenticated:", isAuthenticated);
  if (isAuthenticated) {
    return <Component />;
  } else {
    toast.error("Please Login to your account!");
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
