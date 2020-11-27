<template>
    <div :class="parseWrapperClass">
        <div class="field_wrap__Gv92k">
            <select v-if="settings.isMultiple=='yes'" v-model='selected' :class="selectTwoClass" multiple>
                <option v-for="oOption in aOptions" :value="oOption.value" v-html="oOption.name" :class="printOptionClass(oOption)" :data-options="dataOptions(oOption)"></option>
            </select>
            <select v-else v-model='selected' :class="selectTwoClass">
                <option v-for="oOption in aOptions" :value="oOption.value" :class="printOptionClass(oOption)" v-html="oOption.name" :data-options="dataOptions(oOption)"></option>
            </select>
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
                aTermOptions: null,
                defaultVal: null,
                aOptions: [],
                at: 0,
                isOpening: false
            }
        },
        watch: {
            aOptions: {
                handler: function(newVal){
                    this.selectTwo();
                },
                deep: true
            }
        },
        props: {
            'settings':{
                type: Object,
                default: {}
            },
            wrapperClass: {
                type: String,
                default: ''
            },
            target: {
                type: String,
                default: 'id'
            },
            postType: {
                type: String,
                default: ''
            },
            cacheAt: {
                type: Number,
                default: 0
            }
        },
        components: {
            WilokeHeading
        },
        computed:{
            parseWrapperClass(){
                let wrapperClass = this.wrapperClass;

                if ( !wrapperClass.length ){
                    wrapperClass = 'field_module__1H6kT field_style2__2Znhe mb-15';
                }
                return (this.selected != null && this.selected.length) || this.isOpening ? wrapperClass + ' active' : wrapperClass;
            },
            selectTwoClass(){
                let createClass = 'js-select-2';
                if ( this.settings.isAjax && this.settings.isAjax == 'yes' ){
                    createClass += ' is-ajax';
                }

                return createClass;
            }
        },
        methods:{
            getOptions(){
                let cacheKey = this.settings.key;
                if ( this.postType !== '' ){
                    cacheKey = cacheKey + '_'+this.postType;
                }
                let aOptions = this.$store.getters.getTermOptions(cacheKey);
                if ( !aOptions ){
                    this.fetchAjaxOptions();
                }else{
                    if ( ( this.cacheAt !== 0 && this.cacheAt > aOptions.at ) ){
                        this.fetchAjaxOptions();
                    }else{
                        this.at = this.aOptions.at;
                    }
                    this.$set(this.$data, 'aOptions', aOptions.terms);
                }
            },
            dataOptions(oOption){
                return JSON.stringify(oOption);
            },
            resetValue(){
                this.$parent.$on('resetEverything', ()=>{
                    this.selected = this.defaultVal;
                    jQuery(this.$el).find('.js-select-2').val(this.selected).trigger('change');
                    this.$emit('term-changed', this.selected, this.settings);
                });
            },
            setDefault(){
                if ( this.settings.isMultiple === 'yes' ){
                    this.selected = typeof this.settings.value !== 'undefined' && this.settings.value.length ? this.settings.value : [];
                }else{
                    this.selected = !WilCityHelpers.isNull(this.settings.value) ? this.settings.value : '';
                }
                this.defaultVal = this.selected;
            },
            updateValue(val){
                if ( typeof val == 'undefined' || val === null ){
                    this.selected = this.settings.isMultiple == 'yes' ? [] : '';
                    this.settings.value  = this.selected;
                    this.$emit('term-changed', this.settings.value, this.settings);
                    return true;
                }

                if ( this.settings.isMultiple == 'yes' ){
                    this.selected = val;
                    this.settings.value = this.selected;
                    this.$emit('term-changed', this.settings.value, this.settings);
                }else{
                    if ( this.selected == val ){
                        return false;
                    }
                    this.selected = val;
                    this.settings.value = this.selected;
                    this.$emit('term-changed', this.settings.value, this.settings);
                }
            },
            printOptionClass(oOption){
                return typeof oOption.parent!== 'undefined' && oOption.parent !== 0 ? 'has-parent-term' : '';
            },
            maximumSelectionLength(){
                if ( this.settings.maximum ){
                    return this.settings.maximum;
                }

                return 10000;
            },
            createState(state){
                let treeItemClass = jQuery(state.element).hasClass('has-parent-term') ? 'has-parent-term' : '';

                let oOptions = typeof state.oIcon !== 'undefined' ? state :  JSON.parse(state.element.dataset.options), el='';

                if ( typeof oOptions.oIcon !== 'undefined' ){
                    if ( oOptions.oIcon.type == 'icon' ){
                        el = '<div class="wilcity-search-wrapper-suggestion-item '+treeItemClass+'"><div class="icon-box-1_icon__3V5c0 rounded-circle" style="background-color: '+oOptions.oIcon.color+'"><i class="'+oOptions.oIcon.icon+'"></i></div><div class="icon-box-1_text__3R39g">'+state.text+'</div></div>';
                    }else{
                        el = '<div class="wilcity-search-wrapper-suggestion-item '+treeItemClass+'"><div class="icon-box-1_icon__3V5c0 bg-transparent bg-cover" style="background-image: url('+oOptions.oIcon.url+')"><img src="'+oOptions.oIcon.url+'"></div><div class="icon-box-1_text__3R39g">'+state.text+'</div></div>';
                    }
                }else{
                    el = '<div class="wilcity-search-wrapper-suggestion-item '+treeItemClass+'"><div class="icon-box-1_text__3R39g">'+state.text+'</div></div>';
                }
                return jQuery(el);
            },
            selectTwo(){
                this.$select2 = jQuery(this.$el).find('.js-select-2');
                if ( typeof this.$select2.data('select2') !== 'undefined' ){
                    this.$select2.select2('destroy');
                }
                if ( this.$select2.hasClass('is-ajax') || this.settings.isAjax == 'yes' ){
                    let self = this;
                    let oArgs = {
                        action: this.settings.ajaxAction,
                        taxonomy: this.settings.key,
                        get: this.target
                    };

                    if ( typeof this.settings.ajaxArgs !== 'undefined' ){
                        oArgs = Object.assign({}, oArgs, this.settings.ajaxArgs);
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
                        templateResult: (state)=>{
                            if (!state.id) {
                                return state.text;
                            }
                            return this.createState(state);
                        },
                        templateSelection: (repo)=>{
                            return repo.text.replace('&amp;', '&');
                        },
                        allowClear: true,
                        placeholder: '',
                        minimumInputLength: 1
                    };
                    if ( typeof WILCITY_SELECT2_LENG !== 'undefined' ){
						oConfiguration.language = WILCITY_SELECT2_LENG;
                    }

                    this.$select2.select2(oConfiguration).on('select2:open', (event=>{
                        jQuery(event.currentTarget).closest('.field_module__1H6kT').addClass('active');
                    })).on('change', (event=>{
                        this.updateValue(jQuery(event.currentTarget).val());
                    })).on('select2:opening', (event=>{
                        this.isOpening = true;
                    })).on('select2:closing', (event=>{
                        this.isOpening = false;
                    }));

                }else{
                    if ( this.aOptions === null || typeof this.aOptions === 'undefined' || !this.aOptions  ){
                        return false;
                    }
                    let oConfiguration = {
                        templateResult:(state)=>{
                            if (!state.id) {
                                return state.text;
                            }
                            return this.createState(state);
                        },
                        templateSelection: function(repo){
                            return repo.text.replace('&amp;', '&');
                        },
                        allowClear: true,
                        placeholder: '',
                        cache: false,
                        maximumSelectionLength: this.maximumSelectionLength()
                    };
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
                    })).on('select2:opening', (event=>{
                        this.isOpening = true;
                    })).on('select2:closing', (event=>{
                        this.isOpening = false;
                    }));
                }
                this.triggerDefault();
            },
            triggerDefault(){
                if (!WilCityHelpers.isNull(this.settings.value)){
                    this.$select2.closest('.field_module__1H6kT').addClass('active');
                }
            },
            fetchAjaxOptions(){
                if ( this.settings.isAjax == 'yes' ){
                    this.selectTwo();
                    return false;
                }

                let cacheKey = this.settings.key;
                if ( this.postType !== '' ){
                    cacheKey = cacheKey + '_'+this.postType;
                }

                let orderBy = 'count', order='DESC', isHideEmpty = 0;

                if ( typeof this.settings !== 'undefined' ){
                    if ( typeof this.settings.orderBy !== 'undefined'  ){
                        orderBy = this.settings.orderBy;
                    }

                    if ( typeof this.settings.order !== 'undefined'  ){
                        order = this.settings.order;
                    }

                    if ( typeof this.settings.isHideEmpty !== 'undefined'  ){
                        isHideEmpty = this.settings.isHideEmpty;
                    }
                }

                jQuery.ajax({
                    type: 'POST',
                    url: WILOKE_GLOBAL.ajaxurl,
                    data: {
                        action: 'wilcity_fetch_terms_options',
                        taxonomy: this.settings.key,
                        postType: this.postType,
                        orderBy: orderBy,
                        order: order,
                        isHideEmpty: isHideEmpty,
                        isShowParentOnly: this.settings.isShowParentOnly,
                        at: this.at
                    },
                    success: response => {
                        if ( response.data.action  == 'update_new_terms' ){
                            this.$store.commit('updateTermOptions', {
                                key: cacheKey,
                                at: response.data.at,
                                terms: response.data.terms
                            });

                            this.$set(this.$data, 'aOptions', response.data.terms);
                        }
                    }
                })
            }
        },
        mounted(){
            this.resetValue();
            this.getOptions();
        },
        beforeMount(){
            this.setDefault();
        }
    }
</script>
