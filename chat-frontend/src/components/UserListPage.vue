<template>
    <div class="card mb-sm-3 mb-md-0 contacts_card">
        <div class="card-header">
            <div class="input-group">
                <button type="button" class="btn btn-success refresh"
                        v-on:click="refresh()"
                        v-if="mode === 'users'"
                >Refresh
                </button>
                <input type="text" v-on:keyup.enter.exact="search()" placeholder="Search..." name="search-keyword"
                       v-model="searchKeyword" class="form-control search" v-if="mode === 'users'">
                <div class="input-group-prepend" v-if="mode === 'users'">
                    <span class="input-group-text search_btn"><font-awesome-icon icon="search" @click.stop="search()"/></span>
                </div>
            </div>

            <ul class="nav nav-tabs nav-fill" v-if="mode === 'chatUsers'">
                <li class="nav-item">
                    <a class="nav-link dark-nav" :class="{ active: !showFavorites }" @click.stop="showFavorites = false"
                       href="#">
                        <font-awesome-icon icon="comments"/>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link dark-nav" :class="{ active: showFavorites }"
                       @click.stop="showFavs();" href="#">
                        <font-awesome-icon icon="heart"/>
                    </a>
                </li>
            </ul>

        </div>
        <div class="card-body contacts_body">
            <ul class="contacts">
                <li
                        v-for="(user, index) in userList"
                        :key="user.id + mode + index"
                        v-on:click.prevent="selectUser(user)"
                >
                    <div class="d-flex bd-highlight contact-li">
                        <div class="img_cont" v-on:click.stop="showProfile(user)">
                            <Avatar :image-path="user.ppUrl" classes="rounded-circle user_img" :gender="user.gender"/>
                            <span class="online_icon offline"
                                  v-if="msgNotify.includes(user.username)"></span>
                            <span class="online_icon" v-else-if="user.isOnline"></span>
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
    import Swal from "sweetalert2";
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
                showFavorites: false,
                searchKeyword: ''
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
            },
            search() {
                if (this.searchKeyword.length <= 3)
                    Swal.fire('Fail', "Search keyword must be longer than 3 letters.", 'error');

                this.$store.dispatch('searchUsers', this.searchKeyword);
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

    .card-header {
        border-radius: 15px 15px 0 0 !important;
        border-bottom: 0 !important;
    }

    .card-footer {
        border-radius: 0 0 15px 15px !important;
        border-top: 0 !important;
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

    .img_cont {
        position: relative;
        height: 70px;
        width: 70px;
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

    .video_cam span {
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-right: 20px;
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

    .refresh {
        margin-right: 15px;
    }
</style>
