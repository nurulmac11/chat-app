<template>
    <div id="inner-app">
        <div v-if="screen === 'chatList'">
            <UserListPage :userList="currentChatUsers"/>
        </div>


        <div v-if="screen === 'chat'">
            <ChatPage/>
        </div>


        <div v-if="screen === 'userList'">
            <UserListPage :userList="userList"/>
        </div>

        <div v-if="screen === 'settings'">
            <SettingsPage />
        </div>

        <ul class="nav nav-pills nav-fill fixed-bottom">
            <li class="nav-item">
                <a class="nav-link" :class="{ active: screen === 'chatList' }" href="#"
                   @click.prevent="screen = 'chatList'"><font-awesome-icon icon="comments" /></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" :class="{ active: screen === 'userList' }" href="#"
                   @click.prevent="screen = 'userList'"><font-awesome-icon icon="users" /></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" :class="{ active: screen === 'settings' }" href="#"
                   @click.prevent="screen = 'settings'"><font-awesome-icon icon="user" /> </a>
            </li>
        </ul>

    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import ChatPage from "./ChatPage";
    import UserListPage from "./UserListPage";
    import SettingsPage from "./SettingsPage";

    export default {
        name: 'Main',
        props: {},
        components: {
            UserListPage,
            ChatPage,
            SettingsPage
        },
        data() {
            return {
                title: 'Chat App',
                baseUrl: "http://localhost:3000",
            };
        },
        computed: {
            screen: {
                get() {
                    return this.$store.state.screen;
                },
                set(value) {
                    this.$store.commit('setScreen', value);
                }
            },
            ...mapGetters(['accessToken', 'username', 'socket', 'messages',
                'userList', 'currentChatUsers', 'msgNotify', 'sendToUsername'])
        },
        created() {

        },
        mounted() {
            if (!this.accessToken)
                this.$router.replace({name: 'login'});
            this.$store.dispatch('initSocket');
            this.$store.dispatch('getUsers');
        },
        methods: {},
    };
</script>

<style>
    html, body {
        height: 100%; margin: 0px; padding: 0px;
    }
    .container {
        height: 100%;
    }
    body {
        background: url("../assets/backgrounds/c2.jpg") no-repeat center center fixed;
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
