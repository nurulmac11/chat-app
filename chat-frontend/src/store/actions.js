import * as api from '../api'
import * as io from 'socket.io-client'

export const loginAction = ({commit}, payload) => {
    return new Promise((resolve, reject) => {
        api.loginApi(payload).then(response => {
            commit('loginMutation', response);
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export const updateBio = ({commit}, payload) => {
    return new Promise((resolve, reject) => {
        api.updateBio(payload).then(response => {
            commit('setProfile', response);
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export const randomUsers = ({commit}) => {
    return new Promise((resolve, reject) => {
        api.userList().then(response => {
            commit('setRandomUserList', response);
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export const initSocket = ({commit, state}) => {
    let socket = io('http://localhost:81', {"query": 'token=' + state.accessToken});

    // Instant private message receiver
    socket.on('chat', function (msg) {
        if (!(state.currentChatUsers.includes(msg.from)))
            commit('addChatUser', msg.from);
        commit('addMessage', msg);

        if (state.chattingWith.username !== msg.from.username || state.screen !== 'chat')
            commit('addNotification', msg.from.username);

    });
    socket.emit('loginMe', state.username);
    commit('saveSocket', socket);
}

export const registerMe = ({dispatch}, payload) => {
    return new Promise((resolve, reject) => {
        api.registerApi(payload).then(response => {
            let loginPayload = {
                'username': payload.username,
                'password': payload.password
            }
            dispatch('loginAction', loginPayload);
            resolve(response)
        }).catch(error => {
            reject(error);
        })
    })

}

const currentTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}

export const sendMessage = ({commit, state}) => {
    const message = {
        text: state.message,
        to: state.chattingWith,
        from: state.profile,
        time: currentTime()
    };
    commit('resetMessage');
    commit('addMessage', message)
    state.socket.emit('msgToServer', message)
    if (!(state.currentChatUsers.includes(state.chattingWith)))
        commit('addChatUser', state.chattingWith)
}
