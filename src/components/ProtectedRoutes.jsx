import App from "../App";
import { authenicateUser } from "../utils/auth";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading  from "./Loading.jsx";

const ProtectedRoutes = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    //const { hasCurrentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await authenicateUser();
            setIsAuthenticated(isAuthenticated);
            setIsLoading(false);
        };
        checkAuth();
    },[]);
    
    return  isLoading 
        ? <Loading/> 
        : isAuthenticated
            ? <App/> 
            : <Navigate to="/login"/>;

};

export default ProtectedRoutes;