import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Vuex from 'vuex';
import VueRouter from 'vue-router'
import LoginPage from "./components/LoginPage";
import ChatApp from "./components/Main";
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
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons'

Vue.config.productionTip = false

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faCogs, faUsers, faComments, faLocationArrow, faPaperclip,
    faBirthdayCake, faVenusMars, faUser, faUserCircle, faPlus, faBan, faEllipsisV, faPhone, faVideo, faArrowLeft);

var filter = function(text, length, clamp){
    clamp = clamp || '...';
    var node = document.createElement('div');
    node.innerHTML = text;
    var content = node.textContent;
    return content.length > length ? content.slice(0, length) + clamp : content;
};

Vue.filter('truncate', filter);

const routes = [
    {path: '/', component: LoginPage, name: 'login'},
    {path: '/chat', component: ChatApp, name: 'chat'}
]

const router = new VueRouter({
    routes // short for `routes: routes`
})

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')
