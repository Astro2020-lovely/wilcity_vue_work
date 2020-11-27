<template>
    <div class="field_module__1H6kT field_style2__2Znhe mb-15">
        <div class="field_wrap__Gv92k">
            <input v-if="settings.isRequired" v-model="settings.value" class="field_field__3U_Rt" type="time" required @change="updatedTime">
            <input v-else v-model="settings.value" class="field_field__3U_Rt" type="time" @change="updatedTime">
            <span class="field_label__2eCP7 text-ellipsis">{{settings.label}}</span><span class="bg-color-primary"></span>
            <div class="field_right__2qM90 pos-a-center-right"><span class="field_icon__1_sOi"><i class="la la-clock-o"></i></span></div>
        </div>
        <span class="field_message__3Z6FX color-quaternary" v-if="settings.errMsg">{{settings.errMsg}}</span>
    </div>
</template>
<script>
    export default{
        props: {
            settings: {
                type: Object,
                value: '00:00:AM',
                isRequired: 'no'
            }
        },
        methods:{
            updatedTime(){
                this.$emit('timeChanged', this.settings.value, this.settings);
            }
        }
    }
</script>
