<template>
    <div :class="wrapperClass">
        <div class="field_wrap__Gv92k">
            <input v-if="isRequired(settings.isRequired)" v-model="value" class="field_field__3U_Rt" type="text" @change="changed" @keyup="changed">
            <input v-else v-model="value" class="field_field__3U_Rt" type="text" @change="changed" @keyup="changed">
            <span class="field_label__2eCP7 text-ellipsis" :class="{'required': isRequired(settings.isRequired)}" v-html="settings.label"></span>
            <span class="bg-color-primary"></span>
        </div>
        <span class="field_message__3Z6FX color-quaternary" v-show="settings.errMsg!=''" v-html="settings.errMsg"></span>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'

    export default{
        data(){
            return {
              value: typeof this.settings.value !== 'undefined' ? this.settings.value : '',
              oPlanSettings: typeof this.$store !== 'undefined' && typeof this.$store.getters.getPlanSettings !== 'undefined' ? this.$store.getters.getPlanSettings : {}
            }
        },
        props: ['settings'],
        computed: {
            wrapperClass(){
                return {
                    'field_module__1H6kT field_style2__2Znhe mb-15': 1==1,
                    'active': typeof this.value !== 'undefined' && this.value.length,
                    'disable': typeof this.oPlanSettings['toggle_'+this.settings.key] !== 'undefined' && this.oPlanSettings['toggle_'+this.settings.key] == 'disable'
                }
            }
        },
        watch: {
            settings: {
                handler: function(){
                    if ( this.value !== this.settings.value ){
                        this.value = this.settings.value;
                    }
                },
                deep: true
            }
        },
        methods: {
            isRequired(pattern){
                if ( pattern == 'yes' || pattern === 'true' || pattern === true ){
                    return true;
                }

                return false;
            },
            updateVal(){
                if ( typeof this.oPlanSettings['toggle_'+this.settings.key] !== 'undefined' && this.oPlanSettings['toggle_'+this.settings.key] == 'disable' ){
                    return false;
                }

                this.$parent.$on('update_'+this.settings.key, val => {
                    this.value = val;
                    this.changed();
                })
            },
            changed(){
                this.settings.value = this.value;
                this.$emit('inputChanged', this.value, this.settings);
                this.$emit('input', this.value);
            }
        },
        mounted(){
            this.updateVal();
        }
    }
</script>
