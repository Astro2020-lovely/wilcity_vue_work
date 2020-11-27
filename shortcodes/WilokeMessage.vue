<template>
    <div v-show="!isHidden" :class="wrapperClass">
        <div v-show="icon!=''" class="alert_icon__1bDKL"><i :class="icon"></i></div>
        <div class="alert_content__1ntU3" v-html="msg"></div><a v-if="hasRemove=='yes'" @click.prevent="hideMsg" class="alert_close__3PtGd" href="#"><i class="la la-times"></i></a>
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
                default: ''
            },
            hasRemove: {
                type: String,
                default: 'no'
            },
            status: {
                type: String,
                default: ''
            },
            icon: {
                type: String,
                default: ''
            },
            additionalClass: {
                type: String,
                default: ''
            }
        },
        computed: {
            wrapperClass(){
                let cssClass = 'alert_module__Q4QZx';

                switch(this.status){
                    case 'danger':
                        cssClass += ' alert_danger__2ajVf';
                        break;
                    case 'success':
                        cssClass += ' alert_success__1nkos';
                        break;
                    case 'warning':
                        cssClass += ' alert_warning__2IUiO';
                        break;
                    case 'info':
                        cssClass += ' alert_info__2dwkg';
                        break;
                    case 'dark':
                        cssClass += ' alert_dark__3ks';
                    default:
                        cssClass += ' ';
                        break;
                }

                return cssClass + ' ' + this.additionalClass;
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
