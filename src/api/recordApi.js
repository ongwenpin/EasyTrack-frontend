import axios from "axios";

const API_URL = "http://localhost:5050/api/records";

export async function getRecords() {

    try {
        const response = await axios.get(API_URL, {withCredentials: true});
        return response;
    } catch (error) {
        throw error;
    }

}

export async function getRecord(id) {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {withCredentials: true});
        return response;
    } catch (error) {
        throw error;
    }
}

export async function createRecord(record) {
    try {
        const response = await axios.post(API_URL, record, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function updateRecord(id, record) {  
    try {
        const response = await axios.patch(`${API_URL}/${id}`, record,  {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function deleteRecord(id) {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {withCredentials: true});
        return response;
    } catch {
        throw error;
    }
}
