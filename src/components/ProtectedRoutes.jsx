import App from "../App";
import { authenicateUser } from "../api/authApi";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading  from "./Loading.jsx";

const ProtectedRoutes = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await authenicateUser();
            setIsAuthenticated(isAuthenticated);
            setIsLoading(false);
        };
        checkAuth();
    },[]);
    
    return  isLoading 
        ? <div className="flex align-middle sm:h-20 sm:my-40 mb-10 h-8">
            <Loading/> 
        </div> 
        
        : isAuthenticated
            ? <App/> 
            : <Navigate to="/login"/>;

};

export default ProtectedRoutes;