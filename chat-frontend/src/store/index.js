import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
    username: '',
    email: '',
    profile: {},
    randomUserList: [],
    accessToken: '',
    refreshToken: '',
    currentChatUsers: [],
    messages: [],
    message: '',
    msgNotify: [],
    userList: [],
    chattingWith: {},
    socket: null,
    viewProfile: {},
    favorites: [],
    blocks: [],
    screen: 'userList',
    server: 'http://localhost:3000',
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
})
