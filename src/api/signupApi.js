import axios from "axios";
import { apiConfig } from "../api/apiConfig";

const API_URL = apiConfig.apiUrl + "/api/signup";

export async function signupUser(user) {
    try {
        const response = await axios.post(`${API_URL}`, user);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function checkUsername(username) {
    try {
        const response = await axios.get(`${API_URL}/${username}`);
        return response;
    } catch (error) {
        throw error;
    }
}
