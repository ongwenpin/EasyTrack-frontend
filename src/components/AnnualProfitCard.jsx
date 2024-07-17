import { useEffect, useState } from "react";
import { ChartsGrid, LinePlot, LineHighlightPlot, MarkPlot, ChartsYAxis, ChartsXAxis, ResponsiveChartContainer, ChartsTooltip, ChartsAxisHighlight } from "@mui/x-charts";
import Box from '@mui/material/Box';
import { Paper } from "@mui/material";
import Loading from "./Loading";
import { getAccessToken } from "../utils/auth";
import { getAnnualProfits } from "../utils/analytics";

export function AnnualProfitCard() {
    const [isLoading, setIsLoading] = useState(true);

    const [chartData, setChartData] = useState({});


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

    const chartSetting = {
        series: [
            {
                type: "line",
                data: chartData.profit,
                label: "Profit",
                curve: "linear",
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
                    <div className="flex flex-row justify-between space-x-2 mb-4">
                        <div className="text-lg p-2">Annual Profit</div>
                        <div className="font-semibold text-xl p-2">{chartData.profit && chartData.profit.reduce((acc, curr) => acc + curr, 0)}</div>
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
                                        data: chartData.profit
                                    },
                                ]}
                                {...chartSetting}
                                
                            >
                                <ChartsTooltip />
                                <ChartsGrid horizontal={true} vertical={true}/>
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