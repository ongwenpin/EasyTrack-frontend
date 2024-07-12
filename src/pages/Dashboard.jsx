import { useSelector } from "react-redux";
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { WeeklyProfitCard } from "../components/WeeklyProfitCard";
import { DailyProfitCard } from "../components/DailyProfitCard";
import GlobalSearchbar from "../components/GlobalSearchbar";

export function Dashboard() { 
    
    const { verified, currentUser } = useSelector((state) => state.user);

    return (
        <>
            <div className="flex items-center w-full">
                <div className="flex-1 mt-2 ml-4 font-bold text-2xl">
                    Welcome back {currentUser.username}
                </div>
                <div className="flex-1 mt-2">
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
            <div className="grid grid-cols-4 gap-x-2 gap-y-2 border my-4 mx-8 py-4 px-16 bg-gray-200 rounded-lg">
                <div className="col-span-2 border bg-white rounded-lg">
                    <WeeklyProfitCard />
                </div>
                <div className="col-span-2 border bg-white rounded-lg">
                    <DailyProfitCard />
                </div>
            </div>
            
            
        </>
    )
    
}