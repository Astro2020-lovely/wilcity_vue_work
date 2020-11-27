<template>
    <div>
        <wiloke-select-two @selectTwoChanged="frequencyMode" :settings='{value: oSettings.frequency, isRequired:"yes", options: oTranslation.aEventFrequency, isMultiple: "no", label: oTranslation.frequency}'></wiloke-select-two>
        <wiloke-occurs-once @occursOnceChanged="updateSettings" v-show="oSettings.frequency==='occurs_once'" :o-data="{starts: oSettings.starts, openingAt: oSettings.openingAt, endsOn: oSettings.endsOn, closedAt: oSettings.closedAt}"></wiloke-occurs-once>
        <wiloke-daily @dailyChanged="updateSettings" v-show="oSettings.frequency==='daily'" :o-data="{starts: oSettings.starts, openingAt: oSettings.openingAt, endsOn: oSettings.endsOn, closedAt: oSettings.closedAt}"></wiloke-daily>
        <wiloke-weekly @weeklyChanged="updateSettings" v-show="oSettings.frequency==='weekly'" :o-data="{starts: oSettings.starts, openingAt: oSettings.openingAt, endsOn: oSettings.endsOn, closedAt: oSettings.closedAt, specifyDays: oSettings.specifyDays}"></wiloke-weekly>
    </div>
</template>
<script>
    import WilokeDaily from './event/Daily.vue'
    import WilokeOccursOnce from './event/OccursOnce.vue'
    import WilokeWeekly from './event/Weekly.vue'
    import WilokeSelectTwo from './WilokeSelectTwo.vue'

    export default{
        data(){
            return{
                oSettings:{
                    frequency: 'occurs_once',
                    starts: '',
                    closedAt: '',
                    openingAt: '',
                    endsOn: '',
                    specifyDays: [],
                },
                oTranslation: WILCITY_I18
            }
        },
        props: ['settings'],
        components:{
           WilokeDaily,
           WilokeOccursOnce,
           WilokeWeekly,
           WilokeSelectTwo
        },
        methods: {
            frequencyMode(newVal){
                this.oSettings.frequency = newVal;
                this.settings.value = this.oSettings;
            },
            updateSettings(newVal, key){
                this.oSettings[key] = newVal;
                this.settings.value = this.oSettings;
            }
        },
        beforeMount(){
            if ( !WilCityHelpers.isNull(this.settings.value) ){
                this.oSettings = Object.assign({}, this.oSettings, this.settings.value);
            }
        }
    }
</script>
