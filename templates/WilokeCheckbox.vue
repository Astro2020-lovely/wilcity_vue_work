<template>
    <div class="field_module__1H6kT field_style2__2Znhe mb-15">
        <div :class="getClass">
            <label class="checkbox_label__3cO9k">
                <input class="checkbox_inputcheck__1_X9Z" type="checkbox" v-model="checked" @change="changed" true-value="yes" false-value="no">
                <span class="checkbox_icon__28tFk bg-color-primary--checked-after bd-color-primary--checked"><i class="la la-check"></i>
                    <span class="checkbox-iconBg"></span>
                </span>
                <span class="checkbox_text__3Go1u text-ellipsis"><span v-html="settings.label"></span>
                    <span class="checkbox-border"></span>
                </span>
            </label>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                defaultWrapperClass: 'checkbox_module__1K5IS checkbox_toggle__vd6vd checkbox_full__jTSmg  mb-20',
                checked: this.settings.value
            }
        },
        props: {
            settings: {
                type: Object,
                default: {}
            },
            wrapperClass: ''
        },
        computed:{
            getClass(){
                return typeof this.wrapperClass != 'undefined' ? this.wrapperClass : this.defaultWrapperClass;
            }
        },
        methods: {
            changed(){
                this.settings.value = this.checked;
                this.$emit('checkboxChanged', this.checked, this.settings);
            }
        }
    }
</script>
