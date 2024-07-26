import StatisticsBox from './StatisticsBox';
import { getDailyEarnings, getWeeklyEarnings, getMonthlyProfits } from '../api/analyticsApi';
import { useState, useEffect } from 'react';
import Loading from "./Loading";

export default function DashboardStatistics() {

    const currDay = new Date();
    const prevDay = new Date(currDay.getTime() - (24 * 60 * 60 * 1000));
    const prevWeek = new Date(currDay.getTime() - (7 * 24 * 60 * 60 * 1000));
    const currMonth = currDay.getMonth();
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
    const currYear = currDay.getFullYear();
    const prevYear = currMonth === 0 ? currYear - 1 : currYear;

    const [isLoading, setIsLoading] = useState(true);
    const [currDailyEarnings, setCurrDailyEarnings] = useState(0);
    const [prevDailyEarnings, setPrevDailyEarnings] = useState(0);
    const [currWeeklyEarnings, setCurrWeeklyEarnings] = useState(0);
    const [prevWeeklyEarnings, setPrevWeeklyEarnings] = useState(0);
    const [currMonthlyEarnings, setCurrMonthlyEarnings] = useState({earning: 0, profit: 0, expense: 0});
    const [prevMonthlyEarnings, setPrevMonthlyEarnings] = useState({earning: 0, profit: 0, expense: 0});
    const [apiResult, setApiResult] = useState([]);


    useEffect(() => {
        setIsLoading(true);
        Promise.allSettled([
            getDailyEarnings(currDay),
            getDailyEarnings(prevDay),
            getWeeklyEarnings(currDay),
            getWeeklyEarnings(prevWeek),
            getMonthlyProfits(currMonth, currYear),
            getMonthlyProfits(prevMonth, prevYear)
        ]).then((data) => {
            data.forEach((result) => {
                setApiResult(prev => {
                    return prev.concat(result.status);
                })
            })
            if (data) {
                setCurrDailyEarnings(data[0].value.earning);
                setPrevDailyEarnings(data[1].value.earning);
                setCurrWeeklyEarnings(data[2].value.earning.reduce((acc, curr) => acc + curr, 0));
                setPrevWeeklyEarnings(data[3].value.earning.reduce((acc, curr) => acc + curr, 0));
                setCurrMonthlyEarnings(data[4].value);
                setPrevMonthlyEarnings(data[5].value);
            }
            
        })
        .finally(() => setIsLoading(true));

    },[]);

    return (
        <>
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-2">
                <div className="border col-span-1 bg-white rounded-md sm:w-auto w-fit">
                    <StatisticsBox title="Daily Earning" curr={currDailyEarnings} prev={prevDailyEarnings} reverse={false} status={apiResult.slice(0, 2)} />
                </div>
                <div className="border col-span-1 bg-white rounded-md sm:w-auto w-fit">
                    <StatisticsBox title="Weekly Earning" curr={currWeeklyEarnings} prev={prevWeeklyEarnings} reverse={false} status={apiResult.slice(2, 4)} />
                </div>
                <div className="border col-span-1 bg-white rounded-md sm:w-auto w-fit">
                    <StatisticsBox title="Monthly Earning" curr={currMonthlyEarnings ? currMonthlyEarnings.earning : 0} prev={prevMonthlyEarnings ? prevMonthlyEarnings.earning : 0} reverse={false} status={apiResult.slice(4, 6)} />
                </div>
                <div className="border col-span-1 bg-white rounded-md sm:w-auto w-fit">
                    <StatisticsBox title="Monthly Expense" curr={currMonthlyEarnings ? currMonthlyEarnings.expense : 0} prev={prevMonthlyEarnings ? prevMonthlyEarnings.expense : 0} reverse={true} status={apiResult.slice(4, 6)} />
                </div>
                <div className="border col-span-1 bg-white rounded-md sm:w-auto w-fit">
                    <StatisticsBox title="Monthly Profit" curr={currMonthlyEarnings ? currMonthlyEarnings.profit : 0} prev={prevMonthlyEarnings ? prevMonthlyEarnings.profit : 0} reverse={false} status={apiResult.slice(4, 6)} />
                </div>
            </div>
        </>
    )


}