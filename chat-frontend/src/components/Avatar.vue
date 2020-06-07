<template>
    <img :src="imagePath ? server + '/users/avatar/' + imagePath : defaultAvatar()"
         :class="classes">
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "Avatar",
        props: {
            imagePath: {
                type: String,
                default: () => ''
            },
            classes: {
                type: String,
                default: () => ''
            },
        },
        data() {
            return {
            };
        },
        computed: {
            ...mapGetters(['server']),
        },
        methods: {
            defaultAvatar() {
                var images = require.context('../assets/images/')
                return images('./anon.jpg')
            }
        }
    }
</script>

<style scoped>

</style>
