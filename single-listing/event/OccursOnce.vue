<template>
    <div class="bg-color-gray-3 bd-color-gray-1 pd-15 mb-20">
        <div class="row">
            <div class="col-md-2 col-lg-2 ">
                <div class="mt-25">{{oTranslation.starts}}</div>
            </div>
            <div class="col-md-6 col-lg-6 ">
                <wiloke-datepicker @datepickerChanged="startsChanged" :settings="{value: oData.starts, isRequired: 'yes'}"></wiloke-datepicker>
            </div>
            <div class="col-md-4 col-lg-4 ">
                <wiloke-time @timeChanged="openingAtChanged" :settings="{value: oData.openingAt, isRequired: 'yes'}"></wiloke-time>
            </div>
        </div>
        <div class="row">
            <div class="col-md-2 col-lg-2 ">
                <div class="mt-25">{{oTranslation.endsOn}}</div>
            </div>
            <div class="col-md-6 col-lg-6 ">
                <wiloke-datepicker @datepickerChanged="endsonChanged" :settings="{value: oData.endsOn, isRequired: 'yes'}"></wiloke-datepicker>
            </div>
            <div class="col-md-4 col-lg-4 ">
                <wiloke-time @timeChanged="closedAtChanged" :settings="{value: oData.closedAt, isRequired: 'yes'}"></wiloke-time>
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
                oOccursOnce: {}
            }
        },
        watch: {
            'oOccursOnce': {
                handler: function(oNewVal){
                    this.$emit('occursOnceChanged', oNewVal);
                },
                deep: true
            }
        },
        props: ['oData'],
        methods: {
            startsChanged(newVal){
                this.$set(this.oOccursOnce, 'starts', newVal);
            },
            openingAtChanged(newVal){
                this.$set(this.oOccursOnce, 'openingAt', newVal);
            },
            endsonChanged(newVal){
                this.$set(this.oOccursOnce, 'endsOn', newVal);
            },
            closedAtChanged(newVal){
                this.$set(this.oOccursOnce, 'closedAt', newVal);
            }
        },
        components:{
            WilokeTime,
            WilokeDatepicker
        },
        mounted(){
            this.oOccursOnce = this.oData;
        }
    }
</script>
