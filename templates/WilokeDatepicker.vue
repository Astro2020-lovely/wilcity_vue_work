<template>
    <div :class="fieldClass">
        <div class="field_wrap__Gv92k">
            <input v-if="settings.isRequired" v-model="value" class="field_field__3U_Rt notranslate wilcity_datepicker" type="text" @change="updatedDatepicker"/>
            <input v-else v-model="value" class="field_field__3U_Rt wilcity_datepicker" type="text" @change="updatedDatepicker"/>
            <span class="field_label__2eCP7 text-ellipsis">{{settings.label}}</span><span class="bg-color-primary"></span>
            <div class="field_right__2qM90 pos-a-center-right"><span class="field_icon__1_sOi"><i class="la la-calendar-check-o"></i></span></div>
        </div>
        <span class="field_message__3Z6FX color-quaternary" v-if="settings.errMsg">{{settings.errMsg}}</span>
    </div><!-- End / field_module__1H6kT -->
</template>
<script>
    export default{
        data(){
            return {
                value: typeof this.settings.value !== 'undefined' ? this.settings.value : ''
            }
        },
        props: {
            settings: {
                type: Object,
                value: '',
                label: '',
                isRequired: 'no'
            },
            wrapperClass: {
                type: String,
                default: 'field_module__1H6kT field_style2__2Znhe mb-15'
            }
        },
        computed:{
            parseWrapperClass(){
                return this.selected != null && this.selected.length ? this.wrapperClass + ' active' : this.wrapperClass;
            },
            fieldClass(){
                return this.value.length ? this.wrapperClass + ' active' :  this.wrapperClass;
            }
        },
        methods: {
            updatedDatepicker(){
                this.settings.value = this.value;
                this.$emit('datepickerChanged', this.value, this.settings);
            },
            datepicker(){
                let self = this,
                    $datepicker = jQuery(this.$el).find('.wilcity_datepicker');

                $datepicker.datepicker({
                    dateFormat: WILOKE_INLINE_GLOBAL.datePickerFormat,
                    onSelect: function(dateText){
                        self.value = dateText;
                        self.$emit('input', self.value);
                        self.updatedDatepicker();
                    }
                });

                if ( typeof WILCITY_DATE_PICKER !== 'undefined' ){
                    $datepicker.datepicker('option', jQuery.datepicker.regional[WILCITY_DATE_PICKER]);
                    $datepicker.datepicker('option', 'dateFormat', WILOKE_INLINE_GLOBAL.datePickerFormat);
                }
            },
            reset(){
                this.$parent.$on('resetEverything', ()=>{
                    this.$set(this.$data, 'value', '');
                })
            }
        },
        mounted(){
            this.datepicker();
            this.reset();
        }
    }
</script>
