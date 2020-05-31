export const threads = state => state.threads

export const isLoggedIn = state => {
    return !!state.accessToken
}

export const username = state => {
    return state.username
}


export const sendToUsername = state => {
    return state.sendToUsername
}

export const socket = state => {
    return state.socket
}

export const accessToken = state => {
    return state.accessToken
}

export const messages = state => {
    return state.messages
}

export const userList = state => {
    return state.userList
}

export const currentChatUsers = state => {
    return state.currentChatUsers
}

export const message = state => {
    return state.message
}

export const msgNotify = state => {
    return state.msgNotify
}
