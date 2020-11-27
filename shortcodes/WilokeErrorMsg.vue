<template>
    <div v-show="!isHidden" class="alert_module__Q4QZx alert_danger__2ajVf">
        <div class="alert_icon__1bDKL"><i class="la la-warning"></i></div>
        <div class="alert_content__1ntU3" v-html="msg"></div><a v-if="hasRemove" @click.prevent="hideMsg" class="alert_close__3PtGd" href="#"><i class="la la-times"></i></a>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                isHidden: false
            }
        },
        props: {
            msg: {
                type: String,
                required: true,
                default: ''
            },
            hasRemove: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            hideMsg(){
                event.preventDefault();
                this.isHidden = true;
            }
        }
    }
</script>
