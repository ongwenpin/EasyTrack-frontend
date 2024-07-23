import { useEffect, useState } from "react";
import Loading from "./Loading";
import Box from '@mui/material/Box';
import { ResponsiveChartContainer, PiePlot, ChartsXAxis, ChartsTooltip, PieChart } from "@mui/x-charts";
import { getDailyEarnings } from "../utils/analytics";
import { Paper } from "@mui/material";
import { getAccessToken } from "../utils/auth";

export function DailyEarningCard() {

    const [isLoading, setIsLoading] = useState(true);

    const [chartData, setChartData] = useState({});

    const [earning, setEarning] = useState(0);

    function handleChartData(data) {
        const result = [];
        // Data is an object
        Object.keys(data).forEach((key, index) => {
            if (key !== 'earning') {
                result.push({id:index,  value: data[key], label: key});
            }
        });
        return result;

    }

    useEffect(() => {
        setIsLoading(true);
        const date = new Date();
        getDailyEarnings(date).then((data) => {
            if (data) {
                setChartData(handleChartData(data));
                setEarning(data.earning);
            }
        }).catch((error) => {
            if (error.message === "Access token expired") {
                getAccessToken().then(() => {
                    return getDailyEarnings()
                }).then((data) => {
                    if (data) {
                        setChartData(handleChartData(data));
                        setEarning(data.earning);
                    }
                });
            }
        }).finally(() => {
            setIsLoading(false);
        });
    } , []);

    return (
        <>
            {   
                isLoading
                ? <Loading />
                : <>
                    <Box p={4}>
                    <div className="flex flex-col space-y-1 mb-4">
                                <div className="text-sm p-2">Daily Earning Breakdown</div>
                                <div className="font-semibold text-xl p-2">{`$${earning}`}</div>
                            </div>
                        <Paper sx={{ width: "100%", height: 300, alignItems: "center", display: 'flex', justifyContent: 'center',}} elevation={3}>
                            {chartData && chartData.length > 0 ? (
                            <PieChart
                                series={[
                                    {
                                        data: chartData,
                                    }
                                ]}
                                width={400}
                                height={200}
                            />
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }} >No data available</div> 
                            )}
                        </Paper>

                    </Box>
                </>
            }
        </>
        
    )
}