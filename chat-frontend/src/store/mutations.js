export default {
    loginMutation(state, response) {
        state.accessToken = response.data.tokens.accessToken;
    },

    setUsername(state, username) {
        state.username = username;
    },

    addMessage(state, message) {
        state.messages.push(message);
    },

    addChatUser(state, user) {
        state.curentChatUsers.push(user);
    },

    addNotification(state, user) {
        state.notifications.push(user);
    },

    saveSocket(state, socket) {
        state.socket = socket;
    }

}
