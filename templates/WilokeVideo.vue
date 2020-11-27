<template>
    <div :class="wrapperClass">
        <div v-for="(aItem, index) in aAddedVideos" class="field-has-close">
            <div :class="wrapperFieldItemClass(aItem.src)">
                <div class="field_wrap__Gv92k">
                    <div v-if="settings.isRequired" class="video-field">
                        <input class="field_field__3U_Rt" type="text" v-model="aItem.src" @change="updatingVideoUrl" required>
                        <input class="field_field__3U_Rt" type="hidden" v-model="aItem.thumbnail" required>
                        <span class="field_label__2eCP7 text-ellipsis">{{settings.placeholder}}</span>
                        <span class="bg-color-primary"></span>
                    </div>
                    <div v-else class="video-field">
                        <input class="field_field__3U_Rt" type="text" v-model="aItem.src" @change="updatingVideoUrl">
                        <input class="field_field__3U_Rt" type="hidden" v-model="aItem.thumbnail">
                        <span class="field_label__2eCP7 text-ellipsis">{{settings.placeholder}}</span>
                        <span class="bg-color-primary"></span>
                    </div>
                </div>
            </div>
            <a v-if="index != 0" @click.prevent="deleteVideo(index)" class="wil-btn mb-15 wil-btn--gray wil-btn--round wil-btn--xs wil-btn--icon " href="#"><i class="la la-close"></i></a>
        </div>
        <a :class="addMoreBtnClass" @click.prevent="addMore" href="#"><i class="la la-plus"></i>{{settings.addMoreBtnName}}</a>
        <p class="field_message__3Z6FX color-quaternary" v-show="warning!=''">{{warning}}</p>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                oTranslation: WILCITY_I18,
                aAddedVideos: typeof this.settings.value !== 'undefined' && this.settings.value.length ? this.settings.value : [{src: '', thumbnail: ''}],
                toggleVideo: 'enable'
            }
        },
        props: {
            settings: {
                type: Object,
                default: {}
            },
            toggle: {
                type: String,
                default: ''
            },
            maximumVideos: {
                type: Number,
                default: 0
            }
        },
        computed: {
            wrapperClass(){
                return {
                    'disable': this.toggleVideo == 'disable'
                }
            },
            addMoreBtnClass(){
                return {
                    'wil-btn input-upload mb-5 wil-btn--gray wil-btn--round wil-btn--xs': 1==1,
                    'disable': this.maximumVideos != 0 && this.aAddedVideos.length  >= this.maximumVideos
                }
            },
            warning(){
                if ( this.maximumVideos != 0 && !isNaN(this.maximumVideos) ){
                    return this.oTranslation.maximumVideosWarning.replace('%s', this.maximumVideos);
                }
                return '';
	        }
        },
        methods:{
            updatingVideoUrl(){
                this.settings.value = this.aAddedVideos;
                this.$emit('videoChanged', this.aAddedVideos, this.settings);
            },
            wrapperFieldItemClass(url){
                return url.length ? 'field_module__1H6kT field_style2__2Znhe mb-15 active' : 'field_module__1H6kT field_style2__2Znhe mb-15';
            },
            setupConfiguration(){
                if ( this.toggle.length){
                    this.toggleVideo = this.toggle;
                }else if ( typeof this.settings.toggle !== 'undefined' ){
                    this.toggleVideo = this.settings.toggle;
                }
            },
            checkValue(){
                if ( this.settings.value == '' ){
                    this.settings.value = [''];
                }

                this.aAddedVideos = this.settings.value;
            },
            deleteVideo(index){
                this.aAddedVideos.splice(index, 1);
                this.updatingVideoUrl();
            },
            addMore(){
                if ( this.maximumVideos != 0 && this.aAddedVideos.length >= this.maximumVideos ){
                    return false;
                }

                this.aAddedVideos.push({src: '', thumbnail:''});
            },
            updateDefault(aVideos){
                this.aAddedVideos = aVideos;
            }
        },
        mounted(){
            this.setupConfiguration();
        }
    }
</script>
