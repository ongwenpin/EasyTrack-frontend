import { useEffect, useState } from "react";
import Loading from "./Loading";
import Box from '@mui/material/Box';
import { ResponsiveChartContainer, PiePlot, ChartsXAxis, ChartsTooltip, PieChart } from "@mui/x-charts";
import { getDailyProfits } from "../utils/analytics";
import { Paper } from "@mui/material";

export function DailyProfitCard() {

    const [isLoading, setIsLoading] = useState(true);

    const [chartData, setChartData] = useState({});

    const [profit, setProfit] = useState(0);

    function handleChartData(data) {
        const result = [];
        // Data is an object
        Object.keys(data).forEach((key, index) => {
            if (key !== 'profit') {
                result.push({id:index,  value: data[key], label: key});
            }
        });
        console.log(result);
        return result;

    }

    useEffect(() => {
        setIsLoading(true);
        getDailyProfits().then((data) => {
            setChartData(handleChartData(data));
            setProfit(data.profit);
        }).catch((error) => {
            console.error(error);
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
                        <Paper sx={{ width: "100%", marginBottom: 2}} elevation={3}>
                            <div className="flex flex-col space-y-1">
                                <div className="text-sm p-2">Daily Profit</div>
                                <div className="font-semibold text-xl p-2">{profit}</div>
                            </div>
                        </Paper>
                        <Paper sx={{ width: "100%", height: 300, alignItems: "center", display: 'flex', justifyContent: 'center',}} elevation={3}>
                            <PieChart
                                series={[
                                    {
                                        data: chartData,
                                    }
                                ]}
                                width={400}
                                height={200}
                            />
                        </Paper>

                    </Box>
                </>
            }
        </>
        
    )
}