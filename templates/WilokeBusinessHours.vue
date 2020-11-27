<template>
    <div :class="wrapperClass">
        <wiloke-radio :settings="{value:settings.value.hourMode, options: oHourOptions}" :wrapper-class="'col-md-4 col-lg-4'" v-on:radioChanged="updateHourOption"></wiloke-radio>

        <div v-show="isShowForm" class="col-xs-12">
            <wiloke-select-two v-model="timeFormat" v-on:selectTwoChanged="updateTimeFormat" :settings="{options: oTimeFormats, value: settings.value.timeFormat, label: settings.timeFormatLabel}"></wiloke-select-two>

            <div class="list-hours_module__CE4hn js-list-hours">
                <table class="list-hours_table__1B4UJ">
                    <tbody>
                        <tr v-for="(dayName, dayKey) in oDaysOfWeeks" class="list-hours_tr__1TA9B">
                            <td class="list-hours_day__11G3l">
                                <wiloke-checkbox v-on:checkboxChanged="updateOpenedDay" :settings="{label:dayName, value: settings.value.businessHours[dayKey].isOpen, dayKey: dayKey}" :wrapperClass="'checkbox_module__1K5IS mt-25 js-checkbox'"></wiloke-checkbox>
                            </td>
                            <td class="list-hours_hours__3uYGr">
                                <div class="list-hours_hoursItem__3kmyv" v-for="(oOperatingTime, index) in settings.value.businessHours[dayKey].operating_times">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <div class="field_module__1H6kT field_style2__2Znhe mb-15 js-field">
                                                <wiloke-select-two v-on:selectTwoChanged="updateOpenFrom" :settings="{label: oTimeRangeLabel.from, options:aBusinessHoursOptions, value: settings.value.businessHours[dayKey].operating_times[index].from, dayKey:dayKey, index: index}" :c-id="cId"></wiloke-select-two>
                                            </div>
                                        </div>
                                        <div class="col-xs-6">
                                            <div class="field_module__1H6kT field_style2__2Znhe mb-15 js-field">
                                                <wiloke-select-two v-on:selectTwoChanged="updateOpenTo" :settings="{label: oTimeRangeLabel.to, options:aBusinessHoursOptions, value: settings.value.businessHours[dayKey].operating_times[index].to, dayKey:dayKey, index: index}" :c-id="cId"></wiloke-select-two>
                                            </div>
                                        </div>
                                        <a v-if="settings.value.businessHours[dayKey].operating_times.length==1" class="list-hours_button__1MWV9" @click.prevent="addOperatingTime(dayKey)"><i class="la la-plus"></i></a>
                                        <a v-if="settings.value.businessHours[dayKey].operating_times.length==2 && index==1" class="list-hours_button__1MWV9" @click.prevent="removeOperatingTime(dayKey, index)"><i class="la la-close"></i></a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>
