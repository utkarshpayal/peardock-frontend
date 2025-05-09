// @ts-nocheck

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = (props: any) => {
  return props.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
