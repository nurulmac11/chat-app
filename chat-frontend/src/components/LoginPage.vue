<template>
    <form class="form-signin">
        <h1 class="h3 mb-3 font-weight-normal">Chat App System</h1>

        <label for="inputUsername" class="sr-only">Username</label>
        <input type="text" id="inputUsername" v-model="username" class="form-control" placeholder="Username" required
               autofocus>

        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" id="inputPassword" v-model="password" v-on:keyup.enter.exact="loginMe"
               class="form-control" placeholder="Password" required>

        <button class="btn btn-lg btn-primary btn-block" type="submit" @click.prevent="loginMe">Sign in</button>
        <p class="mt-5 mb-3 text-muted">&copy; 2020-2021</p>
    </form>
</template>

<script>
    import md5 from "md5";
    import * as Swal from "sweetalert2";

    export default {
        name: "LoginPage",
        data() {
            return {
                password: '',
            };
        },
        computed: {
            username : {
                get () {
                    return this.$store.state.username
                },
                set (value) {
                    this.$store.commit('setUsername', value)
                }
            },
        },
        methods: {
            loginMe() {
                let userData = {
                    'username': this.username,
                    'password': md5(this.password)
                }
                this.$store.dispatch('loginAction', userData).then(() => {
                    Swal.fire('Successful', 'Logged in succesfully.', 'success');
                    this.$router.replace({ name: 'chat' });
                }).catch(error => {
                    Swal.fire('Fail', error.response.data.message, 'error');
                });
            },
        }
    }
</script>

<style>
    body {
        background: url("../assets/backgrounds/c2.jpg") no-repeat center center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        display: -ms-flexbox;
        display: -webkit-box;
        display: flex;
        -ms-flex-align: center;
        -ms-flex-pack: center;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        padding-top: 40px;
        padding-bottom: 40px;
        background-color: #f5f5f5;
        color: white;
    }

    #app {
        background-color: rgba(0, 0, 0, 0.2);
    }

    .form-signin {
        width: 100%;
        max-width: 330px;
        padding: 15px;
        margin: 0 auto;
    }

    .form-signin .checkbox {
        font-weight: 400;
    }

    .form-signin .form-control {
        position: relative;
        box-sizing: border-box;
        height: auto;
        padding: 10px;
        font-size: 16px;
    }

    .form-signin .form-control:focus {
        z-index: 2;
    }

    .form-signin input[type="email"] {
        margin-bottom: -1px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }

    .form-signin input[type="password"] {
        margin-bottom: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .form-control {
        margin-bottom: 10px;
    }

</style>
