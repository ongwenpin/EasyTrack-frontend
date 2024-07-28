import axios from "axios";
import { apiConfig } from "./apiConfig";

const API_URL = apiConfig.apiUrl + "/api/branches";

export async function getBranches() {
    try {
        const response = await axios.get(API_URL, { withCredentials: true });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function createBranch(branch) {
    try {
        const response = await axios.post(API_URL, branch, { withCredentials: true });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function removeBranch(branch) {
    try {
        const response = await axios.delete(`${API_URL}/${branch}`, { withCredentials: true });
        return response;
    } catch (error) {
        throw error;
    }
}
