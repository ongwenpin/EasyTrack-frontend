import axios from "axios";
import { apiConfig } from "./apiConfig";

const API_URL = apiConfig.apiUrl + "/api/expenses";

export async function getExpenses() {

    try {
        const response = await axios.get(API_URL, {withCredentials: true});
        return response;
    } catch (error) {
        throw error;
    }

}

export async function getExpense(id) {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {withCredentials: true});
        return response;
    } catch (error) {
        throw error;
    } 
}

export async function createExpense(formdata) {
    try {
        const response = await axios.post(API_URL, formdata, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response;
    } catch (error) {
        throw error;
    } 
}

export async function updateExpense(expenseId, formdata) {
    try {
        const response = await axios.patch(`${API_URL}/${expenseId}`, formdata, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response;
    } catch (error) {
        throw error;
    }

}

export async function deleteExpense(expenseId) {
    try {
        const response = await axios.delete(`${API_URL}/${expenseId}`, {withCredentials: true});
        return response;
    } catch (error) {
        throw error;
    }

}
