<template>
    <div :class="parseWrapperClass">
        <div class="field_wrap__Gv92k">
            <input class="field_field__3U_Rt" type="text" ref="wpsearch" v-model="s" v-on:keydown.enter.prevent="submitSearchForm" @keyup="changedValue" v-on:input="s = $event.target.value" autocomplete="off" readonly="" @focus="onFocus"/>
            <span class="field_label__2eCP7 text-ellipsis">{{label}}</span>
            <span class="bg-color-primary"></span>
            <div class="field_right__2qM90 pos-a-center-right">
                <span class="field_icon__1_sOi"><i class="la la-search"></i></span>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                s: this.value,
                onSearchChanged: null
            }
        },
        props: {
            label: {
                default: '',
                type: String
            },
            value: {
                default: '',
                type: String
            },
            wrapperClass: {
                default: 'field_module__1H6kT field_style2__2Znhe mb-15 select-text',
                type: String
            }
        },
        computed: {
            parseWrapperClass(){
                if ( this.s.length ){
                    return this.wrapperClass + ' active';
                }
                return this.wrapperClass;
            }
        },
        mounted(){
            this.resetValue();
        },
        methods: {
            onFocus(e) {
                let target = e.target;
                target.removeAttribute('readonly');
            },
            submitSearchForm(){
                this.$parent.$emit('submitSearchForm');
            },
            resetValue(){
                this.$parent.$on('resetEverything', ()=>{
                    this.s = '';
                    this.$emit('changedValue', this.s, {key: 'wp_search'});
                });
            },
            changedValue(){
                this.$emit('changedValue', this.s, {key: 'wp_search'});
            }
        }
    }
</script>