<script>
    import WilokeCheckbox from './WilokeCheckbox.vue'
    import WilokeInput from './WilokeInput.vue'
    import WilokeSelectTwo from './WilokeSelectTwo.vue'
    import WilokeRadio from './WilokeRadio.vue'
    import {mapGetters} from 'vuex'

    export default{
        props: ['settings'],
        data(){
            return {
                timeFormat: this.settings.value.timeFormat,
                cId: 'wilcity-business-hour-settings',
                aTwelveFormat: WILCITY_ADDLISTING.oBusinessHours,
                aTwentyFourFormat: [],
                aBusinessHoursOptions: this.oGenerateBusinessHourOptions(this.settings.value.timeFormat, WILCITY_ADDLISTING.oBusinessHours),
                oDaysOfWeeks: WILCITY_ADDLISTING.oDayOfWeek,
                oTimeRangeLabel: WILCITY_ADDLISTING.oTimeRange,
                oTimeFormats: WILCITY_ADDLISTING.oTimeFormats,
                isShowForm: false,
                isChangedTimeFormat: false,
                isTwentyFormat: true,
                oPlanSettings: typeof this.$store !== 'undefined' && typeof this.$store.getters.getPlanSettings !== 'undefined' ? this.$store.getters.getPlanSettings : {}
            }
        },
        computed:{
            wrapperClass(){
                return {
                    'row': 1==1,
                    'disable': typeof this.oPlanSettings['toggle_'+this.settings.key] !== 'undefined' && this.oPlanSettings['toggle_'+this.settings.key] == 'disable'
                }
            },
            oHourOptions(){
                return [
                    {
                        value: 'open_for_selected_hours',
                        label: this.settings.openForSelectedHoursLabel
                    },
                    {
                        value: 'always_open',
                        label: this.settings.alwaysOpenLabel
                    },
                    {
                        value: 'no_hours_available',
                        label: this.settings.noHoursAvailableLabel
                    }
                ]
            }
        },
        methods:{
            oGenerateBusinessHourOptions(timeFormat, oBusinessHours){
                let aBusinessHourOptions = [];
                if ( timeFormat == 12 ){
                    return oBusinessHours;
                }else{
                    for ( let index in oBusinessHours ){
                        aBusinessHourOptions[index] = {};
                        aBusinessHourOptions[index].name = oBusinessHours[index].name24;
                        aBusinessHourOptions[index].value = oBusinessHours[index].value;
                    }
                }
                return aBusinessHourOptions;
            },
            updateTimeFormat(val){
                this.$set(this.settings.value, 'timeFormat', val);
                if ( val == 12 ){
                    this.aBusinessHoursOptions = this.aTwelveFormat;
                }else{
                    if ( this.aTwentyFourFormat.length ){
                        this.aBusinessHoursOptions = this.aTwentyFourFormat;
                    }else{
                        for ( let index in this.aTwelveFormat ){
                            this.aTwentyFourFormat[index] = {};
                            this.aTwentyFourFormat[index].name = this.aTwelveFormat[index].name24;
                            this.aTwentyFourFormat[index].value = this.aTwelveFormat[index].value;
                        }
                        this.aBusinessHoursOptions = this.aTwentyFourFormat;
                    }
                }

                this.$store.commit('updateNewBusinessHours', {
                   cId: this.cId,
                   aHours: this.aBusinessHoursOptions
                });
            },
            updateHourOption(val){
                this.settings.value.hourMode = val;
                if ( val === 'open_for_selected_hours' ){
                    this.isShowForm = true;
                }else{
                    this.isShowForm = false;
                }
            },
            updateOpenedDay(val, oSettings){
                this.settings.value.businessHours[oSettings.dayKey].isOpen = val;
            },
            updateOpenFrom(val, oSettings){
                this.settings.value.businessHours[oSettings.dayKey].operating_times[oSettings.index]['from'] = val;
            },
            updateOpenTo(val, oSettings){
                this.settings.value.businessHours[oSettings.dayKey].operating_times[oSettings.index]['to'] = val;
            },
            setDefault(){
                let oDefaultBusinessHours = {
                    monday: this.defaultDaySetting(),
                    tuesday: this.defaultDaySetting(),
                    wednesday: this.defaultDaySetting(),
                    thursday: this.defaultDaySetting(),
                    friday: this.defaultDaySetting(),
                    saturday: this.defaultDaySetting(),
                    sunday: this.defaultDaySetting()
                };

                if (typeof this.settings.value.businessHours=='undefined'){
                    this.settings.value = {};
                    Vue.set(this.settings.value, 'businessHours', oDefaultBusinessHours);
                }else{
                    this.settings.value.businessHours = Object.assign(oDefaultBusinessHours, this.settings.value.businessHours);
                }

                if ( typeof this.settings.value.timeFormat == 'undefined' ){
                    Vue.set(this.settings.value, 'timeFormat', 12);
                }

                if ( typeof this.settings.value.hourMode == 'undefined' ){
                    Vue.set(this.settings.value, 'hourMode', 'open_for_selected_hours');
                }

                if ( this.settings.value.hourMode == 'open_for_selected_hours' ){
                    this.isShowForm = true;
                }
            },
            defaultDaySetting(){
                let aParseHour = [],
                    defaultOpeningHour = this.settings.stdOpeningTime,
                    defaultClosedHour = this.settings.stdClosedTime;

                return {
                    isOpen: 'no',
                    operating_times: [
                        {
                            from: this.settings.stdOpeningTime,
                            to: this.settings.stdClosedTime
                        }
                    ]
                };
            },
            addOperatingTime(dayKey){
                if ( this.settings.value.businessHours[dayKey].operating_times.length > 1 ){
                    return false;
                }

                this.settings.value.businessHours[dayKey].operating_times.push({
                    from: '',
                    to: ''
                });
            },
            removeOperatingTime(dayKey, index){
                this.settings.value.businessHours[dayKey].operating_times.splice(index, 1);
            }
        },
        components:{
            WilokeCheckbox,
            WilokeInput,
            WilokeSelectTwo,
            WilokeRadio
        },
        beforeMount(){
            this.setDefault();
        }
    }
</script>
