import axios from "axios";

export function extractFields(data) {
    const result = {};
    data.forEach(item => {
        Object.keys(item).forEach(key => {
            if (!result[key]) {
              result[key] = [];
            }
            result[key].push(item[key]);
        });

    });
    return result;
}

export async function getDailyProfits() {
    
    try {
        const response = await axios.get("http://localhost:5050/api/analytics/dailyprofit", {withCredentials: true});
        return response.data;

    } catch (error) {
        console.error(error);
    }
    
}

export async function getWeeklyProfits() {

    try {
        const response = await axios.get("http://localhost:5050/api/analytics/weeklyprofit", {withCredentials: true});
        const data = response.data;
        return extractFields(data);
        

    } catch (error) {
        console.error(error);
    }

}



export async function getMonthlyProfits() {
    
        try {
            const response = await axios.get("http://localhost:5050/api/analytics/monthlyprofit", {withCredentials: true});
            return response.data;
    
        } catch (error) {
            console.error(error);
        }
    
}

export async function getAnnualProfits() {

    try {
        const response = await axios.get("http://localhost:5050/api/analytics/annualprofit", {withCredentials: true});
        return response.data;

    } catch (error) {
        console.error(error);
    }

}