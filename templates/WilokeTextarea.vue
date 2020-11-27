<template>
    <div :class="wrapperClass">
        <div class="field_wrap__Gv92k">
            <textarea v-if="settings.isRequired=='yes'" v-model="value" class="field_field__3U_Rt" ></textarea>
            <textarea v-else v-model="value" class="field_field__3U_Rt"></textarea>
            <span class="field_label__2eCP7 text-ellipsis" :class="{required: settings.isRequired=='yes'}">{{settings.label}}</span>
            <span class="bg-color-primary"></span>
        </div>
        <span class="field_message__3Z6FX color-quaternary" v-show="settings.errMsg!=''">{{settings.errMsg}}</span>
    </div>
</template>
<script>
    export default{
        data(){
            return {
              value: typeof this.settings.value !== 'undefined' ? this.settings.value : '',
              oPlanSettings: typeof this.$store !== 'undefined' && typeof this.$store.getters.getPlanSettings !== 'undefined' ? this.$store.getters.getPlanSettings : {}
            }
        },
        props: ['settings'],
        watch: {
            value: function(val){
                this.settings.value = val;
                this.$emit('textareaChanged', val, this.settings);
                this.$emit('input', val);
            }
        },
        computed: {
            wrapperClass(){
                return {
                    'field_module__1H6kT field_style2__2Znhe field-autoHeight mb-15': 1==1,
                    'active': this.value.length,
                    'disable': typeof this.oPlanSettings['toggle_'+this.settings.key] !== 'undefined' && this.oPlanSettings['toggle_'+this.settings.key] == 'disable'
                }
            }
        }
    }
</script>
