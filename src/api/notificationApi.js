import axios from "axios";
import { apiConfig } from "./apiConfig";

const API_URL = apiConfig.apiUrl + "/api/notification";

export async function getUserNotifications(username) {
    try {
        const response = await axios.get(`${API_URL}/${username}`, {withCredentials: true});
        return response;
    } catch (error) {
        console.error(error.response.data);
    }
}

export async function markNotificationAsRead(notification) {
    try {
        const response = await axios.patch(`${API_URL}/${notification._id}`, {isRead: true}, {withCredentials: true});
        return response;
    } catch (error) {
        console.error(error.response.data);
    }
}

export async function clearUserNotifications(username) {
    try {
        const response = await axios.delete(`${API_URL}/${username}`, {withCredentials: true});
    } catch (error) {
        console.error(error.response.data);
    }
}
