import * as api from '../api'
import * as io from 'socket.io-client'

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


export const initSocket = ({ commit }) => {
    let socket = io('http://localhost:81', {"query" : 'token=' + this.accessToken});

    // Instant private message receiver
    let vthis = this
    socket.on('chat', function (msg) {
        if (!(vthis.currentChatUsers.includes(msg.username)))
            commit('addChatUser', msg.username);

        commit('addMessage', msg);

        if(vthis.sendToUsername !== msg.from)
            vthis.msgNotify.push(msg.username)

    });
    socket.emit('loginMe', this.username);
    commit('saveSocket', socket);
}
