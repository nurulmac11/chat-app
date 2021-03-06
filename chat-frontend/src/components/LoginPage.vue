<template>
    <form class="form-signin">
        <h1 class="h3 mb-3 font-weight-normal">Chat App System</h1>
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
        <ul>
            <li :key="index" v-for="(error, index) in errors">{{ error }}</li>
        </ul>
        </p>
        <div v-if="!forgot">
            <div class="form-group">
                <label for="inputUsername" class="sr-only">Username</label>
                <input type="text" id="inputUsername" v-model="username" class="form-control" placeholder="Username"
                       required
                       autofocus>
            </div>

            <div class="form-group">
                <label for="inputPassword" class="sr-only">Password</label>
                <input type="password" id="inputPassword" v-model="password" v-on:keyup.enter.exact="loginMe"
                       class="form-control" placeholder="Password" required>
            </div>
        </div>

        <div v-if="register">
            <div class="form-group">
                <label for="inputEmail" class="sr-only">Email</label>
                <input type="email" id="inputEmail" v-model="email"
                       class="form-control" placeholder="example@example.com" required>
            </div>

            <div class="form-group">
                <label for="inputGender" class="sr-only">Gender</label>
                <select class="form-control" id="inputGender" v-model="gender">
                    <option value="">Please select your gender</option>
                    <option value="m">Male</option>
                    <option value="f">Female</option>
                </select>
            </div>

            <div class="form-group">
                <label for="inputAge" class="sr-only">Age</label>
                <input type="text" name="inputAge" id="inputAge" class="form-control" v-model="age" placeholder="Age">
            </div>
        </div>

        <div v-if="forgot">
            <div class="form-group">
                <label for="inputEmail" class="sr-only">Email</label>
                <input type="email" id="inputForgotEmail" v-model="email"
                       class="form-control" placeholder="example@example.com" required>
            </div>
        </div>

        <div v-if="!forgot">
            <button class="btn btn-lg btn-primary btn-block" type="submit" @click.prevent="loginMe" v-if="!register">
                Sign in
            </button>
            <button class="btn btn-lg btn-secondary btn-block" type="submit" @click.prevent="registerMe">Create
                Account
            </button>
            <button class="btn btn-lg btn-danger btn-block" type="submit" @click.prevent="register = !register"
                    v-if="register">Cancel
            </button>
        </div>
        <br/>
        <a class="forgot text-warning" @click.prevent="forgotPassword" v-if="!forgot && !register">Forgot Password</a>
        <button class="btn btn-lg btn-primary btn-block" type="submit" @click.prevent="forgotPassword" v-if="forgot">
            Send recovery mail
        </button>
        <button class="btn btn-lg btn-danger btn-block" type="submit" @click.prevent="forgot = !forgot" v-if="forgot">
            Cancel
        </button>
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
                errors: [],
                password: '',
                register: false,
                forgot: false,
                email: '',
                gender: '',
                age: undefined,
            };
        },
        computed: {
            username: {
                get() {
                    return this.$store.state.username
                },
                set(value) {
                    this.$store.commit('setUsername', value)
                }
            },
        },
        mounted() {
        },
        methods: {
            validEmail(email) {
                let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            alphaNumeric(word) {
                let code, i, len;

                for (i = 0, len = word.length; i < len; i++) {
                    code = word.charCodeAt(i);
                    if (!(code > 47 && code < 58) && // numeric (0-9)
                        !(code > 64 && code < 91) && // upper alpha (A-Z)
                        !(code > 96 && code < 123)) { // lower alpha (a-z)
                        return false;
                    }
                }
                return true;
            },
            checkUsername(username) {
                if (username.length > 3 && username.length < 30)
                    return true;

                if (username)
                    this.errors.push('Username length must be between 3-30.')

                return false;
            },
            checkPassword(password) {
                if (password.length > 5)
                    return true;

                if (password)
                    this.errors.push(('Password must be longer than 5.'))
                return false;
            },
            checkLoginForm() {
                this.errors = [];
                if (this.username && this.checkUsername(this.username) && this.password &&
                    this.checkPassword(this.password) && this.alphaNumeric(this.username)) {
                    return true;
                }

                if (!this.username) {
                    this.errors.push('Username required.');
                }
                if (!this.password) {
                    this.errors.push('Password required.');
                }
                if (!this.alphaNumeric(this.username)) {
                    this.errors.push('Username must be alphanumeric.');
                }
                return false;
            },
            checkRegisterForm() {
                if (this.checkLoginForm() && this.email && this.gender && this.age && this.age > 17
                    && this.validEmail(this.email))
                    return true;

                if (!this.email)
                    this.errors.push('Email required.');

                if (!this.gender)
                    this.errors.push('Gender required.');

                if (!this.age)
                    this.errors.push('Age required.');

                if (!this.validEmail(this.email))
                    this.errors.push('Your email is not valid.');

                if (this.age <= 17)
                    this.errors.push('You have to be older than 17.');

                return false;
            },
            loginMe() {
                if (!this.checkLoginForm())
                    return;
                let userData = {
                    'username': this.username,
                    'password': md5(this.password)
                }
                this.$store.dispatch('loginAction', userData).then(() => {
                    this.$store.dispatch('initSocket');
                    this.$store.dispatch('randomUsers');
                    this.$store.dispatch('newComingMessages');
                    this.$router.replace({name: 'users'});
                }).catch(error => {
                    console.log(error);
                    Swal.fire('Fail', error.response.data.message, 'error');
                });
            },
            registerMe() {
                if (this.register) {
                    if (!this.checkRegisterForm())
                        return;
                    // Validation
                    if (this.age < 18) {
                        Swal.fire('Fail', 'You have to be older than 18.', 'error');
                        return;
                    }

                    let payload = {
                        'username': this.username,
                        'password': md5(this.password),
                        'email': this.email,
                        'gender': this.gender,
                        'age': this.age
                    }
                    this.$store.dispatch('registerMe', payload).then(() => {
                        this.register = !this.register;
                        Swal.fire('Successful', 'Your account created.', 'success')
                    }).catch(error => {
                        Swal.fire('Fail', error.response.data.message, 'error');
                    });
                } else {

                    this.register = true;
                }
            },
            forgotPassword() {
                if (this.forgot) {
                    if (!this.validEmail(this.email)) {
                        this.errors.push('Your email is not valid.');
                        return;
                    }

                    this.$store.dispatch('forgotPassword', {email: this.email}).then(() => {
                        Swal.fire('Success', "A mail has been sent to you if it is correct.", 'success');
                    }).catch(error => {
                        console.log(error);
                        Swal.fire('Fail', error.response.data.message, 'error');
                    });
                } else {
                    this.forgot = true;
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
