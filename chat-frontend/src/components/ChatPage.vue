<template>
    <div class="card">
        <div class="card-header msg_head">
            <div class="d-flex bd-highlight">
                <div class="img_cont" v-on:click.stop="showProfile(chattingWith)">
                    <Avatar :image-path="chattingWith.ppUrl" classes="rounded-circle user_img" />
                    <span class="online_icon"></span>
                </div>
                <div class="user_info">
                    <span>Chat with {{ chattingWith.username | truncate(10, '...') }}</span>
                    <p>1767 Messages - {{ chattingWith.biography }}</p>
                </div>
            </div>
            <span id="action_menu_btn" @click.prevent="toggleActionMenu()"><font-awesome-icon icon="ellipsis-v"/></span>
            <div class="action_menu" v-if="actionMenu">
                <ul>
                    <li v-on:click.stop="showProfile(chattingWith)"><font-awesome-icon icon="user-circle" /> View profile</li>
                    <li v-on:click.stop="addFavorite(chattingWith)"><font-awesome-icon icon="users"/> Add to favorites</li>
                    <li @click.prevent="deleteChat()"><font-awesome-icon icon="trash"/> Delete chat</li>
                    <li><font-awesome-icon icon="ban"/> Block</li>
                </ul>
            </div>
        </div>
        <div class="card-body msg_card_body" ref="msgContainer">
            <div v-for="(message, index) in activeChatMessages" :key="index">

                <div class="d-flex justify-content-start mb-4" v-if="message.to.id === profile.id">
                    <div class="img_cont_msg">
                        <Avatar :image-path="chattingWith.ppUrl" classes="rounded-circle user_img_msg" />
                    </div>
                    <div class="msg_cotainer">
                        {{ message.text }}
                        <span class="msg_time">{{ message.time }}</span>
                    </div>
                </div>

                <div class="d-flex justify-content-end mb-4" v-else>
                    <div class="msg_cotainer_send">
                        {{ message.text }}
                        <span class="msg_time_send">{{ message.time }}</span>
                    </div>
                    <div class="img_cont_msg">
                        <Avatar :image-path="profile.ppUrl" classes="rounded-circle user_img_msg" />
                    </div>
                </div>

            </div>
        </div>
        <div class="card-footer">
            <div class="input-group">
                <div class="input-group-append">
                    <span class="input-group-text attach_btn">
                        <font-awesome-icon icon="video"/>
                        </span>
                </div>
                <textarea name="" class="form-control type_msg"
                          @keyup.enter="message.length !== 0 ? sendMessage() : null"
                          v-model="message"
                          placeholder="Type your message..."></textarea>

                <div class="input-group-append"
                     @click.prevent="sendMessage()"
                >
                    <span class="input-group-text send_btn"
                          :class="message.length > 0 ? 'clickable' : null"
                    >
                        <font-awesome-icon icon="location-arrow"/>
                        <i class="fas fa-location-arrow"></i></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import Avatar from "./Avatar";
    import Swal from "sweetalert2";

    export default {
        name: "Chat",
        components: {
            Avatar,
        },
        data() {
            return {
                actionMenu: false
            };
        },
        computed: {
            message: {
                get() {
                    return this.$store.state.message;
                },
                set(value) {
                    this.$store.commit('setMessage', value);
                }
            },
            ...mapGetters(['activeChatMessages', 'username', 'chattingWith', 'server', 'profile'])
        },
        mounted() {
            const container = this.$refs.msgContainer;
            container.scrollTop = container.scrollHeight + 120;
        },
        watch: {
            activeChatMessages: function() {
                this.$nextTick(function() {
                    const container = this.$refs.msgContainer;
                    container.scrollTop = container.scrollHeight + 120;
                });
            }
        },
        methods: {
            sendMessage() {
                if(this.message.length > 0)
                    this.$store.dispatch('sendMessage');
            },
            toggleActionMenu() {
                this.actionMenu = !this.actionMenu;
            },
            deleteChat() {
                this.$store.commit('removeChat', this.chattingWith);
                this.$router.replace({name: 'chatUsers'});
            },
            showProfile(profile) {
                this.$store.commit('setViewProfile', profile);
                this.$router.push({name: 'profile'});
            },
            addFavorite(profile) {
                this.$store.dispatch('addFavUser', profile).catch((error) => {
                    Swal.fire('Fail', error.response.data.message, 'error');
                });
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
        font-size: 10px;
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
        display: block ruby;
    }

    .msg_time_send {
        position: absolute;
        right: 0;
        bottom: -15px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 10px;
        display: block ruby;
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
    .clickable {
        cursor: pointer;
    }
</style>
