import axios from 'axios';
import md5 from "md5";

const baseURL = 'http://localhost:3000';

export default {
    // called when the user attempts to log in
    login: async ({username, password}) => {
        let userData = {
            'username': username,
            'password': md5(password)
        }
        return await axios.post(baseURL + '/users/login', userData).then(response => {
            localStorage.setItem('username', response.data.profile.username);
            localStorage.setItem('accessToken', response.data.tokens.accessToken);
            return Promise.resolve();
        }).catch(error => {
            return Promise.reject(error.response.data.message);
        })
    },

    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
        return Promise.resolve();
    },

    // called when the API returns an error
    checkError: ({ result }) => {
        return Promise.reject(result);
    },

    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem('accessToken')
            ? Promise.resolve()
            : Promise.reject();
    },

    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
};
