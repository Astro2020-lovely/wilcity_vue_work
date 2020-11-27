<template>
    <a :class="classes" :href="link" v-on="$listeners">
        <span v-if="btnName" v-html="btnName"></span>
        <i v-if="icon" :class="icon"></i>
        <div class="pill-loading_module__3LZ6v" v-if="isLoading=='yes'">
            <div class="pill-loading_loader__3LOnT"></div>
        </div>
    </a>
</template>
<script>
    export default{
        computed:{
            classes() {
                let btnSize = 'wil-btn--'+this.size;

                return [
                    this.wrapperClasses,
                    this.isLoading === 'yes' ? 'wil-btn--loading' : '',
                    `wil-btn--${this.size}`,
                    `wil-btn--${this.variation}`
                ];
            }
        },
        props: {
            wrapperClasses: {
                type: String,
                default: 'wil-btn wil-btn--primary wil-btn--round',
                required: false
            },
            link: {
                type: String,
                default: '#',
                required: false
            },
            icon: {
                type: String,
                default: '',
                required: false
            },
            size: {
                type: String,
                default: 'md',
                required: false
            },
            variation: {
                type: String,
                default: 'primary',
                required: false
            },
            btnName: {
                type: String,
                default: '',
                required: false
            },
            isLoading: {
                type: String,
                default: 'no',
                required: false
            }
        }
    }

</script>
