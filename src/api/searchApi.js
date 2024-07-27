import axios from "axios";
import { apiConfig } from "../api/apiConfig";

const API_URL = apiConfig.apiUrl + "/api/search";

export async function getQuery(query) {
    try {
        const response = await axios.get(`${API_URL}/?query=${query}`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error(error.response.data);
    }
}
