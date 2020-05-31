<template>
    <div class="list-group">
        <button type="button"
                class="list-group-item list-group-item-action"
                v-for="(user, index) in userList"
                :key="index"
                v-on:click="selectUser(user)"
        >
            {{ user }}
            <span v-if="msgNotify.includes(user)" class="dot"></span>
        </button>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "UserList",
        props: {
            userList: Array,
        },
        computed: {
            screen: {
                get () {
                    return this.$store.state.screen;
                },
                set (value) {
                    this.$store.commit('setScreen', value);
                }
            },
            ...mapGetters(['msgNotify'])
        },
        methods: {
            selectUser(username) {
                // Writing to username
                this.$store.commit('setSendTo', username);
                this.$store.commit('addChatUser', username);
                this.$store.commit('clearNotification', username);
                this.$store.commit('setScreen', 'chat');
            },
        }
    }
</script>

<style scoped>
    .dot {
        height: 25px;
        width: 25px;
        background-color: red;
        border-radius: 50%;
        display: inline-block;
    }
</style>
