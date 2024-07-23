import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";

export default function StatisticsBox(props) {

    const {title, curr, prev, reverse} = props;

    const difference = parseFloat((Math.abs(curr - prev) / Math.abs(prev)) * 100).toFixed(2);

    return (
        <>
            <div className="p-2 flex flex-col group">
                <div className="flex flex-row justify-between">
                    <div className="text-sm p-2">{title}</div>
                    <div>
                        {
                            difference > 0
                            ? <div className={`${reverse ? "text-red-600" : "text-green-600"} text-sm p-2 space-x-2`}>
                                {
                                    reverse 
                                    ? <ArrowTrendingDownIcon className="h-4 w-4 inline mr-1" />
                                    : <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" /> 
                                }
                                +{difference}%
                            </div>
                            : <div className={`${reverse ? "text-green-600" : "text-red-600"} text-sm p-2`}>
                                {
                                    reverse 
                                    ? <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" />
                                    : <ArrowTrendingDownIcon className="h-4 w-4 inline mr-1" />
                                }
                                {difference}%
                            </div>
                        
                        }
                    </div>
                </div>
                <div className="flex flex-row justify-between">
                    <div className="font-semibold text-2xl p-2">${curr}</div>
                    <div className="text-sm p-4 text-gray-400 invisible group-hover:visible"> ${prev}</div>
                </div>
            </div>
        </>
    )
}