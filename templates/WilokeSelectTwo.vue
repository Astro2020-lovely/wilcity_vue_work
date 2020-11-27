<template>
    <div :class="parseWrapperClass">
        <div class="field_wrap__Gv92k">
            <div v-if="!isAjax">
                <select v-if="settings.isMultiple=='yes'" v-model='selected' :class="selectTwoClass" multiple>
                    <option v-for="option in aOptions" :value="printOptionValue(option)" v-html="printOptionName(option)" :class="printOptionClass(option)"></option>
                </select>
                <select v-else v-model='selected' :class="selectTwoClass">
                    <option v-for="option in aOptions" :value="printOptionValue(option)" :class="printOptionClass(option)" v-html="printOptionName(option)"></option>
                </select>
            </div>
            <div v-else>
                <select v-if="settings.isMultiple=='yes'" v-model='selected' :class="selectTwoClass" multiple>
                    <option selected v-for="option in aOptions" :value="printOptionValue(option)" v-html="printOptionName(option)" :class="printOptionClass(option)"></option>
                </select>
                <select v-else v-model='selected' :class="selectTwoClass">
                    <option selected v-for="option in aOptions" :value="printOptionValue(option)" :class="printOptionClass(option)" v-html="printOptionName(option)"></option>
                </select>
            </div>
            <span class="field_label__2eCP7 text-ellipsis" :class="{required: settings.isRequired=='yes'}">{{settings.label}}</span>
            <span class="bg-color-primary"></span>
        </div>
        <span class="field_message__3Z6FX color-quaternary" v-if="settings.errMsg">{{settings.errMsg}}</span>
    </div>
