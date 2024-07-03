import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';



export function Dashboard() { 
    
    const { hasCurrentUser, verified } = useSelector((state) => state.user);

    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (!hasCurrentUser) {
            navigate("/login");
            return;
        } 
        setIsVerified(verified);
    });

    
    const navigate = useNavigate();
    
    return (
        <>
            <h2>Welcome Back!</h2>
            
            {!isVerified &&
                <div className="rounded bg-yellow-100 text-red-900 m-5 flex flex-col">
                    <div className="m-2 flex items-center">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 m-3 mr-2"/>
                        <h3 className="text-red-900 text-base font-bold">Email Verification Required</h3>
                    </div>
                    <div className="m-2">
                        <p className="text-xs mx-3 mb-1">Please verify your email to continue</p>
                    </div>
                    
                </div>
            }
        </>
    )
    
}