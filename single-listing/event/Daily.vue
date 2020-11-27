<template>
    <div class="bg-color-gray-3 bd-color-gray-1 pd-15 mb-20">
        <div class="row">
            <div class="col-md-2 col-lg-2 ">
                <div class="mt-25">{{oTranslation.starts}}</div>
            </div>
            <div class="col-md-10 col-lg-10 ">
                <wiloke-datepicker @datepickerChanged="startsChanged" :settings="{value: oDailySettings.starts, isRequired: 'yes'}"></wiloke-datepicker>
            </div>
        </div>
        <div class="row">
            <div class="col-md-2 col-lg-2 ">
                <div class="mt-25">{{oTranslation.endsOn}}</div>
            </div>
            <div class="col-md-10 col-lg-10 ">
                <wiloke-datepicker @datepickerChanged="endsOnChanged" :settings="{value: oDailySettings.endsOn, isRequired: 'yes'}"></wiloke-datepicker>
            </div>
        </div>
        <div class="row">
            <div class="col-md-2 col-lg-2 ">
                <div class="mt-25">{{oTranslation.time}}</div>
            </div>
            <div class="col-md-5 col-lg-5 ">
                <wiloke-time @timeChanged="openingAtChanged" :settings="{value: oDailySettings.openingAt, isRequired: 'yes'}"></wiloke-time>
            </div>
            <div class="col-md-5 col-lg-5 ">
                <wiloke-time @timeChanged="closedAtChanged" :settings="{value: oDailySettings.closedAt, isRequired: 'yes'}"></wiloke-time>
            </div>
        </div>
    </div>
</template>
<script>
    import WilokeTime from './../../templates/WilokeTime.vue'
    import WilokeDatepicker from './../../templates/WilokeDatepicker.vue'

    export default{
        data(){
            return {
                oTranslation: WILCITY_I18,
                oDailySettings: {
                    starts: '',
                    endsOn: '',
                    openingAt: '',
                    closedAt: ''
                }
            }
        },
        props: ['oData'],
        watch: {
            'oDailySettings': {
                handler: function(oNewValue){
                    this.$emit('dailyChanged', oNewValue);
                },
                deep: true
            },
            'oData': {
                handler: function(oNewValue){
                    this.oDailySettings = this.oData;
                },
                deep: true
            }
        },
        methods: {
            startsChanged(newVal){
                this.$set(this.oDailySettings, 'starts', newVal);
            },
            endsOnChanged(newVal){
                this.$set(this.oDailySettings, 'endsOn', newVal);
            },
            openingAtChanged(newVal){
                this.$set(this.oDailySettings, 'openingAt', newVal);
            },
            closedAtChanged(newVal){
                this.$set(this.oDailySettings, 'closedAt', newVal);
            }
        },
        components:{
            WilokeTime,
            WilokeDatepicker
        },
        mounted(){
            this.oDailySettings = this.oData;
        }
    }
</script>
