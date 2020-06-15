<template>
    <img :src="imagePath ? server + '/users/avatar/' + imagePath : defaultAvatar()"
         :class="all_classes">
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
            gender: {
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
            all_classes: {
                get() {
                    let gender_class;
                    if(this.gender === 'm')
                        gender_class = ' blue_border';
                    else if (this.gender === 'f')
                        gender_class = ' pink_border';
                    else
                        gender_class = ' rainbow_border';
                    return this.classes + gender_class;
                }
            }
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
