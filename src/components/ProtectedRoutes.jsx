import App from "../App";
import { authenicateUser } from "../api/authApi";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading  from "./ButtonLoading.jsx";

const ProtectedRoutes = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const authRes = await authenicateUser();
            setIsAuthenticated(authRes);
            setIsLoading(false);
        };
        checkAuth();
    },[]);
    
    return  isLoading 
        ? <div className="flex justify-center align-middle h-20 mb-10 mt-40">
            <div>
                <Loading/> 
            </div>
        </div> 
        
        : isAuthenticated
            ? <App/> 
            : <Navigate to="/login"/>;

};

export default ProtectedRoutes;