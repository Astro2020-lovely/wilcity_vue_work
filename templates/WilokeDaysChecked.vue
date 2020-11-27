<template>
    <div class="field_module__1H6kT field_style2__2Znhe mb-15 js-field">
        <div :class="getClass" v-for="oDayOfWeek in oDaysOfWeek">
            <label class="checkbox_label__3cO9k">
                <input class="checkbox_inputcheck__1_X9Z" type="checkbox" :value="oDayOfWeek.value" v-model="aDaysChecked" @change="changed">
                <span class="checkbox_icon__28tFk bg-color-primary--checked-after bd-color-primary--checked"><i class="la la-check"></i>
                    <span class="checkbox-iconBg"></span>
                </span>
                <span class="checkbox_text__3Go1u text-ellipsis">{{oDayOfWeek.label}}
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
                oDaysOfWeek: WILCITY_I18.oDaysOfWeek,
                aDaysChecked: [],
                defaultWrapperClass: 'checkbox_module__1K5IS checkbox_inline__6eS6J mb-20 js-checkbox'
            }
        },
        props: {
            wrapperClass: '',
            aChecked: {
                type: Array,
                default: []
            }
        },
        computed:{
            getClass(){
                return typeof this.wrapperClass != 'undefined' ? this.wrapperClass : this.defaultWrapperClass;
            }
        },
        methods: {
            init(){
                this.aDaysChecked = this.aChecked;
            },
            changed(){
                this.$emit('daysCheckedChanged', this.aDaysChecked, this.settings);
            }
        },
        mounted(){
            this.init();
        }
    }
</script>
