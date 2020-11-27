<template>
    <div class="field_module__1H6kT field_style2__2Znhe mb-15 js-field">
        <div class="row">
            <div class="col-xs-12">
                <wiloke-checkbox :settings="oToggleBusinessHours"></wiloke-checkbox>
                <div class="list-hours_module__CE4hn js-list-hours">
                    <table class="list-hours_table__1B4UJ">
                        <tbody>
                            <tr v-for="(dayName in dayKey) in oDaysOfWeeks" class="list-hours_tr__1TA9B">
                                <td class="list-hours_day__11G3l">
                                    <wiloke-checkbox :settings="{label:dayName, value: getClosedStatus(dayKey)}"></wiloke-checkbox>
                                </td>
                                <td v-for="oOpenTime in getOperatingTimeOfDays(dayKey)" class="list-hours_hours__3uYGr">
                                    <div class="list-hours_hoursItem__3kmyv">
                                        <div class="row">
                                            <div class="col-xs-6">
                                                <div class="field_module__1H6kT field_style2__2Znhe mb-15 js-field">
                                                    <wiloke-input :settings="{label: WILCITY_ADDLISTING.oTimeRange.from, value:oOpenTime.from}"></wiloke-input>
                                                </div>
                                            </div>
                                            <div class="col-xs-6">
                                                <div class="field_module__1H6kT field_style2__2Znhe mb-15 js-field">
                                                    <wiloke-input :settings="{label: WILCITY_ADDLISTING.oTimeRange.to, value:oOpenTime.to}"></wiloke-input>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import WilokeCheckbox from './WilokeCheckbox.vue'
    import WilokeInput from './WilokeInput.vue'

    export default{
        props: ['settings'],
        data(){
            return {
                oToggleBusinessHours: {
                    status:1,
                    label:settings.toggleLabel,
                    oDaysOfWeeks: WILCITY_ADDLISTING.oBusinessHours
                }
            }
        },
        mounted(){

        },
        beforeMount(){
            this.setToggleBusinessHours();
        },
        methods:{
            setToggleBusinessHours(){
                if ( typeof this.settings.value === 'object' ){
                    this.oToggleBusinessHours.status = this.value.toggleBusinessHours = this.settings.value.oToggleBusinessHours;
                }
            },
            getClosedStatusOfDay(dayKey){
                if (this.settings.value==''){
                    return 0;
                }

                return this.settings.value[dayKey].value;
            },
            getOperatingTimeOfDays(dayKey){
                if (this.settings.value==''){
                    return [{
                        from: '',
                        to: ''
                    }];
                }

                return this.settings.value[dayKey].operating_times;
            }
        },
        components:{
            WilokeCheckbox,
            WilokeInput
        }
    }
</script>
