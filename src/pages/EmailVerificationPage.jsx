import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { verifyEmailSuccess } from "../redux/userSlice";
import Loading from "../components/Loading";

export default function EmailVerificationPage() {

    const { verify_key } = useParams();
    const { hasCurrentUser, verified, currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [success, setSuccess] = useState(false);
    const [sentVerification, setSentVerification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resendEmailSuccess, setReSendEmailSuccess] = useState(false);

    // useEffect(() => {
    //     if (!hasCurrentUser) {
    //         navigate(
    //             {
    //                 pathname: "/login",
    //                 search: "?redirect=/verify/" + verify_key
    //             }
    //         );
    //     } else if (verified) {
    //         navigate("/");
    //     }
        
    // }, []);

    const verifyEmail = async () => {

        try {
            setIsLoading(true);
            setSentVerification(true);
            const response = await axios.post(`http://localhost:5050/api/verify/` + verify_key, {username: currentUser.username}, {withCredentials: true});
            setSuccess(true);
            dispatch(verifyEmailSuccess());
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    } 

    const resendEmail = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post("http://localhost:5050/api/verify", {username: currentUser.username}, {withCredentials: true});
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-white">
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="mx-auto max-w-2xl py-28 sm:py-32 lg:py-40">
                    <div className="text-center">
                        {
                            sentVerification
                            ? <>
                                {
                                    isLoading
                                    ? <div className="flex align-middle sm:h-28 mb-10 h-8">
                                        <Loading />
                                    </div>
                                    : (success
                                        ? <>
                                            <div className="flex flex-col space-x-4">
                                                <div>
                                                    <h2 className="text-2xl font-bold tracking-tight text-green-500 sm:text-5xl">
                                                        Email Verification Successful
                                                    </h2>
                                                </div>
                                                <div className="p-4">
                                                    <button  
                                                        onClick={() => navigate("/")}
                                                        className="text-sm font-semibold leading-6 text-gray-900 rounded-md bg-gray-200 px-3.5 py-2.5 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                                    >
                                                        Go Homepage
                                                    </button>
                                                </div>
                                            </div>
                                            
                                        </>
                                        : <>
                                            <div className="flex flex-col space-x-4">
                                                
                                                    {
                                                        !resendEmailSuccess
                                                        ? <>
                                                            <div>
                                                                <h2 className="text-2xl font-bold tracking-tight text-red-500 sm:text-5xl">
                                                                    Email verification Failed 
                                                                </h2>
                                                            </div>
                                                            <div className="p-4">
                                                                <button  
                                                                    onClick={() => {
                                                                        resendEmail().then(() => {
                                                                            setReSendEmailSuccess(true);
                                                                        });
                                                                    }}
                                                                    className="text-sm font-semibold leading-6 text-gray-900 rounded-md bg-gray-200 px-3.5 py-2.5 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                                                >
                                                                    Resend Email Verification
                                                                </button>
                                                            </div>
                                                         </>
                                                        : <>
                                                            <div>
                                                                <h2 className="text-2xl font-bold tracking-tight text-black sm:text-5xl">
                                                                        Email verification resent. Please check your email 
                                                                </h2>
                                                            </div>
                                                            <div className="p-4">
                                                                <button  
                                                                    onClick={() => navigate("/")}
                                                                    className="text-sm font-semibold leading-6 text-gray-900 rounded-md bg-gray-200 px-3.5 py-2.5 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                                                >
                                                                    Go Homepage
                                                                </button>
                                                            </div>
                                                        </>
                                                    }
                                                
                                            </div>
                                            
                                        </>
                                    )

                                }
                            </>
                            : <>
                                <div className="flex flex-col space-x-4">
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                            Verify your email account by clicking the button below
                                        </h2>
                                    </div>
                                    <div className="p-4">
                                        <button
                                        onClick={verifyEmail}
                                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                    
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
        
    
    )
}