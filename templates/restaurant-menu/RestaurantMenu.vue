<template>
    <div>
        <wiloke-toggle-group v-for="(oGroup, index) in aGroupMenus" v-on:onDeleteItem="confirmRemoveItem(index)" :key="index" :is-auto-open="isAutoOpenGroup" :toggle-title="oGroup.group_title" wrapper-class="wil-group01_block__3X0D9">
            <template v-slot:content>
                <div class="wil-group01_content__1oeej">
                    <wiloke-input v-model="aGroupMenus[index].group_title" :settings="groupTitleSettings(oGroup)"></wiloke-input>
                    <wiloke-input v-model="aGroupMenus[index].group_description" :settings="groupDescriptionSettings(oGroup)"></wiloke-input>
                    <wiloke-icon v-model="aGroupMenus[index].group_icon" :settings="groupIconSettings(oGroup)"></wiloke-icon>
                </div>
                <menu-list v-model="aGroupMenus[index].items" :a-values="getMenuList(oGroup)"></menu-list>
            </template>
        </wiloke-toggle-group>
        <a href="#" :class="addNewClass" @click.prevent="addGroupMenu"><i class="la la-plus"></i><span v-html="oTranslations.addNew"></span></a>
        <div class="clearfix" v-show="maximumMenuWarning!=''"></div>
        <span class="field_message__3Z6FX color-quaternary" v-show="maximumMenuWarning!=''" v-html="maximumMenuWarning"></span>
    </div>
</template>
<script>
    import MenuList from './MenuList.vue'
    import WilokeInput from './../WilokeInput.vue'
    import WilokeIcon from './../WilokeIcon.vue'
    import WilokeToggleGroup from './../WilokeToggleGroup.vue'

    export default{
        data(){
            return{
                oTranslations: WILCITY_I18,
                aGroupMenus: this.aValues,
                isOpenGroup: false,
                aDefaultGroup: {
                    group_title: '',
                    group_description: '',
                    group_icon: 'fa fa-cutlery',
                    items: [
                        {
                            title: typeof WILCITY_I18.restaurant != 'undefined' ? WILCITY_I18.restaurant.item.title : 'My Title',
                            description: typeof WILCITY_I18.restaurant != 'undefined' ? WILCITY_I18.restaurant.item.description : 'Price is net per person, excluding drinks chef seasonal menu',
                            price: typeof WILCITY_I18.restaurant != 'undefined' ? WILCITY_I18.restaurant.item.price : '$ 59.99 - $ 79.99',
                            link_to: '',
                            is_open_new_window: ''
                        }
                    ]
                },
                isAutoOpenGroup: 'no'
            }
        },
        components:{
            MenuList,
            WilokeIcon,
            WilokeInput,
            WilokeToggleGroup
        },
        props: {
            aValues:{
                type: Array,
                default: () => [{
                    group_title: '',
                    group_description: '',
                    group_icon: 'fa fa-cutlery',
                    items: [
                        {
                            title: 'My Title',
                            description: 'Price is net per person, excluding drinks chef seasonal menu',
                            price: '$ 59.99 - $ 79.99',
                            link_to: '',
                            is_open_new_window: ''
                        }
                    ]
                }]
            }
        },
        computed: {
            maximumMenus(){
                return typeof this.$store.getters.getListingPlanSettings('maximumRestaurantMenus') === 'undefined' ? 0 : parseInt(this.$store.getters.getListingPlanSettings('maximumRestaurantMenus'), 10);
            },
            maximumMenuWarning(){
                if ( this.maximumMenus !== 0 && !isNaN(this.maximumMenus) ){
                    return this.oTranslations.maximumMenuWarning.replace('%s', this.maximumMenus);
                }
            },
            addNewClass(){
                return {
                    'wil-btn mb-5 wil-btn--gray wil-btn--round wil-btn--xs': true,
                    'disable': this.maximumMenus != 0 && this.aGroupMenus.length === this.maximumMenus
                }
            }
        },
        methods: {
            getMenuList(oGroup){
                return oGroup.items;
            },
            addGroupMenu(){
                this.isAutoOpenGroup = 'yes';
                this.aGroupMenus.push(this.aDefaultGroup);
            },
            groupTitleSettings(oGroup){
                return {
                    label: this.oTranslations.title,
                    value: oGroup.group_title
                }
            },
            groupDescriptionSettings(oGroup){
                return {
                    label: this.oTranslations.description,
                    value: oGroup.group_description
                }
            },
            groupIconSettings(oGroup){
                return {
                    label: this.oTranslations.icon,
                    value: oGroup.group_icon
                }
            },
            confirmRemoveItem(index){
                let isDelete = confirm(this.oTranslations.confirmDeleteSetting);
                if ( isDelete ){
                    this.aGroupMenus.splice(index, 1);
                }
            }
        }
    }
</script>
