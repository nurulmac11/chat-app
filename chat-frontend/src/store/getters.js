export const isLoggedIn = state => {
    return !!state.accessToken
}

export const server = state => {
    return state.server
}

export const username = state => {
    return state.username
}

export const profile = state => {
    return state.profile
}

export const imgPath = state => {
    return state.server + '/users/avatar/' + state.profile.ppUrl
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

export const chattingWith = state => {
    return state.chattingWith
}

export const activeChatMessages = state => {
    return state.messages.filter((u) => {
        return u.from.username === state.chattingWith.username || u.to.username === state.profile.username || u.to.username === state.chattingWith.username
    })
}

export const userList = state => {
    return state.userList
}

export const randomUserList = state => {
    return state.randomUserList.filter((u) => {
        return u.username !== state.username
    })
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

export const screen = state => {
    return state.screen
}
