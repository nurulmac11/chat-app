export default {
    loginMutation(state, response) {
        state.profile = response.data.profile;
        state.accessToken = response.data.tokens.accessToken;
        localStorage.accessToken = state.accessToken;
    },

    logoutMutation(state) {
      localStorage.accessToken = '';
      state.username = '';
      state.email = '';
      state.profile = {};
      state.randomUserList = [];
      state.accessToken = '';
      state.refreshToken = '';
      state.currentChatUsers = [];
      state.messages = [];
      state.message = '';
      state.msgNotify = [];
      state.userList = [];
      state.chattingWith = {};
      state.socket = null;
    },

    reLoginMutation(state, response) {
        state.profile = response.data;
        state.username = state.profile.username;
    },

    setViewProfile(state, profile) {
        state.viewProfile = profile;
    },

    setToken(state, token) {
        state.accessToken = token;
    },

    setUsername(state, username) {
        state.username = username;
    },

    setProfile(state, response) {
        state.profile = response.data;
    },

    addFavorite(state, fav) {
        state.favorites.push(fav);
    },

    setFavorites(state, response) {
        state.favorites = response.data;
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
        const checkNewUser = state.currentChatUsers.some(item => item.username === profile.username);
        if (!checkNewUser) {
            state.currentChatUsers.push(profile);
        }
    },

    removeChat(state, profile) {
        const removed = state.currentChatUsers.filter((u) => {
            return u.username !== profile.username
        })
        state.currentChatUsers = removed;
        const removedMessages = state.messages.filter((u) => {
            return u.from.username !== profile.username && u.to.username !== profile.username
        })
        state.messages = removedMessages;
    },

    addNotification(state, user) {
        if(!state.msgNotify.includes(user)) {
            state.msgNotify.push(user);
        }
    },

    clearNotification(state, username) {
        state.msgNotify.splice(state.msgNotify.indexOf(username), 1);
    },

    saveSocket(state, socket) {
        state.socket = socket;
    },

    resetMessage(state) {
        state.message = ''
    }

}
