import Axios from "axios"
import store from '../store/index'

const baseURL = 'http://localhost:3000';
// const baseURL = store.getters.server;

export function auth() {
    return {headers: {'Authorization': 'Bearer ' + store.getters.accessToken}};
}

export function loginApi(userData) {
    return Axios.post(baseURL + '/users/login', userData)
}

export function reLoginApi(token) {
    return Axios.get(baseURL + '/users/re-login', {headers: {'Authorization': 'Bearer ' + token}})
}

export function registerApi(userData) {
    return Axios.post(baseURL + '/users/create', userData);
}

export function userList() {
    return Axios.get(baseURL + '/users/random', auth());
}

export function getNewMessages() {
    return Axios.get(baseURL + '/messages/news', auth());
}

export function updateBio(bio) {
    const data = {
        'bio': bio
    }
    return Axios.post(baseURL + '/users/update-bio', data, auth())
}
