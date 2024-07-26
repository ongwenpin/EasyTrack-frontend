import { useEffect, useState } from "react";
import { ChartsGrid, LinePlot, LineHighlightPlot, MarkPlot, ChartsYAxis, ChartsXAxis, ResponsiveChartContainer, ChartsTooltip, ChartsAxisHighlight } from "@mui/x-charts";
import Box from '@mui/material/Box';
import { Paper } from "@mui/material";
import Loading from "./Loading";
import { getAccessToken } from "../api/authApi";
import { getAnnualProfits } from "../api/analyticsApi";

export function AnnualProfitCard() {
    const [isLoading, setIsLoading] = useState(true);

    const [chartData, setChartData] = useState({});

    const [chartDisplaySetting, setChartDisplaySetting] = useState({
        earning: true,
        expense: true,
        profit: true,
    });


    useEffect(() => {
        setIsLoading(true);
        getAnnualProfits().then((data) => {
            if (data) {
                setChartData(data);
            }
        }).catch((error) => {
            if (error.message === "Access token expired") {
                getAccessToken().then(() => {
                    return getAnnualProfits()
                }).then((data) => {
                    if (data) {
                        setChartData(data);
                    }
                });
            }
        }).finally(() => {
            setIsLoading(false);
        });
    },[]);

    function handleChartSeries() {
        const series = [
            {
                type: "line",
                data: chartData.earning,
                label: "Earning",
                curve: "linear",
                color: "#00FF00" // dark green
            },
            {
                type: "line",
                data: chartData.expense,
                label: "Expense",
                curve: "linear",
                color: "#FF0000" // red
            },
            {
                type: "line",
                data: chartData.profit,
                label: "Profit",
                curve: "linear",
                color: "#0000FF" // blue
            }
        ];

        return series.filter((s) => chartDisplaySetting[s.label.toLowerCase()]);
    }

    const chartSetting = {
        series: handleChartSeries(),
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
                        <div className="text-lg p-2">Annual Profit</div>
                        <div>
                            <form className="flex flex-row space-x-2">
                                <label className="p-2">
                                    <input 
                                        type="checkbox" 
                                        checked={chartDisplaySetting.earning} 
                                        onChange={() => setChartDisplaySetting(prev => ({...prev, earning: !prev.earning}))}
                                    />
                                    <span className="pl-2">Earning</span>
                                </label>
                                <label className="p-2">
                                    <input 
                                        type="checkbox" 
                                        checked={chartDisplaySetting.expense} 
                                        onChange={() => setChartDisplaySetting(prev => ({...prev, expense: !prev.expense}))}
                                    />
                                    <span className="pl-2">Expense</span>
                                </label>
                                <label className="p-2">
                                    <input 
                                        type="checkbox" 
                                        checked={chartDisplaySetting.profit} 
                                        onChange={() => setChartDisplaySetting(prev => ({...prev, profit: !prev.profit}))}
                                    />
                                    <span className="pl-2">Profit</span>
                                </label>
                            </form>
                        </div>
                        <div className="font-semibold text-xl p-2">${chartData.earning && chartData.earning.reduce((acc, curr) => acc + curr, 0)}</div>
                    </div>
                    <Paper sx={{ width: "100%", height: 300}} elevation={3}>
                        {chartData && chartData.month && chartData.month.length > 0 ? (
                            <ResponsiveChartContainer
                                xAxis={[
                                    {
                                        data: chartData.month,
                                        scaleType: "point",
                                        id: "x-axis-id",
                                    },
                                ]}
                                yAxis={[
                                    {
                                        id: "y-axis-id",
                                        data: chartData.earning
                                    },
                                ]}
                                {...chartSetting}
                                
                            >
                                <ChartsTooltip />
                                <ChartsGrid horizontal={true} vertical={false}/>
                                <LinePlot />
                                <MarkPlot />
                                <ChartsAxisHighlight x="line" />
                                <LineHighlightPlot />
                                <ChartsXAxis position="bottom" axisId="x-axis-id" />
                                <ChartsYAxis position="left" axisId="y-axis-id"/>
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