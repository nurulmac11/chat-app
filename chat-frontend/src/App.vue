<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="#" @click.prevent="home()">Chatt</a>
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


                    <router-view></router-view>


                    <ul class="nav nav-pills nav-fill fixed-bottom" v-if="screen() !== 'chat'">
                        <li class="nav-item">
                            <a class="nav-link" :class="{ active: screen() === 'chatUsers' }" href="#"
                               @click.prevent="goTo('chatUsers')">
                                <font-awesome-icon icon="comments"/>
                                <span style="color: red" v-if="msgNotify.length">{{ msgNotify.length }}</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" :class="{ active: screen() === 'users' }" href="#"
                               @click.prevent="goTo('users')">
                                <font-awesome-icon icon="users"/>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" :class="{ active: screen() === 'settings' }" href="#"
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

    export default {
        name: 'App',
        components: {},
        data: () => {
            return {
            }
        },
        computed: {
            ...mapGetters(['accessToken', 'username', 'socket', 'messages',
                'randomUserList', 'currentChatUsers', 'msgNotify']),
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
            home() {
                this.$router.replace({name: 'users'});
            },
            goTo(screen) {
                this.$router.replace({name: screen});
            },
            screen() {
                return this.$router.currentRoute.name;
            }
        }
    };
</script>

<style>
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

    .container {
        height: 100%;
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
</style>
