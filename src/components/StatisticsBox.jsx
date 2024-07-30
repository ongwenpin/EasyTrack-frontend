import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";

export default function StatisticsBox(props) {

    const {title, curr, prev, reverse, status} = props;

    const difference = parseFloat((Math.abs(curr - prev) / Math.abs(prev)) * 100).toFixed(2);

    return (
        <>
            <div className="p-2 flex flex-row justify-between group bg-white overflow-x-visible">
                <div className="flex flex-col">
                    <div className="text-sm p-2">{title}</div>
                    {
                        status.every((val) => val === "fulfilled") 
                        ? <div className="font-semibold text-2xl p-2">${curr}</div>
                        :<div className="font-semibold text-2xl p-2">--</div>
                    }
                </div>
                <div className="flex flex-col sm:break-all">
                    {
                        (status.every((val) => val === "fulfilled")
                        ? <>
                            <div>
                                {
                                    (curr - prev) > 0
                                    ? <div className={`${reverse ? "text-red-600" : "text-green-600"} text-sm p-2 space-x-2`}>
                                        {(!isNaN(difference) && prev !== 0) && <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" /> }
                                        {(isNaN(difference) || prev === 0) ? "--" : `+${difference}`}%
                                    </div>
                                    : <div className={`${reverse ? "text-green-600" : "text-red-600"} text-sm p-2`}>
                                        {(!isNaN(difference) && prev !== 0) && <ArrowTrendingDownIcon className="h-4 w-4 inline mr-1" />}
                                        {(isNaN(difference) || prev === 0) ? "--" : `-${difference}`}%
                                    </div>
                                
                                }
                            </div>
                            <div className="text-sm p-2 text-gray-400 invisible group-hover:visible text-right"> ${prev}</div>
                        </>
                        : <>
                            <div className="font-semibold text-sm p-2 text-right">--</div>
                            <div className="text-sm p-2 text-gray-400 invisible group-hover:visible text-right"> --</div>
                        </>) 

                    }
                    
                </div>
            </div>
        </>
    )
}