</template>
<script>
    import WilokeHeading from './WilokeHeading.vue'
    import {mapState} from 'vuex'
    import {mapGetters} from 'vuex'

    export default {
        data(){
            return {
                isTax: null,
                optionClass: null,
                selected: null,
                $select2: null,
                defaultVal: null,
                isMultiple: typeof this.settings.maximum !== 'undefined' && this.settings.maximum > 1
            }
        },
        components: {
            WilokeHeading
        },
        props: {
            cId: {
                type: String,
                default: '',
                required: false
            },
            settings:{
                type: Object,
                default: {},
                required: false
            },
            wrapperClass: {
                type: String,
                default: '',
                required: false
            },
            aRawOptions: {
                type: Array,
                default: () => []
            }
        },
        computed:{
            parseWrapperClass(){
                let wrapperClass = this.wrapperClass;
                if ( !wrapperClass.length ){
                    wrapperClass = 'field_module__1H6kT field_style2__2Znhe mb-15';
                }

                if ( this.cId.length ){
                    wrapperClass += ' ' + this.cId;
                }
                if ( this.isMultiple ){
                    return this.selected.length ? wrapperClass + ' active' : wrapperClass;
                }else{
                    return this.selected != null && this.selected != '' ? wrapperClass + ' active' : wrapperClass;
                }
            },
            isAjax(){
                return this.settings.isAjax && this.settings.isAjax == 'yes';
            },
            selectTwoClass(){
                let createClass = 'js-select-2';
                if ( this.isAjax ){
                    createClass += ' is-ajax';
                }

                return createClass;
            },
            aOptions(){
                if ( typeof this.$store !== 'undefined' && typeof this.$store.state.aNewBusinessHoursOptions !== 'undefined' && this.$store.state.aNewBusinessHoursOptions.aHours.length && this.$store.state.aNewBusinessHoursOptions.cId == this.cId ){
                    return this.$store.state.aNewBusinessHoursOptions.aHours;
                }else{
                    if ( this.aRawOptions.length ){
                        return this.aRawOptions;
                    }else{
                        if ( this.settings.terms ){
                            return typeof this.settings.terms == 'string' ? JSON.parse(this.settings.terms) : this.settings.terms;
                        }else{
                            if ( this.settings.options ){
                                return typeof this.settings.options == 'string' ? JSON.parse(this.settings.options) : this.settings.options;
                            }else{
                                return {};
                            }
                        }
                    }
                }
            }
        },
        methods:{
            resetValue(){
                this.$parent.$on('resetEverything', ()=>{
                    if ( this.settings.key != 'post_type' ){
                        jQuery(this.$el).find('.js-select-2').val(this.defaultVal).trigger('change');
                        this.$emit('selectTwoChanged', this.defaultVal, this.settings);
                    }
                });
            },
            setDefault(){
                if ( this.settings.isMultiple == 'yes' ){
                     if ( !WilCityHelpers.isNull(this.settings.value) ){
                        let typeOfVal = typeof this.settings.value;
                        if ( typeOfVal == 'number' ){
                            this.selected = [this.settings.value];
                        }else if(typeOfVal == 'string'){
                            this.selected = this.settings.value.split(',');
                        }else{
                            this.selected = this.settings.value;
                        }
                        this.settings.value = this.selected;
                    }else{
                        this.selected = [];
                    }
                }else{
                    if ( !WilCityHelpers.isNull(this.settings.value) ){
                        if ( typeof this.settings.value == 'object' ){
                            this.selected = this.selected.value[0];
                        }else{
                            this.selected = this.settings.value;
                        }
                    }else{
                        this.selected = '';
                    }
                }
                this.defaultVal = this.selected;
            },
            updateValue(val){
                if ( typeof val == 'undefined' ){
                    return false;
                }

                if ( val === null ){
                    val = this.settings.isMultiple == 'yes' ? [] : '';
                }

                if ( this.settings.isMultiple == 'yes' ){
                    this.selected = val;
                    this.settings.value = this.selected;
                }else{
                    if ( this.selected == val ){
                        return false;
                    }
                    this.selected = val;
                    this.settings.value = this.selected;
                }
                this.$emit('selectTwoChanged', this.settings.value, this.settings);
                this.$emit('select-two-changed', this.settings.value, this.settings);
                this.$emit('input', this.value);
            },
            printOptionValue(option){
                return typeof option.value !== 'undefined' ? option.value : option;
            },
            printOptionName(option){
                let rawOption = typeof option.name !== 'undefined' ? option.name : option;
                let aParse = rawOption.split('|');
                return aParse[0];
            },
            printOptionClass(option){
                return typeof option.parent!== 'undefined' && option.parent !== 0 ? 'has-parent-term' : '';
            },
            maximumSelectionLength(){
                if ( this.settings.maximum ){
                    return this.settings.maximum;
                }

                return 10000;
            },
            parseAjaxArgs(){
                if ( typeof this.settings === 'undefined' ){
                    return false;
                }

                let oGetAjaxArgs = {}, hasArgs = false;

                for ( let key in this.settings ){
                    if ( key.indexOf('ajaxArgs.') !== -1 ){
                        oGetAjaxArgs[key.replace('ajaxArgs.', '')] = this.settings[key];
                        hasArgs = true;
                    }
                }

                return hasArgs ? oGetAjaxArgs : false;
            },
            selectTwo(){
                this.$select2 = jQuery(this.$el).find('.js-select-2');
                if ( this.$select2.data('select2') ){
                    this.$select2.select2('destroy');
                }

                if ( this.$select2.hasClass('is-ajax') ){
                    let self = this;
                    let oArgs = {
                        action: this.settings.ajaxAction
                    };

                    if ( typeof this.settings.ajaxArgs !== 'undefined' ){
                        oArgs = Object.assign({}, oArgs, this.settings.ajaxArgs);
                    }

                    if ( typeof this.settings.eventParents !== 'undefined' ){
                        if ( typeof this.settings.ajaxArgs === 'undefined' ){
                            this.settings.ajaxArgs = {};
                        }

                        this.settings.ajaxArgs.postTypes = this.settings.eventParents;
                        oArgs = Object.assign({}, oArgs, this.settings.ajaxArgs);
                    }

                    let oOtherAjaxArgs = this.parseAjaxArgs();

                    if ( oOtherAjaxArgs ){
                       oArgs = Object.assign({}, oArgs, oOtherAjaxArgs);
                    }

                    let oConfiguration = {
                        ajax:{
                            url: WILOKE_GLOBAL.ajaxurl,
                            data: function (params) {
                                return Object.assign({}, {search: params.term}, oArgs);
                            },
                            processResults: function (data, params) {
                                if ( !data.success ){
                                    return false;
                                }else{
                                    return data.data.msg;
                                }
                            },
                            cache: true
                        },
                        templateSelection: (repo)=>{
                            return repo.text.replace('&amp;', '&');
                        },
                        minimumInputLength: 1,
                        placeholder: '',
                        allowClear: true
                    };
                    if ( typeof WILCITY_SELECT2_LENG !== 'undefined' ){
						oConfiguration.language = WILCITY_SELECT2_LENG;
                    }
                    this.$select2.select2(oConfiguration).on('select2:open', (event=>{
                        jQuery(event.currentTarget).closest('.field_module__1H6kT').addClass('active');
                    })).on('select2:close', (event=>{
                        this.updateValue(jQuery(event.currentTarget).val());
                    }));
                }else{
                    let oConfiguration = {
                        templateResult: function(state){
                            if (!state.id) {
                                return state.text;
                            }

                            let treeItemClass = jQuery(state.element).hasClass('has-parent-term') ? 'has-parent-term' : '';

                            let $state = jQuery('<span class="'+treeItemClass+'">'+state.text+'</span>');
                            return $state;
                        },
                        templateSelection: function(repo){
                            return repo.text.replace('&amp;', '&');
                        },
                        allowClear: true,
                        placeholder: ''
                    };

                    if ( typeof this.settings !== 'undefined' && typeof this.settings.key !== 'undefined' && this.settings.key == 'post_type'  ){
                        oConfiguration.allowClear = false;
                    }

                    if ( this.isMultiple ){
                        oConfiguration.maximumSelectionLength = this.maximumSelectionLength();
                    }

                    if ( typeof WILCITY_SELECT2_LENG !== 'undefined' ){
						oConfiguration.language = WILCITY_SELECT2_LENG;
                    }

                    this.$select2.select2(oConfiguration).on('change', (event=>{
                        let $select2 = jQuery(event.currentTarget);
                        $select2.closest('.field_module__1H6kT').addClass('active');
                        let val = $select2.val();
                        if (WilCityHelpers.isNull(val)){
                            $select2.closest('.field_module__1H6kT').removeClass('active');
                        }else{
                            $select2.closest('.field_module__1H6kT').find('.select2-selection__rendered').attr('style', '');
                        }
                        this.updateValue(val);
                    }));
                }

                if (typeof this.$store !== 'undefined') {
                    this.$store.commit('updateSelect2Store', this.$select2);
                }

                this.triggerDefault();
            },
            triggerDefault(){
                if (!WilCityHelpers.isNull(this.settings.value)){
                    this.$select2.closest('.field_module__1H6kT').addClass('active');
                }
            },
            updateOptions(){
                this.$parent.$on('onUpdateOptions', (options)=>{
                    this.settings.options = options;
                    this.triggerDefault();
                })
            }
        },
        mounted(){
            this.selectTwo();
            this.resetValue();
            this.updateOptions();
        },
        updated(){
            this.selectTwo();
        },
        beforeMount(){
            this.setDefault();
        }
    }
</script>
