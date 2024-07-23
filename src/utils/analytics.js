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

export async function getDailyEarnings(date) {
    
    try {
        const response = await axios.get(`http://localhost:5050/api/analytics/dailyearning/${date}`, {withCredentials: true});
        return response.data;

    } catch (error) {
        if (error.response.status == 401 && error.response.data === "Access token expired") {
            throw new Error("Access token expired");
            
        }
        console.error(error);
    }
    
}

export async function getWeeklyEarnings(date) {

    try {
        const response = await axios.get(`http://localhost:5050/api/analytics/weeklyearning/${date}`, {withCredentials: true});
        const data = response.data;
        return extractFields(data);
        

    } catch (error) {
        if (error.response.status == 401 && error.response.data === "Access token expired") {
            throw new Error("Access token expired");
            
        }
        console.error(error);
    }

}

export async function getMonthlyProfits(month, year) {
        console.log(month, year);
        try {
            const response = await axios.get(`http://localhost:5050/api/analytics/monthlyprofit/?month=${month}&year=${year}`, {withCredentials: true});
            return response.data;
    
        } catch (error) {
            console.error(error);
        }
    
}

export async function getAnnualProfits() {

    try {
        const response = await axios.get("http://localhost:5050/api/analytics/annualprofit", {withCredentials: true});
        const data = response.data;
        return extractFields(data);

    } catch (error) {
        if (error.response.status == 401 && error.response.data === "Access token expired") {
            throw new Error("Access token expired");
            
        }
        console.error(error);
    }

}