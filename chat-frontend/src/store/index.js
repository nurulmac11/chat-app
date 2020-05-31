import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
    username: '',
    email: '',
    accessToken: '',
    refreshToken: '',
    currentChatUsers: [],
    messages: [],
    message: '',
    msgNotify: [],
    userList: [],
    sendToUsername: '',
    socket: null
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
})
