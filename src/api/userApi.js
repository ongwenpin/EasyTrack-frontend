import axios from "axios";


const API_URL = "http://localhost:5050/api/users";

export async function getUser(username) {
    
    try {
        const response = await axios.get(`${API_URL}/${username}`, {withCredentials: true});
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getUsers() {
    try {
        const response = await axios.get(API_URL, {withCredentials: true});
        return response;
    } catch (error) {
        throw error;
    }
}

export async function createUser(user) {
    try {
        const response = await axios.post(API_URL, user, {withCredentials: true});
        return response;
    } catch (error) {
        throw error;
    }
}

export async function updateUser(username, user) {
    try {
        const response = await axios.patch(`${API_URL}/${username}`, user, {withCredentials: true});
        return response;
    } catch (error) {
        throw error;
    }
}

export async function deleteUser(username) {
    try {
        const response = await axios.delete(`${API_URL}/${username}`, {withCredentials: true});
        return response;
    } catch (error) {
        throw error;
    }
}
