<template>
    <div :class="wrapperClass">
        <div class="field_wrap__Gv92k">
            <input v-if="settings.isRequired" v-model="value" class="field_field__3U_Rt" type="url" required>
            <input v-else class="field_field__3U_Rt" type="url" v-model="value">
            <span class="field_label__2eCP7 text-ellipsis" :class="{'required': settings.isRequired=='yes'}">{{settings.label}}</span>
            <span class="bg-color-primary"></span>
        </div>
        <span class="field_message__3Z6FX color-quaternary" v-if="settings.errMsg">{{settings.errMsg}}</span>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'

    export default{
        props: ['settings'],
        data(){
            return {
              value: typeof this.settings.value !== 'undefined' ? this.settings.value : '',
              oPlanSettings: typeof this.$store !== 'undefined' && typeof this.$store.getters.getPlanSettings !== 'undefined' ? this.$store.getters.getPlanSettings : {}
            }
        },
        watch: {
            value: {
                handler: function(newVal){
                    this.settings.value = newVal;
                    this.$emit('urlChanged', this.value, this.settings);
                },
                immediate: true
            }
        },
        methods: {
            updateVal(){
                if ( typeof this.oPlanSettings['toggle_'+this.settings.key] !== 'undefined' && this.oPlanSettings['toggle_'+this.settings.key] == 'disable' ){
                    return false;
                }

                this.$parent.$on('update_'+this.settings.key, val => {
                    this.value = val;
                })
            }
        },
        computed: {
            wrapperClass(){
                return {
                    'field_module__1H6kT field_style2__2Znhe mb-15': 1==1,
                    'active': this.value.length,
                    'disable': typeof this.oPlanSettings['toggle_'+this.settings.key] !== 'undefined' && this.oPlanSettings['toggle_'+this.settings.key] == 'disable'
                }
            }
        },
        mounted(){
            this.updateVal();
        }
    }
</script>

