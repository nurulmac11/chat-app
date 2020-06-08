export default {
    loginMutation(state, response) {
        state.profile = response.data.profile;
        state.accessToken = response.data.tokens.accessToken;
        localStorage.accessToken = state.accessToken;
    },

    reLoginMutation(state, response, token) {
        state.profile = response.data;
        state.accessToken = token;
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

    initializeFromLocalStorage(state) {
        if(localStorage.currentChatUsers)
            state.currentChatUsers = JSON.parse(localStorage.currentChatUsers)
        if(localStorage.messages)
            state.messages = JSON.parse(localStorage.messages);
        if(localStorage.msgNotify)
            state.msgNotify = JSON.parse(localStorage.msgNotify);
    },

    addMessage(state, message) {
        state.messages.push(message);
        localStorage.messages = JSON.stringify(state.messages);
    },

    addChatUser(state, profile) {
        const checkNewUser = state.currentChatUsers.some(item => item.username === profile.username);
        if (!checkNewUser) {
            state.currentChatUsers.push(profile);
            localStorage.currentChatUsers = JSON.stringify(state.currentChatUsers);
        }
    },

    addNotification(state, user) {
        if(!state.msgNotify.includes(user)) {
            state.msgNotify.push(user);
            localStorage.msgNotify = JSON.stringify(state.msgNotify);
        }
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
