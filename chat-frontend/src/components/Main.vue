<template>
    <div id="app">

        <h1 class="text-center">{{ title }}</h1>


        <div v-if="screen === 'chatList'">
            <UserList :userList="currentChatUsers"/>
        </div>


        <div v-if="screen === 'chat'">
            <Chat/>
        </div>


        <div v-if="screen === 'userList'">
            <UserList :userList="userList"/>
        </div>

        <ul class="nav nav-pills nav-fill">
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
                   @click.prevent="screen = 'settings'"><font-awesome-icon icon="cogs" /> </a>
            </li>
        </ul>

    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import UserList from "./UserList";
    import Chat from "./Chat";

    export default {
        name: 'Main',
        props: {},
        components: {
            UserList,
            Chat
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

<style scoped>

</style>
