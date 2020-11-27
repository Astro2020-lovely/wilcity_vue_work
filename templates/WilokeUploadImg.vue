<template>
    <div :class="wrapperClass" v-if="!isMultiple">
        <div class="field_wrap__Gv92k">
            <slot name="wiloke-uploader-action" :paramName="paramName" :isRequired="isRequired" :labelName="labelName">
                <input v-if="isWPUpload" :id="generateID" class="field_field__3U_Rt" type="text" :name="paramName">
                <input v-else :id="generateID" class="field_field__3U_Rt" type="file" :name="paramName">
                <span @click="listenUploadEvent" class="input-filename" :data-text="singleImgName">
                    <span class="input-fileimg" :style="{backgroundImage: 'url('+singleBgImg+')'}"></span>
                </span>
                <span class="field_label__2eCP7 text-ellipsis" :class="{required: isRequired}">{{ labelName }}</span>
                <span class="bg-color-primary"></span>
            </slot>
            <slot name="wiloke-uploader-preview" :aUploadedImages="aUploadedImages">
                <div class="field_right__2qM90 pos-a-center-right">
                    <a :class="singleBtnClass" href="#" @click.prevent="listenUploadEvent">{{ btnName }}
                        <div v-show="isUploading" class="pill-loading_module__3LZ6v">
                            <div class="pill-loading_loader__3LOnT"></div>
                        </div>
                    </a>
                </div>
            </slot>
        </div>
        <span class="field_message__3Z6FX color-quaternary" v-show="errMsg!=''" v-html="errMsg"></span>
    </div>
    <div v-else :class="wrapperClass">
        <div class="upload-image_row__2UK1p clearfix">
            <div v-if="hasUploadedImages">
                <draggable v-model="aUploadedImages">
                    <div v-for="(oUploadedImg, order) in aUploadedImages" class="upload-image_thumb__V-SH7">
                        <div class="upload-image_image__17ttf cover-after" :style="{backgroundImage: 'url('+oUploadedImg.src+')'}"></div>
                        <span class="upload-image_remove__3Oa_t color-primary--hover" @click.prevent="removeImg(order)"><i class="la la-close"></i></span>
                    </div>
                </draggable>
            </div>
            <div :class="uploadClass">
                <input v-if="isWPUpload" :id="generateID" type="text" :name="paramName" @click.prevent="listenUploadEvent">
                <input v-else :id="generateID" type="file" :name="paramName" multiple>
                <div v-show="!isUploading" class="upload-image_buttonContent__fjl5V"><i class="la la-image"></i></div>
                <div v-show="isUploading" class="full-load">
                    <!-- pill-loading_module__3LZ6v -->
                    <div class="pill-loading_module__3LZ6v pos-a-center">
                        <div class="pill-loading_loader__3LOnT"></div>
                    </div><!-- End / pill-loading_module__3LZ6v -->
                </div>
            </div>
        </div>
        <div class="clearfix" v-show="errMsg!=''"></div>
        <span class="field_message__3Z6FX color-quaternary" v-show="errMsg!=''" v-html="errMsg"></span>
        <span class="field_message__3Z6FX color-quaternary" v-show="warning!=''" v-html="warning"></span>
    </div>
</template>

