import axios from "axios";


export async function authenicateUser() {
    try {
        const response = await axios.get("http://localhost:5050/api/auth/status", {withCredentials: true});
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
        const response = await axios.get("http://localhost:5050/api/auth/access", {withCredentials: true});
        return response;
    } catch (error) {
        console.error(error);
    }
}
