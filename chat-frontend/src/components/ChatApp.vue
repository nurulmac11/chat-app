<template>
    <div id="app">

        <h1 class="text-center">{{ title }}</h1>


        <div class="row" v-if="loginStatus">
            <div class="col-4">
                <ul class="list-group">
                    <li
                            class="list-group-item"
                            v-for="user of userList"
                            :key="user.socketId"
                            v-on:click="selectUser(user.socketId)"
                    >
                        {{ user.username }}
                    </li>
                </ul>
            </div>
            <div class="col-8">
                <div class="card">
                    <div id="messages" class="card-block">
                            <div v-for="message of messages" :key="message.username" id="message_div"
                                 v-bind:class="[message.username == username ? 'pull-right': 'pull-left']"
                                 style="width: 100%"
                                 >
                                {{ message.username }}: {{ message.text }}
                            </div>
                    </div>
                </div>


                <textarea
                        id="textarea"
                        class="form-control"
                        v-model="message"
                        placeholder="Enter message..."
                ></textarea>
                <br />
                <button
                        id="send"
                        class="btn"
                        @click.prevent="sendMessage"
                >
                    Send
                </button>

            </div>
        </div>
        <div id="login_container" v-else>
            <input
                    type="text"
                    v-model="username"
                    id="username"
                    class="form-control"
                    placeholder="Enter username..."
                    v-on:keyup.enter="loginMe"
            />
            <button id="login" class="btn" @click.prevent="loginMe">
                Login
            </button>
        </div>

    </div>
</template>

<script>
import Swal from 'sweetalert2';
import * as io from 'socket.io-client'

export default {
    name: 'ChatApp',
    props: {
        msg: String,
    },
    data() {
        return {
            title: 'Nestjs Websockets Chat',
            message: '',
            username: '',
            loginStatus: false,
            messages: [],
            userList: [],
            myId: null,
            socket: null,
            sendTo: -1,
        };
    },
    created() {
        this.socket = io('http://localhost:81');

        // Instant message receiver
        let vuethis = this;
        this.socket.on('chat', function(msg) {
            console.log(msg);
            vuethis.messages.push(msg);
        });
    },
    mounted() {
        // Get user list
        this.socket.on('activeUsers', userList => {
            this.userList = userList;
            this.userList = userList.filter(
                item => item.socketId !== this.myId,
            );
        });
    },
    methods: {
        selectUser(userId) {
            this.sendTo = userId;
            Swal.fire('OK', 'User selected' + userId, 'info');
        },
        loginMe() {
            this.myId = this.socket.io.engine.id;
            this.socket.emit('loginMe', this.username);
            this.loginStatus = true;
        },
        sendMessage() {
            if (this.sendTo === -1) {
                Swal.fire('Oops', 'Select a user to chat!', 'error');
                return;
            }
            if (this.validateInput()) {
                const message = {
                    username: this.username,
                    text: this.message,
                    to: this.sendTo
                };
                this.message = ''
                this.messages.push(message)
                this.socket.emit('msgToServer', message)
            }
        },
        validateInput() {
            return this.username.length > 0 && this.message.length > 0;
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
</style>
