import Axios from "axios"
import store from '../store/index'

const baseURL = "http://localhost:3000"

export function loginApi (userData) {
    return Axios.post(baseURL + '/users/login', userData)
}

export function registerApi (userData) {
    return Axios.post(baseURL + '/users/create', userData);
}

export function updateBio (userData) {
    return Axios.post(baseURL + '/users/update-bio', userData, {headers: { 'Authorization' : 'Bearer '+ store.getters.accessToken}})
}
