import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Vuex from 'vuex';
import VueRouter from 'vue-router'
import LoginPage from "./components/LoginPage";
import ChatApp from "./components/ChatApp";

Vue.config.productionTip = false

Vue.use(Vuex);
Vue.use(VueRouter);

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
