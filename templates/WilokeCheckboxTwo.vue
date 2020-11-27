<template>
    <div class="field_module__1H6kT field_style2__2Znhe mb-15 js-field" :class="{error: isReachedMaximum}">
        <div class="row">
            <div v-if="settings.label" class="col-md-12">
                <wiloke-heading :title="settings.label" :desc="settings.desc"></wiloke-heading>
            </div>
            <div v-for="(oOption, index) in settings.options" :class="itemClass">
                <div class="checkbox_module__1K5IS mb-20 js-checkbox">
                    <label class="checkbox_label__3cO9k">
                        <input v-if="isUnChecked(oOption.value) && isReachedMaximum" class="checkbox_inputcheck__1_X9Z" type="checkbox" v-model="settings.value" :value="oOption.value" disabled @change="checkboxTwoChanged">
                        <input v-else class="checkbox_inputcheck__1_X9Z" type="checkbox" v-model="settings.value" :value="oOption.value" @change="changed">
                        <span class="checkbox_icon__28tFk bg-color-primary--checked-after bd-color-primary--checked"><i class="la la-check"></i>
                            <span class="checkbox-iconBg"></span>
                        </span>
                        <span class="checkbox_text__3Go1u text-ellipsis">
                            <span v-html="printLabel(oOption)"></span>
                            <span class="checkbox-border"></span>
                        </span>
                    </label>
                </div>
            </div>
        </div>
        <span class="field_message__3Z6FX color-quaternary" v-show="isReachedMaximum">{{settings.overMaximumTagsWarning}}</span>
    </div>
</template>

<script>
    import WilokeHeading from './WilokeHeading.vue'

    export default{
        data(){
            return {
                isReachedMaximum: false
            }
        },
        components: {
            WilokeHeading
        },
        props: ['settings'],
        computed: {
            itemClass(){
                return this.settings.itemClass !== 'undefined' && this.settings.itemClass == '' ? this.settings.itemClass : 'col-md-6 col-lg-4';
            }
        },
        watch: {
            settings: {
                handler(oNewVal){
                    if ( oNewVal.value.length >= oNewVal.maximum ){
                        this.isReachedMaximum = true;
                    }else{
                        this.isReachedMaximum = false;
                    }

                    this.$emit('checkboxTwoChanged', this.settings.value, this.settings);
                },
                deep: true
            }
        },
        methods:{
            printLabel(oOption){
                if ( typeof oOption.label !== 'undefined' ){
                    let oParse = oOption.label.split('|');
                    return oParse[0];
                }

                return oOption.name;
            },
            isUnChecked(val){
                if ( this.settings.value.length && this.isReachedMaximum ){
                    return this.settings.value.indexOf(val) == -1;
                }
                return false;
            },
            changed(){
                this.$emit('checkboxTwoChanged', this.settings.value, this.settings);
            }
        },
        beforeMount(){
            if ( this.settings.value === '' || (this.settings.value === null) ){
                this.settings.value = []
            }
        },
        mounted(){
        }
    }
</script>
