<template>
    <div>
        <div :class="wrapperClass">
            <div class="field_wrap__Gv92k">
                <select v-if="settings.isMultiple=='yes'" v-model="selectedCat" :class="selectTwoClass" multiple @change="fetchTags">
                    <option v-for="option in options" :value="printOptionValue(option)" :class="printOptionClass(option)" v-html="option.name"></option>
                </select>
                <select v-else v-model="selectedCat" :class="selectTwoClass" @change="fetchTags">
                    <option v-for="option in options" :value="printOptionValue(option)" :class="printOptionClass(option)" v-html="option.name"></option>
                </select>
                <span class="field_label__2eCP7 text-ellipsis" :class="{required: settings.isRequired=='yes'}">{{settings.label}}</span>
                <span class="bg-color-primary"></span>
            </div>
            <span class="field_message__3Z6FX color-quaternary" v-if="settings.errMsg">{{settings.errMsg}}</span>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {mapGetters} from 'vuex'

    export default {
        data(){
            return {
                isTax: null,
                optionClass: null,
                isFetchingAjax: null,
                aSelectedTags: typeof this.settings.tags !== 'undefined' && this.settings.tags.length ? this.settings.tags : [],
                isMultiple: typeof this.settings.maximum !== 'undefined' && this.settings.maximum > 1,
                selectedCat: this.parseSelectCat(),
                aTagsCache: []
            }
        },
        watch: {
            aSelectedTags: 'updateTags'
        },
        props: {
            settings:{
                type: Object,
                default: {}
            },
            target:{
                type: String,
                default: ''
            },
            listingType: {
                type: String,
                default:''
            }
        },
        computed:{
            wrapperClass(){
                return (this.isMultiple && this.selectedCat.length) || (!this.isMultiple && this.selectedCat!='') ? 'field_module__1H6kT field_style2__2Znhe mb-15 active' : 'field_module__1H6kT field_style2__2Znhe mb-15';
            },
            selectTwoClass(){
                let createClass = 'wilcity-select2';
                if ( this.settings.isAjax && this.settings.isAjax == 'yes' ){
                    createClass += ' is-ajax';
                }
                return createClass;
            },
            options(){
                if ( this.settings.terms ){
                    return this.settings.terms;
                }
                return this.settings.options;
            }
        },
        methods:{
            parseSelectCat(){
                let isMultiple = this.settings.maximum > 1;
                if ( typeof this.settings.category !== 'undefined' ){
                    return isMultiple ? this.settings.category.split(',') : this.settings.category;
                }
                if ( isMultiple ){
                    return [];
                }else{
                    return '';
                }
            },
            fetchTags(){
                if ( this.$store.getters.getTagsBelongsToCat(this.selectedCat) ){
                    this.$store.commit('updateSelectedCat', this.selectedCat);
                   return true;
                }

                if ( this.isFetchingAjax !== null && this.isFetchingAjax.status !== 200 ){
                    this.isFetchingAjax.abort();
                }

                this.isFetchingAjax = jQuery.ajax({
                    type: 'POST',
                    url: WILOKE_GLOBAL.ajaxurl,
                    data: {
                        action: 'fetch_tags_of_listing_cat',
                        termID: this.selectedCat,
                        listingType: typeof WILCITY_ADDLISTING !== 'undefined' && WILCITY_ADDLISTING.listingType !== 'undefined' ? WILCITY_ADDLISTING.listingType : ''
                    },
                    success: (response=>{
                        let aTags = [];
                        if ( response.success ){
                            aTags = response.data;
                        }
                        this.$store.commit('updateSelectedCat', this.selectedCat);
                        this.$store.commit('updateTagsBelongsToCat', aTags);
                    })
                })
            },
            updateValue(val){
                if ( val === null || !val.length ){
                    this.selectedCat = this.isMultiple ? [] : '';
                }else{
                    this.selectedCat = val;
                }
                this.settings.value     = this.selectedCat;
                this.settings.category  = this.selectedCat;
                this.$emit('selectTwoChanged', this.selectedCat, this.settings);
                if ( !WilCityHelpers.isNull(this.selectedCat) ){
                    this.fetchTags();
                }
            },
            updateTags(){
                this.settings.tags = this.aSelectedTags;
            },
            printOptionValue(option){
                return typeof option.value !== 'undefined' ? option.value : option;
            },
            printOptionName(option){
                return typeof option.name !== 'undefined' ? option.name : option;
            },
            printOptionClass(option){
                if ( this.isTax ){
                    if ( option.parent!==0 ){
                        return 'has-parent-term';
                    }
                }
                return '';
            },
            maximumSelectionLength(){
                if ( this.settings.maximum ){
                    return this.settings.maximum;
                }

                return 10000;
            },
            selectTwo(){
                let $select2 = jQuery(this.$el).find('.wilcity-select2');

                if ( $select2.hasClass('is-ajax') ){
                    let taxonomy = this.target;

                    let oConfiguration = {
                        ajax:{
                            url: WILOKE_GLOBAL.ajaxurl,
                            data: (params=> {
                              return {
                                search: params.term,
                                action: 'wilcity_select2_fetch_term',
                                taxonomy: taxonomy,
                                postType: this.listingType
                              };
                            }),
                            processResults: function (data, params) {
                                if ( !data.success ){
                                    return false;
                                }else{
                                    return data.data.msg;
                                }
                            },
                            cache: true
                        },
                        minimumInputLength: 1,
                        templateResult: function(repo){
                            return repo.text.replace('&amp;', '&');
                        },
                        templateSelection: function(repo){
                            return repo.text.replace('&amp;', '&');
                        }
                    };
                    if ( this.isMultiple ){
                        oConfiguration.maximumSelectionLength = this.maximumSelectionLength();
                    }

                    if ( typeof WILCITY_SELECT2_LENG !== 'undefined' ){
						oConfiguration.language = WILCITY_SELECT2_LENG;
					}

                    $select2.select2(oConfiguration).on('select2:close', (event=>{
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
                        }
                    };

                    if ( typeof WILCITY_SELECT2_LENG !== 'undefined' ){
						oConfiguration.language = WILCITY_SELECT2_LENG;
                    }

                    if ( this.isMultiple ){
                        oConfiguration.maximumSelectionLength = this.maximumSelectionLength();
                        oConfiguration.placeholder = '';
                        oConfiguration.allowClear  = true;
                    }

                    $select2.select2(oConfiguration).on('select2:close', (event=>{
                        let $select2 = jQuery(event.currentTarget);
                        let val = $select2.val();
                        this.updateValue(val);
                    }));
                }
            }
        },
        mounted(){
            this.selectTwo();
            if ( !WilCityHelpers.isNull(this.settings.category) ){
                this.fetchTags();
            };
        }
    }
</script>