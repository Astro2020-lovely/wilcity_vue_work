<template>
    <div class="menu-general-settings">
        <wiloke-input v-on:inputChanged="onInputChanged" :settings="oTitleSettings"></wiloke-input>
        <wiloke-input v-on:inputChanged="onInputChanged" :settings="oDescriptionSettings"></wiloke-input>
        <wiloke-input v-on:inputChanged="onInputChanged" :settings="oPriceSettings"></wiloke-input>
        <wiloke-input v-on:inputChanged="onInputChanged" :settings="oLinkToSettings"></wiloke-input>
        <wiloke-checkbox v-on:checkboxChanged="onCheckboxChanged" v-show="oNewValue.link_to.length" :settings="oOpenNewWindowSettings"></wiloke-checkbox>
        <upload-gallery v-on:uploadImgChanged="onGalleryChanged" :settings="oGallerySettings"></upload-gallery>
    </div>
</template>
<script>
    import UploadGallery from './../WilokeUploadImg.vue'
    import WilokeInput from './../WilokeInput.vue'
    import WilokeCheckbox from './../WilokeCheckbox.vue'
    import {mapGetters} from 'vuex'

    export default{
        data(){
            return{
                oTranslations: WILCITY_I18,
                oNewValue: this.oValue,
                oGallerySettings: null,
                oOpenNewWindowSettings: null,
                oLinkToSettings: null,
                oPriceSettings: null,
                oDescriptionSettings: null,
                oTitleSettings: null
            }
        },
        components:{
            WilokeCheckbox,
            WilokeInput,
            UploadGallery
        },
        props: {
            oValue:{
                type: Object,
                default: {
                    title: 'My Title',
                    description: 'Price is net per person, excluding drinks chef seasonal menu',
                    price: '$ 59.99 - $ 79.99',
                    link_to: '',
                    is_open_new_window: '',
                    gallery: ''
                }
            },
            index: {
                type: Number,
                default: 0
            }
        },
        beforeMount(){
            this.setTitleSettings();
            this.setDescriptionSettings();
            this.setPriceSettings();
            this.setLinkToSettings();
            this.setOpenNewWindowSettings();
            this.setGallerySettings();
        },
        methods: {
            parseGallery(oGallery){
                let oNewGallery = [];
                if ( typeof oGallery === 'object' ){
                    let galleryID = '';
                    for ( galleryID in oGallery ){
                        oNewGallery.push({
                            id: galleryID,
                            src: oGallery[galleryID]
                        });
                    }
                }else{
                    oNewGallery = oGallery;
                }
                return oNewGallery;
            },
            onGalleryChanged(newVal, oSign){
                let oParseGallery = {};
                if ( typeof newVal !== 'undefined' ){
                    for ( let order in newVal ){
                        if ( typeof newVal[order].src !== 'undefined' ){
                            oParseGallery[newVal[order].id] = newVal[order].src;
                        }else{
                            oParseGallery[order] = newVal[order]; // galleryID => src
                        }
                    }
                }
                this.$set(this.oNewValue, oSign.key, oParseGallery);
            },
            onInputChanged(newVal, oSign){
                this.$set(this.oNewValue, oSign.key, newVal);
            },
            onCheckboxChanged(newVal, oSign){
                this.$set(this.oNewValue, oSign.key, newVal);
            },
            setGallerySettings(){
                let aGallery = this.parseGallery(this.oNewValue.gallery);
                this.oGallerySettings = {
                    wrapperClassName: 'upload-image_module__3I5sF',
                    isMultiple: true,
                    key: 'gallery',
                    value: aGallery,
                    maximumImages: this.$store.getters.getListingPlanSettings('maximum_restaurant_gallery_images')
                }
            },
            setTitleSettings(){
                this.oTitleSettings = {
                    value: this.oNewValue.title,
                    label: this.oTranslations.itemTitle,
                    key: 'title',
                    isRequired: 'yes'
                }
            },
            setDescriptionSettings(){
                this.oDescriptionSettings = {
                    value: this.oNewValue.description,
                    label: this.oTranslations.description,
                    key: 'description'
                }
            },
            setPriceSettings(){
                this.oPriceSettings = {
                    value: this.oNewValue.price,
                    label: this.oTranslations.price,
                    key: 'price'
                }
            },
            setLinkToSettings(){
                this.oLinkToSettings = {
                    value: this.oNewValue.link_to,
                    label: this.oTranslations.linkTo,
                    key: 'link_to'
                }
            },
            setOpenNewWindowSettings(){
                this.oOpenNewWindowSettings = {
                    value: this.oNewValue.is_open_new_window,
                    label: this.oTranslations.isOpenNewWindow,
                    key: 'is_open_new_window'
                }
            }
        }
    }
</script>
