<template>
    <form class="form-signin">
        <h1 class="h3 mb-3 font-weight-normal">Chat App System</h1>

            <div class="form-group">
                <label for="inputPassword" class="sr-only">New Password</label>
                <input type="password" id="inputPassword" v-model="password"
                       class="form-control" placeholder="Password" required>
            </div>
            <div class="form-group">
                <label for="inputPassword" class="sr-only">New Password Again</label>
                <input type="password" id="inputPasswordAgain" v-model="passwordControl" v-on:keyup.enter.exact="resetPassword"
                       class="form-control" placeholder="Password again" required>
            </div>

        <button class="btn btn-lg btn-primary btn-block" type="submit" @click.prevent="resetPassword">Reset password</button>
        <p class="mt-5 mb-3 text-muted">&copy; 2020-2021</p>
    </form>
</template>

<script>
    import * as Swal from "sweetalert2";
    import md5 from "md5";

    export default {
        name: "ResetPasswordPage",
        data() {
            return {
                password: '',
                passwordControl: '',
            };
        },
        props: {
            key: {
                type: String,
                default: () => ''
            },
        },
        computed: {
        },
        mounted() {
        },
        methods: {
            resetPassword() {
                if(this.password === this.passwordControl && this.key) {
                    this.$store.dispatch('resetPassword', {key: this.key, password: md5(this.password)}).then(() => {
                        Swal.fire('Success', "Your password reset.", 'success');
                        this.$router.replace({name: 'login'});
                    }).catch(error => {
                        console.log(error);
                        Swal.fire('Fail', error.response.data.message, 'error');
                    });
                } else {
                    Swal.fire('Fail', "Passwords does not match.", 'error');
                }
            },
        }
    }
</script>

<style scoped>
    body {
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

    .forgot {
        cursor: pointer;
    }

</style>
