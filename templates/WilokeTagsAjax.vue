<template>
    <wiloke-select-two :settings="{maximum: maximumTags, defaultVal: '', isAjax: 'yes', ajaxArgs: ajaxArgs}"></wiloke-select-two>
</template>
<script>
    import {mapGetters} from 'vuex'
    import WilokeSelectTwo from './WilokeSelectTwo.vue'
    export default{
        data(){
            return{
                isReachedMaximum: false,
                oPlanSettings: typeof this.$store !== 'undefined' && typeof this.$store.getters.getPlanSettings !== 'undefined' ? this.$store.getters.getPlanSettings : {},
                maximumTags: typeof this.settings.maximum !== 'undefined' ? parseInt(this.settings.maximum, 10) : -1,
                aTags: typeof this.settings.value === 'object' ? this.settings.value : [],
                ajaxArgs: {
                    action: 'wilcity_fetch_tags'
                }
            }
        },
        components:{
            WilokeSelectTwo
        }
    }
</script>
