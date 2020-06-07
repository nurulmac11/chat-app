export default {
    loginMutation(state, response) {
        state.profile = response.data.profile;
        state.accessToken = response.data.tokens.accessToken;
    },

    setUsername(state, username) {
        state.username = username;
    },

    setProfile(state, response) {
        state.profile = response.data;
    },

    setRandomUserList(state, response) {
        state.randomUserList = response.data;
    },

    setProfileRaw(state, raw_data) {
        state.profile = raw_data;
    },

    setCurrentChat(state, profile) {
        state.chattingWith = profile;
    },

    setScreen(state, screen) {
        state.screen = screen;
    },

    setMessage(state, message) {
        state.message = message;
    },

    addMessage(state, message) {
        state.messages.push(message);
    },

    addChatUser(state, profile) {
        if (!state.currentChatUsers.some(e => e.id === profile.id)) {
            state.currentChatUsers.push(profile);
        }
    },

    addNotification(state, user) {
        if(!state.msgNotify.includes(user))
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
            item => item && item !== state.username,
        );
    },

    resetMessage(state) {
        state.message = ''
    }

}
