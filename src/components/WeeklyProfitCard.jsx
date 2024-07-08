import { BarPlot, ChartsXAxis, ResponsiveChartContainer, ChartsTooltip } from "@mui/x-charts";
import { getWeeklyProfits } from "../utils/analytics";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Box from '@mui/material/Box';
import { Paper } from "@mui/material";
import BarChartIcon from '@mui/icons-material/BarChart';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';

export function WeeklyProfitCard() {

    const [isLoading, setIsLoading] = useState(true);

    const [chartData, setChartData] = useState({});

    const [isSplit, setIsSplit] = useState(false)

    useEffect(() => {
        setIsLoading(true);
        getWeeklyProfits().then((data) => {
            setChartData(data);

        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    function extractProfitBreakdown(data) {

        const profitBreakdown = []
        // get all keys but profit and day from an object
        const keys = Object.keys(data).filter((key) => key !== 'profit' && key !== 'day');

        keys.forEach((key) => {
            profitBreakdown.push({type: "bar", data: data[key], label: key, stack: "total"});
        });

        return profitBreakdown;
    }

    const chartSetting = {
        series: isSplit ? extractProfitBreakdown(chartData) : [
            {
                type: "bar",
                data: chartData.profit,
                label: "Profit",
            },
        ],

    }

    return (
        <>
            {isLoading 
                ? <Loading />
                : <Box 
                    p={4}
                >
                    <Paper sx={{ width: "100%", marginBottom: 2}} elevation={3}>
                        <div className="flex flex-row justify-between space-x-2">
                            <div className="flex flex-col space-y-1">
                                <div className="text-sm p-2">Weekly Profit</div>
                                <div className="font-semibold text-xl p-2">{chartData.profit.reduce((acc, curr) => acc + curr, 0)}</div>
                            </div>
                            <div className="place-content-center">
                                <button 
                                    className="border border-gray-400 rounded-full mx-4"
                                    onClick={() => setIsSplit(!isSplit)}
                                >
                                    {
                                        isSplit
                                        ? <StackedBarChartIcon fontSize="large"/>
                                        : <BarChartIcon fontSize="large"/>
                                    }
                                    
                                </button>
                            </div>
                            
                        </div>
                    </Paper>
                    <Paper sx={{ width: "100%", height: 300}} elevation={3}>
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
                    </Paper>

                </Box>
                
            }
        </>
    )
}