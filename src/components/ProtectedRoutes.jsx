import App from "../App";
import { authenicateUser } from "../utils/auth";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {

    const { hasCurrentUser } = useSelector((state) => state.user);
    
    return hasCurrentUser ? <App/> : <Navigate to="/login"/>;

};

export default ProtectedRoutes;