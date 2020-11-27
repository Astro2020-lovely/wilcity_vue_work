<template>
    <div :class="wrapperClass">
        <slot name="header">
            <div class="wil-group01_header__HJipl">
                <div class="wil-group01_collapse__3_7gz"><i class="fa fa-arrow-up" @click.prevent="toggleStatus"></i></div>
                <div class="wil-group01_title__3T5Se" v-html="toggleTitle"></div>
                <div class="wil-group01_remove__3eU1D">
                    <i class="fa fa-times" @click.prevent="deleteItem"></i>
                </div>
            </div>
        </slot>
        <div v-show="isOpening">
            <slot name="content">Content Here</slot>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                isOpening: this.isAutoOpen == 'yes'
            }
        },
        computed: {
            toggleClass(){
                return this.isOpening ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
            }
        },
        props:{
            isAutoOpen:{
                type: String,
                default: 'no'
            },
            toggleTitle:{
                type: String,
                default: ''
            },
            wrapperClass:{
                type: String,
                default: ''
            }
        },
        methods: {
            toggleStatus(){
                this.isOpening = !this.isOpening;
            },
            deleteItem(){
                this.$emit('onDeleteItem');
            }
        }
    }
</script>
