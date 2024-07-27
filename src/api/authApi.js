import axios from "axios";
import { apiConfig } from "../api/apiConfig";

const API_URL = apiConfig.apiUrl + "/api/auth";

export async function authenicateUser() {
    try {
        const response = await axios.get(`${API_URL}/status`, { withCredentials: true });
        if (response.status === 200) {
            return true;
        } 
        return false;
    } catch (error) {
        return false;
    }
}

export async function getAccessToken() {
    try {
        const response = await axios.get(`${API_URL}/access`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error(error);
    }
}
