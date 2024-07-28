import axios from "axios";
import { apiConfig } from "../api/apiConfig";

const API_URL = apiConfig.apiUrl + "/api/analytics";

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
        const response = await axios.get(`${API_URL}/dailyearning/${date}`, {withCredentials: true});
        return response.data;

    } catch (error) {
        if (error.response.status == 401 && error.response.data === "Access token expired") {
            throw new Error("Access token expired");
            
        }
        throw error;
    }
    
}

export async function getWeeklyEarnings(date) {

    try {
        const response = await axios.get(`${API_URL}/weeklyearning/${date}`, {withCredentials: true});
        const data = response.data;
        return extractFields(data);
        

    } catch (error) {
        if (error.response.status == 401 && error.response.data === "Access token expired") {
            throw new Error("Access token expired");
            
        }
        throw error;
    }

}

export async function getMonthlyProfits(month, year) {
    try {
        const response = await axios.get(`${API_URL}/monthlyprofit/?month=${month}&year=${year}`, {withCredentials: true});
        return response.data;

    } catch (error) {
        throw error;
    }
    
}

export async function getAnnualProfits() {

    try {
        const response = await axios.get(`${API_URL}/annualprofit`, {withCredentials: true});
        const data = response.data;
        return extractFields(data);

    } catch (error) {
        if (error.response.status == 401 && error.response.data === "Access token expired") {
            throw new Error("Access token expired");
            
        }
        throw error;
    }

}