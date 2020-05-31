export default {
    loginMutation(state, response) {
        state.accessToken = response.data.tokens.accessToken;
    },

    setUsername(state, username) {
        state.username = username;
    },

    setSendTo(state, username) {
        state.sendToUsername = username;
    },

    setMessage(state, message) {
        state.message = message;
    },

    addMessage(state, message) {
        state.messages.push(message);
    },

    addChatUser(state, username) {
        if (!(state.currentChatUsers.includes(username)))
            state.currentChatUsers.push(username);
    },

    addNotification(state, user) {
        state.msgNotify.push(user);
    },

    clearNotification(state, username) {
        state.msgNotify.splice(state.msgNotify.indexOf(username), 1);
    },

    saveSocket(state, socket) {
        state.socket = socket;
    },

    updateUserList(state, userList) {
        state.userList = userList.filter(
            item => item !== state.username,
        );
    },

    resetMessage(state) {
        state.message = ''
    }

}
