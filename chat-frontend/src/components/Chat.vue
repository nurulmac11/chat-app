<template>
    <div>
            <div id="messages" class="card-block">
                <div v-for="(message, index) in activeChatMessages" :key="index" id="message_div"
                     v-bind:class="[message.username === username ? 'pull-right': 'pull-left']"
                     style="width: 100%"
                >
                    {{ message.username }}: {{ message.text }}
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
        <button type="button" class="btn btn-success" @click.prevent="sendMessage">Send</button>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import * as Swal from "sweetalert2";

    export default {
        name: "Chat",
        data() {
            return {
            };
        },
        computed: {
            message: {
                get () {
                    return this.$store.state.message;
                },
                set (value) {
                    this.$store.commit('setMessage', value);
                }
            },
            ...mapGetters(['activeChatMessages', 'username'])
        },
        methods: {
            sendMessage() {
                if(!this.validateInput())
                    Swal.fire('Fail', "Write a message", "error");
                this.$store.dispatch('sendMessage');
            },
            validateInput() {
                return this.username.length > 0 && this.message.length > 0
            },
        }
    }
</script>

<style scoped>
    .pull-left {
        text-align: left;
    }

    .pull-right {
        text-align: right;
    }
</style>
