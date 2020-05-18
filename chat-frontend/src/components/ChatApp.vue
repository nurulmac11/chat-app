<template>
    <div id="app">

        <h1 class="text-center">{{ title }}</h1>


        <div class="row" v-if="currentForm == 1">

            <div class="col-3 border">
                <h3>Chat List</h3>
                <ul class="list-group">
                    <li
                            class="list-group-item"
                            v-for="user of activeChatUsers"
                            :key="user.socketId"
                            v-on:click="selectUser(user.socketId, user.username)"
                    >
                        {{ user.username }}
                        <span v-if="msgNotify.includes(user.username)" class="dot"></span>
                    </li>
                </ul>
            </div>


            <div class="col-6 border" v-if="activeChatUsers.length">
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
                <button id="send" class="btn" @click.prevent="sendMessage">Send</button>
            </div>


            <div class="col-3 border">
                <h3>User List</h3>
                <ul class="list-group">
                    <li
                            class="list-group-item"
                            v-for="user of userList"
                            :key="user.socketId"
                            v-on:click="selectUser(user.socketId, user.username)"
                    >
                        {{ user.username }}
                    </li>
                </ul>
            </div>

        </div>

        <div id="login_container" class="border col-4 offset-md-4" v-else-if="currentForm == 0">
            <h2>Login Form</h2>
            <input
                    type="text"
                    v-model="username"
                    id="username"
                    class="form-control"
                    placeholder="Enter username..."
            />
            <br/>
            <input
                    type="password"
                    v-model="password"
                    id="password"
                    class="form-control"
                    placeholder="Enter password..."
                    v-on:keyup.enter.exact="loginMe"
            />
            <br/>
            <button id="login" class="btn" @click.prevent="loginMe">
                Login
            </button>
            <a @click.prevent="formSwitch(-1)">Register</a>
        </div>


        <div id="register_container" class="border col-4 offset-md-4" v-else>
            <h2>Register Form</h2>
            <input
                    type="text"
                    v-model="username"
                    id="username"
                    class="form-control"
                    placeholder="Enter username..."
            />
            <br/>
            <input
                    type="password"
                    v-model="password"
                    id="password"
                    class="form-control"
                    placeholder="Enter password..."
            />
            <br/>
            <input
                    type="text"
                    v-model="email"
                    id="email"
                    class="form-control"
                    placeholder="Enter email..."
                    v-on:keyup.enter.exact="registerMe"
            />
            <br/>
            <button id="register" class="btn" @click.prevent="registerMe">
                Register
            </button>
            <a @click.prevent="formSwitch(0)">Login</a>
        </div>

    </div>
</template>

<script>
    import Swal from 'sweetalert2';
    import * as io from 'socket.io-client'
    import Axios from 'axios'
    import md5 from 'md5'

    export default {
        name: 'ChatApp',
        props: {
            msg: String,
        },
        data() {
            return {
                title: 'Chat App',
                username: '',
                password: '',
                email: '',
                message: '',
                currentForm: 0,
                messages: [],
                userList: [],
                myId: null,
                socket: null,
                sendToID: -1, // ID
                sendToUsername: null,
                currentChatUsers: [], // Username
                msgNotify: [],
                baseUrl: "http://localhost:3000",
            };
        },
        computed: {
            activeChatMessages: function () {
                return this.messages.filter((u) => {
                    return u.senderId === this.sendToID || u.to == this.sendToID
                })
            },
            activeChatUsers: function () {
                return this.userList.filter((u) => {
                    return this.currentChatUsers.includes(u.username)
                })
            }
        },
        created() {
            this.socket = io('http://localhost:81');

            // Instant message receiver
            let vthis = this
            this.socket.on('chat', function (msg) {
                if (!(vthis.currentChatUsers.includes(msg.username)))
                    vthis.currentChatUsers.push(msg.username)
                vthis.messages.push(msg)
                console.log(vthis.sendToID, msg.senderId, vthis)
                if(vthis.sendToID !== msg.senderId)
                    vthis.msgNotify.push(msg.username)
            });
        },
        mounted() {
            // Get user list
            this.socket.on('activeUsers', userList => {
                this.userList = userList.filter(
                    item => item.socketId !== this.myId,
                );
            });
        },
        methods: {
            registerMe() {
                let userData = {
                    'username': this.username,
                    'password': md5(this.password),
                    'email': this.email
                }
                Axios.post(this.baseUrl + '/users/create', userData)
                    .then(function (response) {
                        Swal.fire('Successful', 'Your account created.', 'success')
                        this.currentForm = 1;
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            formSwitch(switchTo) {
                this.currentForm = switchTo;
            },
            selectUser(userId, username) {
                this.sendToID = userId
                this.sendToUsername = username
                if (!(this.currentChatUsers.includes(username)))
                    this.currentChatUsers.push(username)
                this.msgNotify.splice(this.msgNotify.indexOf(username), 1);
            },
            loginMe() {
                let userData = {
                    'username': this.username,
                    'password': md5(this.password),
                }
                Axios.post(this.baseUrl + '/users/login', userData)
                    .then(function (response) {
                        Swal.fire('Successful', 'You logged in!', 'success')
                        this.currentForm = 1;
                        console.log(response);
                        this.myId = this.socket.io.engine.id;
                        this.socket.emit('loginMe', this.username);
                        this.currentForm = true;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            sendMessage() {

                if (this.sendToID === -1) {
                    Swal.fire('Oops', 'Select a user to chat!', 'error')
                    return;
                }
                if (this.validateInput()) {
                    const message = {
                        username: this.username,
                        text: this.message,
                        to: this.sendToID,
                        senderId: this.myId,
                    };
                    this.message = ''
                    this.messages.push(message)
                    this.socket.emit('msgToServer', message)
                    if (!(this.currentChatUsers.includes(this.sendToUsername)))
                        this.currentChatUsers.push(this.sendToUsername)

                }
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
</style>
