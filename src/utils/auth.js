import axios from "axios";


export async function authenicateUser() {
    try {
        const response = await axios.get("http://localhost:5050/api/auth/status", {withCredentials: true});
        if (response.status === 200) {
            return true;
        } 
    } catch (error) {
        //console.error(error);
        return false;
    }
}
