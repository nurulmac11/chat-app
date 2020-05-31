<template>
    <div id="app">

        <h1 class="text-center">{{ title }}</h1>


        <div class="col-3 border">
            <h3>Chat List</h3>
            <ul class="list-group">
                <li
                        class="list-group-item"
                        v-for="(user, index) in currentChatUsers"
                        :key="index"
                        v-on:click="selectUser(user)"
                >
                    {{ user }}
                    <span v-if="msgNotify.includes(user)" class="dot"></span>
                </li>
            </ul>
        </div>


        <div class="col-6 border">
            <div class="card">
                <div id="messages" class="card-block">
                    <div v-for="(message, index) in activeChatMessages" :key="index" id="message_div"
                         v-bind:class="[message.username == username ? 'pull-right': 'pull-left']"
                         style="width: 100%"
                    >
                        {{ message.username }}: {{ message.text }}
                    </div>
                </div>
            </div>

            <textarea
                    @keyup.enter="sendMessage()"
                    id="textarea"
                    class="form-control"
                    v-model="message"
                    placeholder="Enter message..."
            ></textarea>
            <br/>
            <button id="send" class="btn" @click.prevent="sendMessage"
            >Send
            </button>
        </div>


        <div class="col-3 border">
            <h3>User List</h3>
            <ul class="list-group">
                <li
                        class="list-group-item"
                        v-for="(user, index) in userList"
                        :key="index"
                        v-on:click="selectUser(user)"
                >
                    {{ user }}
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import Swal from "sweetalert2";

    export default {
        name: 'ChatApp',
        props: {
            msg: String,
        },
        data() {
            return {
                title: 'Chat App',
                baseUrl: "http://localhost:3000",
            };
        },
        computed: {
            activeChatMessages: function () {
                return this.messages.filter((u) => {
                    return u.from === this.sendToUsername || u.to === this.sendToUsername
                })
            },
            message: {
                get () {
                    return this.$store.state.message;
                },
                set (value) {
                    this.$store.commit('setMessage', value);
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
        methods: {
            selectUser(username) {
                // Writing to username
                this.$store.commit('setSendTo', username);
                this.$store.commit('addChatUser', username);
                this.$store.commit('clearNotification', username);
            },
            sendMessage() {
                if (this.sendToUsername === -1) {
                    Swal.fire('Oops', 'Select a user to chat!', 'error')
                    return;
                }
                this.$store.dispatch('sendMessage');
            },
            validateInput() {
                return this.username.length > 0 && this.message.length > 0
            },
        },
    };
</script>

<style scoped>
    .pull-left {
        text-align: left;
    }

    .pull-right {
        text-align: right;
    }

    .dot {
        height: 25px;
        width: 25px;
        background-color: red;
        border-radius: 50%;
        display: inline-block;
    }

    .border {
        border: 1px solid #fd0000 !important;
    }

    .list-group-item, .card {
        background: none;
    }

</style>
