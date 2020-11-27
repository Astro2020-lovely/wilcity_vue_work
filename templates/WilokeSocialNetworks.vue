<template>
    <div :class="wrapperClass">
        <div class="field-has-close">
            <div>
                <div class="row" v-for="(oSocialItem, index) in aUsedSocialNetworks">
                    <div class="col-xs-6 col-sm-4">
                        <div :class="wrapperSocialItem(oSocialItem)">
                            <div class="field_wrap__Gv92k">
                                <select class="js-select-2" :data-index="index" v-model="oSocialItem.name">
                                    <option v-for="social in oAllSocialNetworks" :value="social">{{renderSocialName(social)}}</option>
                                </select>
                                <span class="field_label__2eCP7 text-ellipsis">{{settings.socialNameLabel}}</span>
                                <span class="bg-color-primary"></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-6 col-sm-8">
                        <div :class="wrapperSocialUrlClass(oSocialItem)">
                            <div class="field_wrap__Gv92k">
                                <input class="field_field__3U_Rt" type="text" v-model="oSocialItem.url">
                                <span class="field_label__2eCP7 text-ellipsis">{{settings.socialLinkLabel}}</span>
                                <span class="bg-color-primary"></span>
                            </div>
                        </div>
                    </div>

                    <a v-if="aUsedSocialNetworks.length>1" @click.prevent="deleteSocial" class="wil-btn mb-15 wil-btn--gray wil-btn--round wil-btn--xs wil-btn--icon" href="#"><i class="la la-close"></i></a>
                </div>
            </div>
        </div>
        <a v-show="aAvailableSocialNetworksKeys.length>=1" @click.prevent="addSocial" class="wil-btn mb-5 wil-btn--gray wil-btn--round wil-btn--xs" href="#"><i class="la la-plus"></i>{{oTranslation.addSocial}}</a>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'

    export default{
         props: ['settings'],
         data(){
            return {
                aTemporarySaveUsedSocialKeys: [],
                aTemporarySaveUsedSocialUrls: [],
                oAllSocialNetworks: Object.values(WILOKE_GLOBAL.oSocialNetworks),
                aUsedSocialNetworks: [],
                aUsedSocialNetworksKeys: [],
                aAvailableSocialNetworksKeys: [],
                isFirstTimeChanged: true,
                oPlanSettings: typeof this.$store !== 'undefined' && typeof this.$store.getters.getPlanSettings !== 'undefined' ? this.$store.getters.getPlanSettings : {},
                oTranslation: WILCITY_I18
            }
         },
         computed: {
            wrapperClass(){
                return {
                    'disable': typeof this.oPlanSettings['toggle_'+this.settings.key] !== 'undefined' && this.oPlanSettings['toggle_'+this.settings.key] == 'disable'
                }
            }
         },
         watch: {
            aUsedSocialNetworks: {
                handler(){
                    this.parseSocialKeys();
                    this.updateValues();
                    this.parseAvailableSocialNetworks();
                    if ( !this.isFirstTimeChanged ){
                        this.$emit('socialNetworksChanged', this.aUsedSocialNetworks, this.settings);
                    }
                    this.isFirstTimeChanged = false;
                },
                deep: true
            }
         },
         methods:{
            wrapperSocialItem(oSocial){
                return {
                    'field_module__1H6kT field_style2__2Znhe mb-15': 1==1,
                    'active': oSocial.name.length
                }
            },
            wrapperSocialUrlClass(oSocial){
                return {
                    'field_module__1H6kT field_style2__2Znhe mb-15': 1==1,
                    'active': oSocial.url.length
                }
            },
            updateValues(){
                this.settings.value = this.aUsedSocialNetworks;
            },
            updateSocialName($target){
                let index = $target.data('index');
                this.aUsedSocialNetworks[index].name = $target.val();
                this.updateValues();
            },
            deleteSocial(index){
                this.aUsedSocialNetworks.pop();

                this.$nextTick(function(){
                    this.runSelect2('refreshAll');
                })
            },
            addSocial(){
                this.aUsedSocialNetworks.push({
                    name: this.aAvailableSocialNetworksKeys[0],
                    url: ''
                });

                this.$nextTick(function(){
                    this.runSelect2('add');
                })
            },
            renderSocialName(social){
                if ( social == 'google-plus' ){
                    return 'Google+';
                }
                return social.charAt(0).toUpperCase() + social.slice(1);
            },
            parseSocialKeys(){
                this.aUsedSocialNetworksKeys = this.aUsedSocialNetworks.map(oSocial=>{
                    return oSocial.name;
                });
            },
            parseAllSocialNetworks(){
                if ( typeof this.settings.excludingSocialNetworks !== 'undefined' ){
                    this.oAllSocialNetworks.forEach((social, index)=>{
                        if ( this.settings.excludingSocialNetworks.indexOf(social) != -1 ){
                            this.oAllSocialNetworks.splice(index, 1);
                        }
                    });
                }
            },
            parseAvailableSocialNetworks(){
                if ( this.settings.excludingSocialNetworks == '' || !this.aUsedSocialNetworksKeys.length ){
                    this.aAvailableSocialNetworksKeys = this.oAllSocialNetworks;
                }else{
                    this.aAvailableSocialNetworksKeys = [];
                    this.oAllSocialNetworks.forEach(social=>{
                        if ( !this.aUsedSocialNetworksKeys.length || (this.aUsedSocialNetworksKeys.indexOf(social) == -1) ){
                            this.aAvailableSocialNetworksKeys.push(social);
                        }
                    });
                }
            },
            parseUsedSocialNetworks(){
                if ( typeof this.settings.value == 'object' && this.settings.value.length ){
                    this.aUsedSocialNetworks = this.settings.value;

                    this.aUsedSocialNetworksKeys = this.aUsedSocialNetworks.map(oSocial=>{
                        return oSocial.name;
                    });
                }else{
                    this.aUsedSocialNetworks = [{
                        name: this.oAllSocialNetworks[0],
                        url: ''
                    }];
                }

                this.parseSocialKeys();
            },
            runSelect2(method){
                let $select2 = jQuery(this.$el).find('.js-select-2');

                switch(method){
                    case 'add':
                        $select2.last().select2().on('select2:close', ((event)=>{
                            this.updateSocialName(jQuery(event.currentTarget));
                        }));
                    break;
                    case 'refreshAll':
                        $select2.each(function(event){
                            let $item = jQuery(event.currentTarget);
                            if ( $item.data('select2') !== 'undefined' ){
                                $item.select2('destroy');
                            }
                        })
                        $select2.select2().on('select2:close', ((event)=>{
                            this.updateSocialName(jQuery(event.currentTarget));
                        }));
                    break;
                    default:
                        $select2.select2().on('select2:close', ((event)=>{
                            this.updateSocialName(jQuery(event.currentTarget));
                        }));
                        break;
                }
            }
         },
         beforeMount(){
            this.parseAllSocialNetworks();
            this.parseUsedSocialNetworks();
            this.parseAvailableSocialNetworks();
         },
         mounted(){
            this.runSelect2();
         }
    }
</script>
