<template>
    <div :class="wrapperClass">
        <div class="field_wrap__Gv92k">
            <div class="spetrum-wrapper">
                <input v-model="value" class="field_field__3U_Rt wilcity-colorpicker-field" type="text" @keyup="changed">
                <span class="field_label__2eCP7 text-ellipsis">{{settings.label}}</span>
            </div>
            <span class="bg-color-primary"></span>
        </div>
        <span class="field_message__3Z6FX color-quaternary" v-show="settings.errMsg!=''">{{settings.errMsg}}</span>
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
                    'active': this.value.length,
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
            changed(){
                this.settings.value = this.value;
                this.$emit('inputChanged', this.value, this.settings);
                this.$emit('input', this.value);
            },
            runColorPicker(){
               jQuery(this.$el).find('.wilcity-colorpicker-field').spectrum({
                    showAlpha: true,
                    showInput: true,
                    allowEmpty:true,
                    change: (color)=>{
                        this.value = color.toHexString();
                        this.changed();
                    }
               });
            }
        },
        mounted(){
            this.runColorPicker();
        }
    }
</script>
