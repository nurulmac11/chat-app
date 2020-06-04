import Axios from "axios"
import store from '../store/index'

const baseURL = "http://192.168.0.12:3000"

export function loginApi(userData) {
    return Axios.post(baseURL + '/users/login', userData)
}

export function registerApi(userData) {
    return Axios.post(baseURL + '/users/create', userData);
}

export function updateBio(bio) {
    const data = {
        'bio': bio
    }
    return Axios.post(baseURL + '/users/update-bio', data, {headers: {'Authorization': 'Bearer ' + store.getters.accessToken}})
}
