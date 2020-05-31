import * as api from '../api'
import * as io from 'socket.io-client'
import md5 from "md5";
import Axios from "axios";
import Swal from "sweetalert2";

export const loginAction = ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
        api.loginApi(payload).then(response => {
            commit('loginMutation', response);
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}


export const initSocket = ({ commit, state }) => {
    let socket = io('http://localhost:81', {"query" : 'token=' + state.accessToken});

    // Instant private message receiver
    socket.on('chat', function (msg) {
        if (!(state.currentChatUsers.includes(msg.username)))
            commit('addChatUser', msg.username);

        commit('addMessage', msg);

        if(state.sendToUsername !== msg.from)
            commit('addNotification', msg.username);

    });
    socket.emit('loginMe', state.username);
    commit('saveSocket', socket);
}

export const getUsers = ({commit, state}) => {
    // Get user list
    state.socket.on('activeUsers', userList => {
        commit('updateUserList', userList);
    });
}
export const registerMe = () => {
    let userData = {
        'username': this.username,
        'password': md5(this.password),
        'email': this.email
    }
    Axios.post(this.baseUrl + '/users/create', userData)
        .then(function (response) {
            Swal.fire('Successful', 'Your account created.', 'success')
            this.currentForm = 1;
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}


export const sendMessage = ({commit, state}) => {
    const message = {
        username: state.username,
        text: state.message,
        to: state.sendToUsername,
        from: state.username,
    };
    commit('resetMessage');
    commit('addMessage', message)
    state.socket.emit('msgToServer', message)
    if (!(state.currentChatUsers.includes(state.sendToUsername)))
        commit('addChatUser', state.sendToUsername)
}
