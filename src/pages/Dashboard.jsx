import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { authenicateUser } from "../utils/auth";
import { WeeklyProfitCard } from "../components/WeeklyProfitCard";
//import { DailyProfitCard } from "../components/DailyProfitCard";

export function Dashboard() { 
    
    const { verified, currentUser } = useSelector((state) => state.user);

    const navigate = useNavigate();

    useEffect(() => {
        try {
            authenicateUser().then((response) => {
                if (!response) {
                    navigate("/login");
                }
            });

        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <>
            <div className="mt-2 ml-4 font-bold text-xl">
                Welcome back {currentUser.username}
            </div>
            
            {
                !verified &&
                <div className="rounded bg-yellow-100 text-red-900 m-5 flex flex-col">
                    <div className="m-2 flex items-center">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 m-3 mr-2"/>
                        <h3 className="text-red-900 text-base font-bold">Email Verification Required</h3>
                    </div>
                    <div className="ml-2 mb-2">
                        <p className="text-xs mx-3 mb-1">Please verify your email to continue</p>
                    </div>
                    
                </div>
            }
            <div className="grid grid-cols-5 gap-x-2 gap-y-2 border my-4 mx-8 p-4 bg-gray-200 rounded-lg">
                <div className="col-span-1 border rounded-lg">

                </div>
                <div className="col-span-2 border bg-white rounded-lg">
                    <WeeklyProfitCard />
                </div>
                <div className="col-span-1 border bg-white rounded-lg">
                    {/* <DailyProfitCard /> */}
                </div>
            </div>
            
            
        </>
    )
    
}