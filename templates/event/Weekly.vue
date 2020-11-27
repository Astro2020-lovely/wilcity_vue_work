<template>
    <div class="bg-color-gray-3 bd-color-gray-1 pd-15 mb-20">
        <div class="row">
            <div class="col-md-2 col-lg-2 ">
                <div class="mt-5 mb-10">{{oTranslation.day}}</div>
            </div>
            <div class="col-md-10 col-lg-10">
                <div class="row">
                    <wiloke-radio @radioChanged="specifyDaysChecked" :settings="{value: checkedDay, options: oTranslation.oDaysOfWeek}"></wiloke-radio>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-2 col-lg-2 ">
                <div class="mt-25">{{oTranslation.starts}}</div>
            </div>
            <div class="col-md-10 col-lg-10 ">
                <wiloke-datepicker @datepickerChanged="startsChanged" :settings="{value: oWeekly.starts}"></wiloke-datepicker>
            </div>
        </div>
        <div class="row">
            <div class="col-md-2 col-lg-2 ">
                <div class="mt-25">{{oTranslation.endsOn}}</div>
            </div>
            <div class="col-md-10 col-lg-10 ">
                <wiloke-datepicker @datepickerChanged="endsonChanged" :settings="{value: oWeekly.endsOn}"></wiloke-datepicker>
            </div>
        </div>

        <div class="row">
            <div class="col-md-2 col-lg-2 ">
                <div class="mt-25">{{oTranslation.time}}</div>
            </div>
            <div class="col-md-5 col-lg-5 ">
                <wiloke-time @timeChanged="openingAtChanged" :settings="{value: oWeekly.openingAt}"></wiloke-time>
            </div>
            <div class="col-md-5 col-lg-5 ">
                <wiloke-time @timeChanged="closedAtChanged"  :settings="{value: oWeekly.closedAt}"></wiloke-time>
            </div>
        </div>
    </div>
</template>
<script>
    import WilokeTime from './../../templates/WilokeTime.vue'
    import WilokeDatepicker from './../../templates/WilokeDatepicker.vue'
    import WilokeDaysChecked from './../../templates/WilokeDaysChecked.vue'
    import WilokeRadio from './../../templates/WilokeRadio.vue'

    export default{
        data(){
            return {
                oTranslation: WILCITY_I18,
                oWeekly: {
                    starts: '',
                    endsOn: '',
                    specifyDays: [],
                },
                checkedDay: ''
            }
        },
        props:['oData'],
        methods: {
            specifyDaysChecked(newVal){
                this.$set(this.oWeekly, 'specifyDays', newVal);
                this.emitUpdate(newVal, 'specifyDays');
            },
            startsChanged(newVal){
                this.$set(this.oWeekly, 'starts', newVal);
                this.emitUpdate(newVal, 'starts');
            },
            endsonChanged(newVal){
                this.$set(this.oWeekly, 'endsOn', newVal);
                this.emitUpdate(newVal, 'endsOn');
            },
            openingAtChanged(newVal){
                this.$set(this.oWeekly, 'openingAt', newVal);
                this.emitUpdate(newVal, 'openingAt');
            },
            closedAtChanged(newVal){
                this.$set(this.oWeekly, 'closedAt', newVal);
                this.emitUpdate(newVal, 'closedAt');
            },
            emitUpdate(newVal, key){
                this.$emit('weeklyChanged', newVal, key);
            }
        },
        components:{
            WilokeDatepicker,
            WilokeTime,
            WilokeDaysChecked,
            WilokeRadio
        },
        beforeMount(){
            this.oWeekly = this.oData;
            if( this.oWeekly.specifyDays.length > 0 ) {
                this.checkedDay = this.oWeekly.specifyDays[0];
            }
        }
    }
</script>
