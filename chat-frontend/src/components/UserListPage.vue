<template>
    <div class="card mb-sm-3 mb-md-0 contacts_card">
        <div class="card-header">
            <div class="input-group">
                <button type="button" class="btn btn-success"
                        v-on:click="refresh()"
                        v-if="mode === 'users'"
                >Refresh
                </button>
                <input type="text" placeholder="Search..." name="" class="form-control search" v-if="mode === 'users'">
                <div class="input-group-prepend" v-if="mode === 'users'">
                    <span class="input-group-text search_btn"><font-awesome-icon icon="search"/></span>
                </div>
            </div>
            <ul class="nav nav-tabs" v-if="mode === 'chatUsers'">
                <li class="nav-item">
                    <a class="nav-link" :class="{ active: !showFavorites }" @click.stop="showFavorites = false"
                       href="#">Active Chats</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" :class="{ active: showFavorites }"
                       @click.stop="showFavs();" href="#">Favorites</a>
                </li>
            </ul>
        </div>
        <div class="card-body contacts_body">
            <ul class="contacts">
                <li
                        v-for="user in userList"
                        :key="user.id + mode"
                        v-on:click.prevent="selectUser(user)"
                >
                    <div class="d-flex bd-highlight contact-li">
                        <div class="img_cont" v-on:click.stop="showProfile(user)">
                            <Avatar :image-path="user.ppUrl" classes="rounded-circle user_img"/>
                            <span class="online_icon offline"
                                  v-if="msgNotify.includes(user.username)"></span>
                        </div>
                        <div class="user_info">
                            <span>{{ user.username }}</span>
                            <p>{{ user.biography }}
                                <time-ago :datetime="user.lastOnline" long></time-ago>
                            </p>
                        </div>
                    </div>
                </li>

            </ul>
        </div>
        <div class="card-footer"></div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import TimeAgo from 'vue2-timeago'
    import Avatar from "./Avatar";

    export default {
        name: "UserListPage",
        components: {
            TimeAgo,
            Avatar
        },
        props: {
            mode: {
                type: String,
                default: ''
            },
            userMode: {
                type: String,
                default: ''
            }
        },
        mounted() {
        },
        data: () => {
            return {
                showFavorites: false
            }
        },
        computed: {
            ...mapGetters(['msgNotify', 'server']),
            userList() {
                if (this.mode === 'chatUsers' && this.showFavorites) {
                    return this.$store.getters.favorites;
                } else if (this.mode === 'chatUsers') {
                    return this.$store.getters.currentChatUsers;
                } else if (this.mode === 'users') {
                    return this.$store.getters.randomUserList;
                }
                return [];
            }
        },
        methods: {
            selectUser(profile) {
                // Writing to username
                this.$store.commit('setCurrentChat', profile);
                this.$store.commit('clearNotification', profile);
                this.$router.push({name: 'chat'});
            },
            refresh() {
                this.$store.dispatch('randomUsers');
            },
            showProfile(profile) {
                this.$store.commit('setViewProfile', profile);
                this.$router.push({name: 'profile'});
            },
            showFavs() {
                this.showFavorites = true;
                this.$store.dispatch('favorites');
            }
        }
    }
</script>

<style scoped>
    body, html {
        height: 100%;
        margin: 0;
        background: #7F7FD5;
        background: -webkit-linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5);
        background: linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5);
    }

    .chat {
        margin-top: auto;
        margin-bottom: auto;
    }

    .card {
        height: 500px;
        border-radius: 15px !important;
        background-color: rgba(0, 0, 0, 0.4) !important;
    }

    .contacts_body {
        padding: 0.75rem 0 !important;
        overflow-y: auto;
        white-space: nowrap;
    }

    .msg_card_body {
        overflow-y: auto;
    }

    .card-header {
        border-radius: 15px 15px 0 0 !important;
        border-bottom: 0 !important;
    }

    .card-footer {
        border-radius: 0 0 15px 15px !important;
        border-top: 0 !important;
    }

    .container {
        align-content: center;
    }

    .search {
        border-radius: 15px 0 0 15px !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
        border: 0 !important;
        color: white !important;
    }

    .search:focus {
        box-shadow: none !important;
        outline: 0px !important;
    }

    .type_msg {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border: 0 !important;
        color: white !important;
        height: 60px !important;
        overflow-y: auto;
    }

    .type_msg:focus {
        box-shadow: none !important;
        outline: 0px !important;
    }

    .attach_btn {
        border-radius: 15px 0 0 15px !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
        border: 0 !important;
        color: white !important;
        cursor: pointer;
    }

    .send_btn {
        border-radius: 0 15px 15px 0 !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
        border: 0 !important;
        color: white !important;
        cursor: pointer;
    }

    .search_btn {
        border-radius: 0 15px 15px 0 !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
        border: 0 !important;
        color: white !important;
        cursor: pointer;
    }

    .contacts {
        list-style: none;
        padding: 0;
    }

    .contacts li {
        width: 100% !important;
        padding: 5px 10px;
        margin-bottom: 15px !important;
    }

    .active {
        background-color: rgba(0, 0, 0, 0.3);
    }

    .user_img {
        height: 70px;
        width: 70px;
        border: 1.5px solid #f5f6fa;

    }

    .user_img_msg {
        height: 40px;
        width: 40px;
        border: 1.5px solid #f5f6fa;

    }

    .img_cont {
        position: relative;
        height: 70px;
        width: 70px;
    }

    .img_cont_msg {
        height: 40px;
        width: 40px;
    }

    .online_icon {
        position: absolute;
        height: 15px;
        width: 15px;
        background-color: #4cd137;
        border-radius: 50%;
        bottom: 0.2em;
        right: 0.4em;
        border: 1.5px solid white;
    }

    .offline {
        background-color: #c23616 !important;
    }

    .user_info {
        margin-top: auto;
        margin-bottom: auto;
        margin-left: 15px;
    }

    .user_info span {
        font-size: 20px;
        color: white;
    }

    .user_info p {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
    }

    .video_cam {
        margin-left: 50px;
        margin-top: 5px;
    }

    .video_cam span {
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-right: 20px;
    }

    .msg_cotainer {
        margin-top: auto;
        margin-bottom: auto;
        margin-left: 10px;
        border-radius: 25px;
        background-color: #82ccdd;
        padding: 10px;
        position: relative;
    }

    .msg_cotainer_send {
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 10px;
        border-radius: 25px;
        background-color: #78e08f;
        padding: 10px;
        position: relative;
    }

    .msg_time {
        position: absolute;
        left: 0;
        bottom: -15px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 10px;
    }

    .msg_time_send {
        position: absolute;
        right: 0;
        bottom: -15px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 10px;
    }

    .msg_head {
        position: relative;
    }

    #action_menu_btn {
        position: absolute;
        right: 10px;
        top: 10px;
        color: white;
        cursor: pointer;
        font-size: 20px;
    }

    .action_menu {
        z-index: 1;
        position: absolute;
        padding: 15px 0;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border-radius: 15px;
        top: 30px;
        right: 15px;
        display: none;
    }

    .action_menu ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .action_menu ul li {
        width: 100%;
        padding: 10px 15px;
        margin-bottom: 5px;
    }

    .action_menu ul li i {
        padding-right: 10px;

    }

    .action_menu ul li:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 576px) {
        .contacts_card {
            margin-bottom: 15px !important;
        }
    }

    .contact-li {
        background-color: rgba(19, 93, 94, 0.3);
        background-clip: padding-box;
    }

    .contact-li:hover {
        background-color: rgba(19, 93, 94, 0.8);
    }
</style>
