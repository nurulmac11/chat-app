<template>
    <div class="card mb-sm-3 mb-md-0 profile">
        <div class="header">
            <div class="avatar">
                <Avatar :image-path="profile.ppUrl" classes="rounded-circle user_img" :gender="profile.gender" />
                <br/>
            </div>
            <div class="name">
                <h3 class="title">{{ profile.username }}</h3>
                <p>{{ profile.biography }}</p>
                <div class="icons">
                    <div class="left">
                        <font-awesome-icon :icon="['fas', 'birthday-cake']"/>
                        <br/>{{ profile.age}}
                    </div>
                    <div class="left">
                        <font-awesome-icon :icon="['fas', 'comments']"/>
                        <br/>{{ profile.conversations }}
                    </div>
                    <div class="left">
                        <font-awesome-icon :icon="['fas', 'venus-mars']"/>
                        <br/>{{ profile.gender }}
                    </div>
                </div>
            </div>
        </div>

        <div class="row body">
            <div class="col-md-4">
            </div>
            <div class="col-md-8">
            </div>
        </div>
    </div>
</template>

<script>
    import Avatar from "./Avatar";

    export default {
        name: "UserProfile",
        components: {
            Avatar
        },
        props: {
        },
        computed: {
            profile: {
                get() {
                    return this.$store.state.viewProfile;
                }
            },
        }
    }
</script>

<style scoped>
    .profile .header {
        text-align: center;
    }

    .left {
        float: left;
        width: 100px;
    }

    .icons {
        margin: 0 auto;
        display: table;
    }

    .profile .body {
        margin-left: 50px;
        margin-top: 50px
    }

    .profile img {
        max-width: 100px;
        margin: 0 auto;
        -webkit-transform: translate3d(0, -50%, 0);
        -moz-transform: translate3d(0, -50%, 0);
        -o-transform: translate3d(0, -50%, 0);
        -ms-transform: translate3d(0, -50%, 0);
        transform: translate3d(0, -10%, 0);
    }

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

    .contacts li {
        width: 100% !important;
        padding: 5px 10px;
        margin-bottom: 15px !important;
    }

    .user_info span {
        font-size: 20px;
        color: white;
    }

    .user_info p {
        font-size: 10px;
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
</style>
