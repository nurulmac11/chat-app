<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="#" @click.prevent="goTo('users')">Chatt</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                </ul>
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link text-warning" href="#" tabindex="-1" @click.prevent="logout()"
                           v-if="accessToken">Logout</a>
                    </li>
                </ul>
            </div>
        </nav>

        <div class="container-fluid h-100">
            <div class="row justify-content-center h-100">
                <div class="col-md-12 col-xl-9 chat">

                    <transition name="slide-fade" mode="out-in">
                    <router-view></router-view>
                    </transition>


                    <ul class="nav nav-pills nav-fill fixed-bottom" v-if="screen() !== 'chat' && screen() !== 'login'">
                        <li class="nav-item">
                            <a class="nav-link dark-nav" :class="{ active: screen() === 'chatUsers' }" href="#"
                               @click.prevent="goTo('chatUsers')">
                                <font-awesome-icon icon="comments"/>
                                <span style="color: red" v-if="msgNotify.length">{{ msgNotify.length }}</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link dark-nav" :class="{ active: screen() === 'users' }" href="#"
                               @click.prevent="goTo('users')">
                                <font-awesome-icon icon="users"/>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link dark-nav" :class="{ active: screen() === 'settings' }" href="#"
                               @click.prevent="goTo('settings')">
                                <font-awesome-icon icon="user"/>
                            </a>
                        </li>
                    </ul>

                </div>
            </div>
        </div>


    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import Swal from "sweetalert2";
    import * as api from "./api";

    export default {
        name: 'App',
        components: {},
        data: () => {
            return {
                interval: undefined
            }
        },
        computed: {
            ...mapGetters(['accessToken', 'username', 'socket', 'messages',
                'randomUserList', 'currentChatUsers', 'msgNotify']),
        },
        created() {
            this.interval = setInterval(api.updateLastOnline, 1000*60) // 60 sn
        },
        destroyed() {
            clearInterval(this.interval);
        },
        mounted() {
            if (localStorage.accessToken) {
                this.$store.dispatch('reLoginAction', localStorage.accessToken).then(() => {
                    this.$store.dispatch('initSocket');
                    this.$store.dispatch('randomUsers');
                    this.$store.dispatch('newComingMessages');
                    this.$store.dispatch('favorites');
                    this.$store.dispatch('blocks');
                    this.$router.replace({name: 'users'});
                    this.socket.on('exception', function (msg) {
                        Swal.fire('Fail', msg, 'error');
                    });
                }).catch(error => {
                    localStorage.accessToken = '';
                    this.$router.replace({name: 'login'});
                    console.log(error);
                });
            } else if (!this.accessToken)
                this.$router.replace({name: 'login'});
        },
        methods: {
            logout() {
                this.$store.dispatch('logout');
                this.$router.replace({name: 'login'});
            },
            goTo(screen) {
                this.$router.push({name: screen});
            },
            screen() {
                return this.$router.currentRoute.name;
            }
        }
    };
</script>

<style>
    /* Enter and leave animations can use different */
    /* durations and timing functions.              */
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }
    .dark-nav {
        color: #626262;
        background: rgba(0, 0, 0, 0.53) !important;
    }
    .dark-nav.active {
        color: #ffc107 !important;
    }

    .dark-nav:hover {
        color: #d2d2d2 !important;
    }

    .chat {
        margin-top: 50px;
    }
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .bg-dark {
        background-color: #0000008a !important;
    }

    html, body {
        height: 100%;
        margin: 0px;
        padding: 0px;
    }

    body {
        background: url("./assets/backgrounds/c2.jpg") no-repeat center center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        color: white;
    }

    #app {
        background-color: rgba(0, 0, 0, 0.2);
        height: 100%;
        padding-top: 50px;
        padding-bottom: 50px
    }

    .user_img {
        height: 70px;
        width: 70px;
    }

    .blue_border {
        border: 1.5px solid #00bbff;
    }

    .pink_border {
        border: 1.5px solid #ff00c3;
    }

    .rainbow_border {
        box-shadow:
        0 0 0 1px #3300ff,
        0 0 0 2px #0004ff,
        0 0 0 3px #4cff00,
        0 0 0 4px #ffd900,
        0 0 0 5px #ff7b00,
        0 0 0 6px #ff0000;

    }

</style>
