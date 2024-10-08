import { BarPlot, ChartsXAxis, ResponsiveChartContainer, ChartsTooltip } from "@mui/x-charts";
import { getWeeklyEarnings } from "../api/analyticsApi";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Box from '@mui/material/Box';
import { Paper } from "@mui/material";
import BarChartIcon from '@mui/icons-material/BarChart';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import Tooltip from '@mui/material/Tooltip';
import { getAccessToken } from "../api/authApi";

export function WeeklyEarningCard() {

    const [isLoading, setIsLoading] = useState(true);

    const [chartData, setChartData] = useState({});

    const [isSplit, setIsSplit] = useState(false)

    useEffect(() => {
        setIsLoading(true);
        const date = new Date();
        getWeeklyEarnings(date).then((data) => {
            if (data) {
                setChartData(data);
            }
        }).catch((error) => {
            if (error.message === "Access token expired") {
                getAccessToken().then(() => {
                    return getWeeklyEarnings()
                }).then((data) => {
                    if (data) {
                        setChartData(data);
                    }
                });
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    function extractProfitBreakdown(data) {

        const earningBreakdown = []
        // get all keys but profit and day from an object
        const keys = Object.keys(data).filter((key) => key !== 'earning' && key !== 'day');

        keys.forEach((key) => {
            earningBreakdown.push({type: "bar", data: data[key], label: key, stack: "total"});
        });

        return earningBreakdown;
    }

    const chartSetting = {
        series: isSplit ? extractProfitBreakdown(chartData) : [
            {
                type: "bar",
                data: chartData.earning,
                label: "Earning",
            },
        ],

    }

    return (
        <>
            {isLoading 
                ? <div className="flex align-middle sm:h-20 sm:my-40 mb-10 h-8">
                    <Loading />
                </div>
                : <Box 
                    p={4}
                >
                    <div className="flex flex-row justify-between space-x-2 mb-4">
                            <div className="flex flex-col space-y-1">
                                <div className="text-sm p-2">Weekly Earning Breakdown</div>
                                <div className="font-semibold text-xl p-2">{chartData.earning && `$${chartData.earning.reduce((acc, curr) => acc + curr, 0)}`}</div>
                            </div>
                            <div className="place-content-center">
                                <Tooltip title={isSplit ? "Show normal" : "Show stacked"}>
                                    <button 
                                        className="border border-gray-400 rounded-full mx-4 hover:bg-gray-200 p-1"
                                        onClick={() => setIsSplit(!isSplit)}
                                        aria-label="Toggle Chart Type between Stacked and Normal Bar Chart"
                                    >
                                        {
                                            isSplit
                                            ? <BarChartIcon fontSize="large"/>
                                            : <StackedBarChartIcon fontSize="large"/>
                                        }
                                        
                                    </button>
                                </Tooltip>
                            </div>
                            
                        </div>
                    <Paper sx={{ width: "100%", height: 300}} elevation={3}>
                        {chartData && chartData.day && chartData.day.length > 0 ? (
                            <ResponsiveChartContainer
                                xAxis={[
                                    {
                                        data: chartData.day,
                                        scaleType: "band",
                                        id: "x-axis-id",
                                    },
                                ]}
                                {...chartSetting}
                            >
                                <ChartsTooltip />
                                <BarPlot />
                                <ChartsXAxis position="bottom" axisId="x-axis-id" />
                            </ResponsiveChartContainer>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                No data available
                            </div> 
                        )}
                    </Paper>

                </Box>
                
            }
        </>
    )
}