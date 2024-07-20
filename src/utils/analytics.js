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

export async function getDailyEarnings() {
    
    try {
        const response = await axios.get("http://localhost:5050/api/analytics/dailyearning", {withCredentials: true});
        return response.data;

    } catch (error) {
        if (error.response.status == 401 && error.response.data === "Access token expired") {
            throw new Error("Access token expired");
            
        }
        console.error(error);
    }
    
}

export async function getWeeklyEarnings() {
    try {
        const response = await axios.get("http://localhost:5050/api/analytics/weeklyearning", {withCredentials: true});
        const data = response.data;
        return extractFields(data);
        

    } catch (error) {
        if (error.response.status == 401 && error.response.data === "Access token expired") {
            throw new Error("Access token expired");
            
        }
        console.error(error);
    }

}

// export async function getMonthlyProfits() {
    
//         try {
//             const response = await axios.get("http://localhost:5050/api/analytics/monthlyprofit", {withCredentials: true});
//             return response.data;
    
//         } catch (error) {
//             console.error(error);
//         }
    
// }

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