import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Vuex from 'vuex';
import VueRouter from 'vue-router'
import LoginPage from "./components/LoginPage";
import ChatApp from "./components/Main";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCogs, faUsers, faComments, faLocationArrow, faPaperclip } from '@fortawesome/free-solid-svg-icons'

Vue.config.productionTip = false

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faCogs);
library.add(faUsers);
library.add(faComments);
library.add(faLocationArrow);
library.add(faPaperclip);

const routes = [
  { path: '/', component: LoginPage, name: 'login' },
  { path: '/chat', component: ChatApp, name: 'chat' }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
