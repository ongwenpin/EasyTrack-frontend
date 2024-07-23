import StatisticsBox from './StatisticsBox';
import { getDailyEarnings, getWeeklyEarnings, getMonthlyProfits } from '../utils/analytics';
import { useState, useEffect } from 'react';

export default function DashboardStatistics() {

    const currDay = new Date();
    const prevDay = new Date(currDay.getTime() - (24 * 60 * 60 * 1000));
    const prevWeek = new Date(currDay.getTime() - (7 * 24 * 60 * 60 * 1000));
    const currMonth = currDay.getMonth();
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
    const currYear = currDay.getFullYear();
    const prevYear = currMonth === 0 ? currYear - 1 : currYear;


    const [currDailyEarnings, setCurrDailyEarnings] = useState(0);
    const [prevDailyEarnings, setPrevDailyEarnings] = useState(0);
    const [currWeeklyEarnings, setCurrWeeklyEarnings] = useState(0);
    const [prevWeeklyEarnings, setPrevWeeklyEarnings] = useState(0);
    const [currMonthlyEarnings, setCurrMonthlyEarnings] = useState({earning: 0, profit: 0, expense: 0});
    const [prevMonthlyEarnings, setPrevMonthlyEarnings] = useState({earning: 0, profit: 0, expense: 0});

    useEffect(() => {
        getDailyEarnings(currDay).then(data => {
            setCurrDailyEarnings(data.earning);
        });
        getDailyEarnings(prevDay).then(data => {
            setPrevDailyEarnings(data.earning);
        });
        getWeeklyEarnings(currDay).then(data => {
            setCurrWeeklyEarnings(data.earning.reduce((acc, curr) => acc + curr, 0));
        });
        getWeeklyEarnings(prevWeek).then(data => {
            setPrevWeeklyEarnings(data.earning.reduce((acc, curr) => acc + curr, 0));
        });
        getMonthlyProfits(currMonth, currYear).then(data => {
            setCurrMonthlyEarnings(data);
        });
        getMonthlyProfits(prevMonth, prevYear).then(data => {
            setPrevMonthlyEarnings(data);
        });

    },[]);

    return (
        <>
            <div className="grid grid-cols-3 gap-2">
                <div className="border col-span-1 bg-white rounded-md">
                    <StatisticsBox title="Daily Earning" curr={currDailyEarnings} prev={prevDailyEarnings} reverse={false}/>
                </div>
                <div className="border col-span-1 bg-white rounded-md">
                    <StatisticsBox title="Weekly Earning" curr={currWeeklyEarnings} prev={prevWeeklyEarnings} reverse={false}/>
                </div>
                <div className="border col-span-1 bg-white rounded-md">
                    <StatisticsBox title="Monthly Earning" curr={currMonthlyEarnings ? currMonthlyEarnings.earning : 0} prev={prevMonthlyEarnings ? prevMonthlyEarnings.earning : 0} reverse={false}/>
                </div>
                <div className="border col-span-1 bg-white rounded-md">
                    <StatisticsBox title="Monthly Expense" curr={currMonthlyEarnings ? currMonthlyEarnings.expense : 0} prev={prevMonthlyEarnings ? prevMonthlyEarnings.expense : 0} reverse={true}/>
                </div>
                <div className="border col-span-1 bg-white rounded-md">
                    <StatisticsBox title="Monthly Profit" curr={currMonthlyEarnings ? currMonthlyEarnings.profit : 0} prev={prevMonthlyEarnings ? prevMonthlyEarnings.profit : 0} reverse={false}/>
                </div>
            </div>
        </>
    )


}