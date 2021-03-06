import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Vuex from 'vuex';
import VueRouter from 'vue-router'
import LoginPage from "./components/LoginPage";
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faCogs,
    faUsers,
    faComments,
    faLocationArrow,
    faPaperclip,
    faBirthdayCake,
    faVenusMars,
    faUser,
    faUserCircle,
    faPlus,
    faBan,
    faEllipsisV,
    faPhone,
    faVideo,
    faArrowLeft,
    faTrash,
    faSearch,
    faHeart,
    faFlag
} from '@fortawesome/free-solid-svg-icons'
import UserListPage from "./components/UserListPage";
import SettingsPage from "./components/SettingsPage";
import ChatPage from "./components/ChatPage";
import UserProfile from "./components/UserProfile";
import ResetPassword from "./components/ResetPassword";
import i18n from './i18n'

Vue.config.productionTip = false

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faCogs, faUsers, faComments, faLocationArrow, faPaperclip,
    faBirthdayCake, faVenusMars, faUser, faUserCircle, faPlus, faBan,
    faEllipsisV, faPhone, faVideo, faArrowLeft, faTrash, faSearch, faHeart, faFlag);

var filter = function (text, length, clamp) {
    clamp = clamp || '...';
    var node = document.createElement('div');
    node.innerHTML = text;
    var content = node.textContent;
    return content.length > length ? content.slice(0, length) + clamp : content;
};

Vue.filter('truncate', filter);

const routes = [
    {path: '/', component: LoginPage, name: 'login'},
    {path: '/users', component: UserListPage, name: 'users', props: {mode: 'users'}},
    {path: '/chat', component: ChatPage, name: 'chat'},
    {path: '/chat-list', component: UserListPage, name: 'chatUsers', props: {mode: 'chatUsers'}},
    {path: '/settings', component: SettingsPage, name: 'settings'},
    {path: '/profile', component: UserProfile, name: 'profile'},
    {path: '/reset-password/:key', component: ResetPassword, name: 'resetPassword', props: true},
]

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

new Vue({
    store,
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')

export default router;