<script>
    import 'formdata-polyfill';
    import draggable from 'vuedraggable';

    export default {
        data(){
            let isAjaxUpload = typeof WILOKE_GLOBAL.uploadType != 'undefined' && WILOKE_GLOBAL.uploadType == 'ajax';
            let oCommon = {
                isRequired: false,
                value: [],
                maximumImages: 0,
                aUploadedImages: typeof this.settings.value == 'object' && this.settings.value.length ? this.settings.value : [],
                oTranslation: WILCITY_I18,
                isAjaxUpload: isAjaxUpload,
                isUploading: false,
                isWPUpload: WILOKE_GLOBAL.uploadType == 'wp',
                toggle: '',
                internalErrMsg: ''
            }, oIndividual = {};

            if ( !this.settings.isMultiple ){
                oIndividual = Object.assign({}, {
                    uploadFieldID: '',
                    isMultiple: false,
                    paramName: 'image',
                    labelName: WILCITY_I18.image,
                    btnName: WILCITY_I18.uploadSingleImageTitle,
                    wrapperClassName: 'field_module__1H6kT field_style2__2Znhe mb-15',
                }, this.settings);
            }else{
                oIndividual = Object.assign({}, {
                    isMultiple: true,
                    labelName: WILCITY_I18.images,
                    paramName: isAjaxUpload ? 'images' : 'images[]',
                    btnName: WILCITY_I18.uploadMultipleImagesTitle,
                    wrapperClassName: 'upload-image_module__3I5sF',
                }, this.settings);
            }

            let oDefault = Object.assign({}, oCommon, oIndividual);
            if ( oDefault.isRequired == 'no' ){
                oDefault.isRequired = false;
            }

            return oDefault;
        },
        props: {
            settings: {
                type: Object,
                default: ()=>({
                    isMultiple: false,
                    value: [],
                    wrapperClassName: 'field_module__1H6kT field_style2__2Znhe mb-15',
                })
            },
            field:{
                type: Object
            }
	    },
	    watch: {
	        settings: {
	            handler(oNewVal){
	                this.aUploadedImages = oNewVal.value;
	            },
	            deep: true
	        },
	        aUploadedImages: {
                handler(oNewVal){
                    if ( typeof this.field !== 'undefined' ){
                        this.field.value = this.aUploadedImages;
                    }
                    this.$emit('uploadImgChanged', this.aUploadedImages, this.settings);
	            },
	            deep: true
	        }
	    },
	    computed:{
	        errMsg(){
	            return this.internalErrMsg.length ? this.internalErrMsg : this.settings.errMsg;
	        },
	        singleBtnClass(){
	            return !this.isUploading ? 'wil-btn wil-btn--primary wil-btn--round wil-btn--xxs' : 'wil-btn wil-btn--primary wil-btn--round wil-btn--xxs wil-btn--loading';
	        },
	        uploadClass(){
	            return {
	                'upload-image_button__3-6QW color-primary--hover': 1==1,
	                'disable': this.maximumImages != 0 && this.aUploadedImages.length >= this.maximumImages
	            }
	        },
	        conditional(){
	            let getConditional = '';
	            if ( this.isRequired ){
	                getConditional += 'required|';
	            }

	            getConditional = 'image|size:'+WILOKE_GLOBAL.maxUpload;
	            return getConditional;
	        },
            singleBgImg(){
                if ( !this.isValidImg() ){
                    return '';
                }
                return this.aUploadedImages[0].src;
            },
            singleImgName(){
                if ( !this.isValidImg() ){
                    return '';
                }

                return this.aUploadedImages[0].fileName;
            },
            generateID(){
                let oDate = new Date();
	            this.uploadFieldID = 'js-upload-' + oDate.getUTCMilliseconds();
	            return this.uploadFieldID;
	        },
            warning(){
                if ( this.maximumImages != 0 && !isNaN(this.maximumImages) ){
                    return this.oTranslation.maximumImgsWarning.replace('%s', this.maximumImages);
                }
                return '';
	        },
            wrapperClass(){
                let wrapperClass = this.wrapperClassName; 
                let oPlanSettings = typeof this.$store !== 'undefined' && typeof this.$store.getters.getPlanSettings !== 'undefined' ? this.$store.getters.getPlanSettings : {}
                let tooglePlan =  typeof this.field !== 'undefined' && typeof oPlanSettings['toggle_'+this.field.key] !== 'undefined' && oPlanSettings['toggle_'+this.field.key] == 'disable';
                if ( this.toggle ==='disable' || tooglePlan ){
                    wrapperClass += ' disable';
                }

                if ( !this.hasUploadedImages ){
                    return wrapperClass;
                }

                if ( typeof this.errMsg !== 'undefined' && this.errMsg != '' ){
                    wrapperClass = wrapperClass + ' error';
                }else{
                    wrapperClass = wrapperClass + ' active';
                }

                return wrapperClass;
            },
            hasUploadedImages(){
                return this.aUploadedImages.length;
            },
        },
        methods: {
            handleSingleUpload(oAttachment){
                this.aUploadedImages = [];
                this.aUploadedImages.push({'id': oAttachment.id, 'src': oAttachment.url, fileName: oAttachment.filename});
            },
            handleMultipleUpload(oAttachments){
                let aParseAttachments = oAttachments.map(oAttachment=>{
                    return {'id': oAttachment.id, 'src': oAttachment.url, fileName: oAttachment.filename};
                });
                if ( !Array.isArray(this.aUploadedImages) ){
                    this.aUploadedImages = [];
                }
                this.aUploadedImages = this.aUploadedImages.concat(aParseAttachments);

                if ( this.isMultiple ){
                    if ( this.maximumImages !== 0 && this.aUploadedImages.length > this.maximumImages ){
                       this.aUploadedImages.splice(this.maximumImages, this.aUploadedImages - 1);
                    }
                }
            },
            wpUploadHandler($btn){
                let frame;
                if ( $btn.data('uploadFrame') ) {
                    $btn.data('uploadFrame').open();
                    return true;
                }

                frame = wp.media({
                    multiple: this.isMultiple
                });

                $btn.data('uploadFrame', frame);

                frame.on( 'select', (() => {
                    if ( !this.isMultiple ){
                        this.handleSingleUpload(frame.state().get('selection').first().toJSON());
                    }else{
                        this.handleMultipleUpload(frame.state().get('selection').toJSON());
                    }
                }));
                frame.open();
            },
            isValidImg(){
                if ( this.errMsg || !this.hasUploadedImages ){
                    return false;
                }
                return true;
            },
            getBase64Img(img, oFile){
                let canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                return canvas.toDataURL(oFile.type);
            },
            getImage(file){
                return new Promise((resolve, reject)=>{
                    let instFileReader = new FileReader();

                    let img = document.createElement('img');

                    instFileReader.onload = () => {
                        img.src = instFileReader.result;
                        img.onload = () =>{
                            resolve(this.getBase64Img(img, file));
                        }
                    };

                    instFileReader.readAsDataURL(file);
                });
            },
            startUploading(instFormData){
                let images = instFormData.getAll(this.paramName);
                if ( !this.aUploadedImages.length && this.maximumImages != 0 && images.length > this.maximumImages ){
                    images = images.splice(0, this.maximumImages);
                }

                let promises = images.map(x=>this.getImage(x).then(img=>{
                    return {
                        fileType: x.type,
                        fileSize: x.size,
                        originalName: x.name,
                        fileName: x.name,
                        src: img
                    }
                }));

                return Promise.all(promises);
            },
            ajaxUploadImgs(formImg){
                 this.isUploading = true;
                 this.internalErrMsg = '';

                 let ajaxUrl = WILOKE_GLOBAL.ajaxurl+'?action=wilcity_ajax_upload_imgs';
                 if ( !this.isMultiple ){
                    if ( this.aUploadedImages.length ){
                        ajaxUrl += '&previous=' + this.aUploadedImages[0].id;
                    }
                 }

                 return new Promise((resolve, reject)=>{
                    jQuery.ajax({
                        url: ajaxUrl,
                        type: 'POST',
                        data: formImg,
                        contentType: false,
                        cache: false,
                        processData: false,
                        success: response => {
                            this.isUploading = false;
                            if ( response.success ){
                                resolve(response.data);
                            }else{
                                reject(response.data.msg);
                            }
                        }
                    });
                });
            },
            uploadFieldListener(){
                if ( document.getElementById(this.uploadFieldID) === null ){
                    this.aUploadedImages = [];
                    return false;
                }

                document.getElementById(this.uploadFieldID).addEventListener('change', (event=>{
                    let aFileLists = event.target.files;

                    if ( !aFileLists.length ){
                        return false;
                    }
                    let instFormData = new FormData(),
                        totalFiles = aFileLists.length;

                    if ( typeof WILOKE_GLOBAL.isUploadImgViaAjax != 'undefined' && WILOKE_GLOBAL.isUploadImgViaAjax == 'yes' ){
                        if ( this.maximumImages != 0 ){
                            if ( this.aUploadedImages.length ){
                                this.maximumImages = this.maximumImages - this.aUploadedImages.length;
                            }

                            if ( totalFiles > this.maximumImages  ){
                                totalFiles = this.maximumImages;
                            }
                        }

                        for ( let i = 0; i < totalFiles; i++ ){
                            instFormData.append(this.paramName + '_' + i, aFileLists[i], aFileLists[i].name);
                        }

                        let oUploadImgsStatus = this.ajaxUploadImgs(instFormData);

                        oUploadImgsStatus.then(oResponse => {
                            if ( this.isMultiple ){
                                if ( !Array.isArray(this.aUploadedImages) ){
                                    this.aUploadedImages = [];
                                }
                                this.aUploadedImages = this.aUploadedImages.concat(oResponse.aImgs);
                            }else{
                                this.aUploadedImages = oResponse.aImgs;
                            }

                            if ( typeof this.field !== 'undefined' ){
                                this.field.value = this.aUploadedImages;
                            }

                            if ( typeof oResponse.aErrors !== 'undefined' && oResponse.aErrors.length  ){
                                let error = '<ul>';
                                for ( let errOrder = 0; errOrder < oResponse.aErrors.length; errOrder++ ){
                                    error += '<li>'+oResponse.aErrors[errOrder].name + ':' + oResponse.aErrors[errOrder].msg+'</li>';
                                }
                                error += '<ul>';
                                this.internalErrMsg = error;
                            }
                        }).catch(msg => {
                            this.internalErrMsg = msg;
                        });
                        return true;
                    }

                    for ( let i = 0; i < totalFiles; i++ ){
                        instFormData.append(this.paramName, aFileLists[i], aFileLists[i].name);
                    }

                    this.startUploading(instFormData).then(x=>{
                        if ( this.isMultiple && this.hasUploadedImages ){
                           this.aUploadedImages = Array.isArray(this.aUploadedImages) ? this.aUploadedImages.concat(x) : Object.assign({}, this.aUploadedImages, x);
                        }else{
                            this.aUploadedImages = x;
                        }

                        if ( this.maximumImages != 0 && this.aUploadedImages.length > this.maximumImages ){
                            this.aUploadedImages.splice(this.maximumImages, this.aUploadedImages - 1);
                        }

                        if ( typeof this.field !== 'undefined' ){
                            this.field.value = this.aUploadedImages;
                        }
                    });
                }));
            },
            listenUploadEvent(event){
                if ( this.isWPUpload ){
                    event.preventDefault();
                    this.wpUploadHandler(jQuery(event.target));
                }else{
                    jQuery(event.currentTarget).closest('.field_wrap__Gv92k').find('.field_field__3U_Rt').trigger('click');
                }
            },
            deleteImg(imgID){
                jQuery.ajax({
                    url: WILOKE_GLOBAL.ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'wilcity_delete_attachment',
                        id: imgID
                    },
                    success: (response=>{
                    })
                })
            },
            removeImg(order){
                if ( !this.isWPUpload ){
                    let aImage = this.aUploadedImages.splice(order, 1);
                    this.deleteImg(aImage[0].id);
                }else{
                    this.aUploadedImages.splice(order, 1);
                }
            }
        },
        mounted: function(){
            this.uploadFieldListener();
        },
        components: {
            draggable
        }
    }
</script>
