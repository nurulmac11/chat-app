import * as api from '../api'
import * as io from 'socket.io-client'
import router from "../main.js"

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

export const logout = ({commit}) => {
    commit('logoutMutation');
}

export const reLoginAction = ({commit}, payload) => {
    return new Promise((resolve, reject) => {
        api.reLoginApi(payload).then(response => {
            commit('reLoginMutation', response);
            commit('setToken', payload);
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

export const addFavUser = ({commit}, payload) => {
    return new Promise((resolve, reject) => {
        api.addFavorite(payload.id).then(response => {
            commit('addFavorite', payload);
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export const removeFavUser = ({commit}, payload) => {
    return new Promise((resolve, reject) => {
        api.removeFavorite(payload.id).then(response => {
            commit('removeFavorite', payload);
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export const favorites = ({commit}) => {
    return new Promise((resolve, reject) => {
        api.getFavorites().then(response => {
            commit('setFavorites', response);
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export const blockUser = ({commit}, payload) => {
    return new Promise((resolve, reject) => {
        api.block(payload.id).then(response => {
            commit('addBlock', payload);
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export const removeBlock = ({commit}, payload) => {
    return new Promise((resolve, reject) => {
        api.removeBlock(payload.id).then(response => {
            commit('removeBlock', payload);
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export const blocks = ({commit}) => {
    return new Promise((resolve, reject) => {
        api.getBlocks().then(response => {
            commit('setBlocks', response);
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


export const newComingMessages = ({commit, state}) => {
    return new Promise((resolve, reject) => {
        api.getNewMessages().then(response => {
            response.data.forEach(msg => {
                const msgObject = {
                    from: {
                        username: msg.user_anonymousName
                    },
                    text: msg.message,
                    time: msg.created_at,
                    to: {
                        id: msg.message_receiverId
                    }
                }
                newMessage({commit, state, msg: msgObject});
            });
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

// new comming messages
export const newMessage = ({commit, state, msg}) => {
    commit('addChatUser', msg.from);
    commit('addMessage', msg);

    if (state.chattingWith.username === msg.from.username && router.currentRoute.name === 'chat') {
        return;
    }
    else {
        commit('addNotification', msg.from.username);
    }
}

export const initSocket = ({commit, state}) => {
    const socketOptions = {
        query: {token: state.accessToken}
    };
    let socket = io('http://localhost:81', socketOptions);

    // Instant private message receiver
    socket.on('chat', function (msg) {
        newMessage({commit, state, msg});
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
    let toId = undefined;
    if(Object.prototype.hasOwnProperty.call(state.chattingWith, 'id'))
        toId = state.chattingWith.id;
    else
        toId = state.chattingWith.username;

    const message = {
        text: state.message,
        to: {
            username: state.chattingWith.username,
            id: toId
        },
        from: {
            username: state.profile.username,
            id: state.profile.id,
            ppUrl: state.profile.ppUrl
        },
        time: currentTime()
    };

    commit('resetMessage');
    commit('addMessage', message)
    state.socket.emit('msgToServer', message)
    commit('addChatUser', state.chattingWith);
}
