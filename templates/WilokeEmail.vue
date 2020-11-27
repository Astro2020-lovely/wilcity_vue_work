<template>
    <div :class="wrapperClass">
        <div class="field_wrap__Gv92k">
            <input v-if="settings.isRequired" v-model="value" class="field_field__3U_Rt" type="email" required>
            <input v-else v-model="value" class="field_field__3U_Rt" type="email">
            <span class="field_label__2eCP7 text-ellipsis" :class="{'required': settings.isRequired=='yes'}">{{settings.label}}</span>
            <span class="bg-color-primary"></span>
        </div>
        <span class="field_message__3Z6FX color-quaternary" v-if="settings.errMsg">{{settings.errMsg}}</span>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'

    export default{
        data(){
            return {
                oPlanSettings: typeof this.$store !== 'undefined' && typeof this.$store.getters.getPlanSettings !== 'undefined' ? this.$store.getters.getPlanSettings : {},
                value: typeof this.settings.value !== 'undefined' ? this.settings.value : ''
            }
        },
        props: ['settings'],
        computed: {
            wrapperClass(){
                return {
                    'field_module__1H6kT field_style2__2Znhe mb-15': 1==1,
                    'active': this.value.length,
                    'disable': typeof this.oPlanSettings['toggle_'+this.settings.key] !== 'undefined' && this.oPlanSettings['toggle_'+this.settings.key] == 'disable'
                }
            }
        },
        watch: {
            value: 'updateValue'
        },
        mounted(){
            this.autoGetEmail();
        },
        methods:{
            autoGetEmail(){
                this.$parent.$on('update_phone', (email=>{
                    this.value = email;
                }));
            },
            updateValue(){
                this.settings.value = this.value;
                this.$emit('emailChanged', this.value, this.settings);
            }
        }
    }
</script>

