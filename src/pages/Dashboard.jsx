import { useSelector } from "react-redux";
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { WeeklyEarningCard } from "../components/WeeklyEarningCard";
import { DailyEarningCard } from "../components/DailyEarningCard";
import GlobalSearchbar from "../components/GlobalSearchbar";
import { AnnualProfitCard } from "../components/AnnualProfitCard";

export function Dashboard() { 
    
    const { verified, currentUser } = useSelector((state) => state.user);

    return (
        <>
            <div className="">
            
                <div className="flex items-center w-full">
                    <div className="flex-1 mt-2 ml-4 font-bold text-2xl">
                        Welcome back {currentUser.username}
                    </div>
                    <div className="flex-1 mt-2 z-10">
                        <GlobalSearchbar />
                    </div>
                    <div className="flex-1 invisible">
                        Placeholder
                    </div>
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
                <div className="grid grid-cols-4 gap-x-2 gap-y-2 border my-4 mx-8 py-4 sm:px-16 px-4 bg-gray-200 rounded-lg">
                    <div className="sm:col-span-2 col-span-4 border bg-white rounded-lg">
                        <WeeklyEarningCard />
                    </div>
                    <div className="sm:col-span-2 col-span-4 border bg-white rounded-lg">
                        <DailyEarningCard />
                    </div>
                    <div className="col-span-4 border bg-white rounded-lg">
                        <AnnualProfitCard />
                    </div>
                    
                </div>
            </div>
            
            
        </>
    )
    
}