<template>
    <div class="checkbox_module__1K5IS checkbox_full__jTSmg mb-15 js-checkbox">
        <label class="checkbox_label__3cO9k">
            <input class="checkbox_inputcheck__1_X9Z" type="checkbox" v-model="status" true-value="yes" false-value="no" @change="changed">
            <span class="checkbox_icon__28tFk bg-color-primary--checked-after bd-color-primary--checked"><i class="la la-check"></i>
                <span class="checkbox-iconBg"></span>
            </span>
            <span class="checkbox_text__3Go1u text-ellipsis"><span v-html="settings.label"></span>
                <span class="checkbox-border"></span>
            </span>
        </label>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'

    export default{
        data(){
            return {
                 originalVal: this.settings.value,
                 status: this.value.length ? this.value : this.settings.value
            }
        },
        props: {
            settings: {
                type: Object,
                default: {}
            },
            wrapperClass: '',
            value: {
                type: String,
                default: ''
            }
        },
        methods: {
            changed(){
                this.settings.value = this.status;
                this.$emit('checkboxChanged', this.status, this.settings);
            },
            resetValue(){
                this.$parent.$on('resetEverything', ()=>{
                    if(this.status !== this.originalVal) {
                        this.status = this.originalVal;
                        this.changed();
                    }
                });

                this.$parent.$on('changeCheckboxVal', (oVal)=>{
                    if ( typeof oVal[this.settings.key] !== 'undefined' ){
                        this.status = oVal[this.settings.key];
                    }
                });
            }
        },
        mounted(){
            this.resetValue();
        }
    }
</script>
