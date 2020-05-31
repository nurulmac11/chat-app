import Axios from "axios";

const baseURL = "http://localhost:3000"

export function loginApi (userData) {
    return Axios.post(baseURL + '/users/login', userData)
}

export function registerApi (userData) {
    return Axios.post(baseURL + '/users/create', userData);
}
