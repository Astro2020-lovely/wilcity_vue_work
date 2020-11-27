<template>
    <div class="popup_module__3M-0- pos-f-full popup_md__3El3k popup_mobile-full__1hyc4" data-popup-content="createEvent">
        <div class="wil-overlay js-popup-overlay"></div>
        <div class="wil-tb">
            <div class="wil-tb__cell">
                <div class="popup_content__3CJVi">
                    <header class="popup_header__2QTxC clearfix">
                        <h3 class="popup_title__3q6Xh"><i class="la"></i>
                            <span>{{popupTitle}}</span>
                        </h3>
                        <div class="popup_headerRight__c4FcP">
                            <span class="popup_close__mJx2A color-primary--hover js-toggle-close"><i class="la la-close"></i>
                            </span>
                        </div>
                    </header>
                    <div v-if="oData" class="popup_body__1wtsy wil-scroll-bar">

                        <div v-show="isSubmitting" class="line-loading_module__SUlA1 pos-a-top">
                            <div class="line-loading_loader__FjIcM"></div>
                            <div class="core-code-html" style="height: 0; overflow: hidden; visibility: hidden;"><span data-toggle-html-button="line-loading_module__SUlA1 pos-a-top" data-title="line-loading_module" data-toggle-number-button="65"></span>
                            </div>
                        </div>

                        <div class="promo-item_module__24ZhT">
                            <div class="promo-item_group__2ZJhC">
                                <h3 class="promo-item_title__3hfHG" v-html="oTranslation.basicInfoEvent"></h3>
                                <p class="promo-item_description__2nc26" v-html="oTranslation.basicInfoEventDesc"></p>
                            </div>
                        </div>

                        <wiloke-upload-img @uploadImgChanged="imageChanged" :settings="{wrapperClassName: 'field_module__1H6kT field_style2__2Znhe mb-15 js-field', isMultiple: false, value:oData.img}"></wiloke-upload-img>
                        <wiloke-input @inputChanged="videoChanged" :settings='{value: oData.video, isRequired:"no", label:oTranslation.eventVideo}'></wiloke-input>
                        <wiloke-input @inputChanged="nameChanged" :settings='{value: oData.listing_title, isRequired:"yes", label:oTranslation.eventName}'></wiloke-input>
                        <wiloke-auto-complete @geocode-changed="addressChanged" :settings='{value: oData.address.address, isRequired:"yes", label:oTranslation.location, placeholder: oTranslation.address}'></wiloke-auto-complete>
                        <wiloke-select-two @selectTwoChanged="frequencyMode" :settings='{value: oData.frequency, isRequired:"yes", options: oTranslation.aEventFrequency, isMultiple: "no", label: oTranslation.frequency}'></wiloke-select-two>
                        <wiloke-daily @dailyChanged="updateStartsAndEndsOn" v-show="oData.frequency==='daily'" :o-data="{starts: oData.starts, openingAt: oData.openingAt, endsOn: oData.endsOn, closedAt: oData.closedAt}"></wiloke-daily>
                        <wiloke-weekly @weeklyChanged="weeklyChanged" v-show="oData.frequency==='weekly'" :o-data="{starts: oData.starts, openingAt: oData.openingAt, endson: oData.endsOn, closedAt: oData.closedAt, specifyDays: oData.weekly.specifyDays}"></wiloke-weekly>
                        <wiloke-occurs-once @occursOnceChanged="updateStartsAndEndsOn" v-show="oData.frequency==='occurs_once'" :o-data="{starts: oData.starts, openingAt: oData.openingAt, endsOn: oData.endsOn, closedAt: oData.closedAt}"></wiloke-occurs-once>

                        <div class="promo-item_module__24ZhT">
                            <div class="promo-item_group__2ZJhC">
                                <h3 class="promo-item_title__3hfHG" v-html="oTranslation.details"></h3>
                                <p class="promo-item_description__2nc26" v-html="oTranslation.detailsDesc"></p>
                            </div>
                        </div>
                        <wiloke-textarea @textareaChanged="textareaChanged" :settings="{value:oData.listing_content}"></wiloke-textarea>

                    </div>
                    <div class="popup_footer__2pUrl clearfix">
                        <div class="popup_footerRight__qvdP6">
                            <button @click.prevent="closePopup" class="wil-btn wil-btn--gray wil-btn--sm wil-btn--round" type="submit" v-html="oTranslation.cancel"></button>
                            <button @click.prevent="submitEvent" class="wil-btn wil-btn--primary wil-btn--sm wil-btn--round" type="submit" v-html="oTranslation.publish"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import WilokeUploadImg from './../templates/WilokeUploadImg.vue'
    import WilokeInput from './../templates/WilokeInput.vue'
    import WilokeAutoComplete from './../templates/WilokeAutoComplete.vue'
    import WilokeTextarea from './../templates/WilokeTextarea.vue'
    import WilokeSelectTwo from './../templates/WilokeSelectTwo.vue'
    import WilokeOccursOnce from './event/OccursOnce.vue'
    import WilokeDaily from './event/Daily.vue'
    import WilokeWeekly from './event/Weekly.vue'

    function getDefaultData(){
        return {
            listing_name: '',
            video: '',
            address: {
                address: '',
                lng: '',
                lat: ''
            },
            img: '',
            weekly: {
                specifyDays: []
            },
            daily: {},
            occurs_once: {},
            frequency: 'occurs_once',
            listing_content: '',
            starts: '',
            endsOn: '',
            openingAt: '',
            closedAt:''
        }
    }

    export default{
        data(){
            return {
                oData: getDefaultData(),
                xhr: null,
                isEditing: false,
                oTranslation: WILCITY_I18,
                isActivatePopup: false,
                eventDataID: null,
                eventID: null,
                isAddressChanged: false,
                isSubmitting: false
            }
        },
        props: ['raw-data'],
        components: {
            WilokeUploadImg,
            WilokeInput,
            WilokeAutoComplete,
            WilokeTextarea,
            WilokeSelectTwo,
            WilokeOccursOnce,
            WilokeDaily,
            WilokeWeekly
        },
        props: ['popupTitle'],
        methods: {
            textareaChanged(newVal){
                this.oData.listing_content = newVal;
            },
            updateStartsAndEndsOn(oNewVal){
                this.$set(this.oData, 'starts', oNewVal.starts);
                this.$set(this.oData, 'endsOn', oNewVal.endsOn);
                this.$set(this.oData, 'closedAt', oNewVal.closedAt);
                this.$set(this.oData, 'openingAt', oNewVal.openingAt);
            },
            weeklyChanged(oNewVal){
                this.oData.weekly = oNewVal;
                this.updateStartsAndEndsOn(oNewVal);
            },
            imageChanged(newVal){
                this.oData.img = newVal;
            },
            videoChanged(newVal){
                this.oData.video = newVal;
            },
            nameChanged(newVal){
                this.oData.listing_name = newVal;
            },
            addressChanged(newVal){
                this.oData.address = newVal;
                this.isAddressChanged = true;
            },
            frequencyMode(value){
                this.$set(this.oData, 'frequency', value);
            },
            closePopup(){
                jQuery(this.$el).removeClass('active');
            },
            submitEvent(event){
                let $target = jQuery(event.currentTarget);
                this.isSubmitting = true;

                if ( this.xhr !== null && this.xhr.status !== 200 ){
                    this.xhr.abort();
                }

                $target.addClass('wil-btn--disabled');
                this.xhr = jQuery.ajax({
                    type: 'POST',
                    url: WILOKE_GLOBAL.ajaxurl,
                    data: {
                        action: !this.isEditing ? 'wilcity_submit_event' : 'wilcity_edit_event',
                        data: this.oData,
                        listingID: WILOKE_INLINE_GLOBAL.postID,
                        eventID: this.eventID,
                        eventDataID: this.eventDataID,
                        isAddressChanged: this.isAddressChanged
                    },
                    success: (response=>{
                        $target.removeClass('wil-btn--disabled');
                        this.isSubmitting = false;
                        if ( response.success ){
                            if ( typeof response.data.redirectTo !== 'undefined' ){
                                window.location.href = response.data.redirectTo;
                            }else{
                                this.isActivatePopup = false;
                                this.eventDataID = response.data.eventDataID;
                                if ( typeof response.data.img !== 'undefined' ){
                                    this.$set(this.oData, 'img', response.data.img);
                                }
                            }
                            jQuery(this.$el).find('.js-toggle-close').trigger('click');
                        }
                    })
                });
            },
            fetchEventData(eventID){
            },
            editingEvent(){
                let $body = jQuery('body'), self = this;
                $body.on('editingEvent', ((event, oData)=>{
                    this.eventID = oData.eventID;
                    this.xhr = jQuery.ajax({
                        type: 'POST',
                        url: WILOKE_GLOBAL.ajaxurl,
                        data: {
                            eventID: oData.eventID,
                            action: 'wilcity_get_event_data'
                        },
                        success(response){
                            self.isEditing = true;
                            for ( let item in response.data ){
                                self.$set(self.oData, item, response.data[item]);
                            }
                        }
                    })
                }));
            },
            createNewEvent(){
                let $body = jQuery('body'), self = this;
                $body.on('createNewEvent', (event=>{
                    if ( !self.isEditing ){
                        return false;
                    }

                    self.isEditing = false;

                    let oDefault = getDefaultData();
                    for ( let item in oDefault ){
                        self.$set(self.oData, item, oDefault[item]);
                    }
                }));
            }
        },
        beforeMount(){
            if ( !WilCityHelpers.isNull(this.rawData) ){
                this.oData = JSON.parse(this.rawData);
            }
        },
        mounted(){
            this.createNewEvent();
            this.editingEvent();
        }
    }
</script>
