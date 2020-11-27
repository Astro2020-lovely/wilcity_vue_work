<template>
    <div class="field_module__1H6kT field_style2__2Znhe mb-15 js-field">
        <div class="field_wrap__Gv92k">
            <input v-if="settings.isRequired" v-model="settings.value" class="field_field__3U_Rt" type="datetime-local" required @change="updatedDateTime">
            <input v-else v-model="settings.value" class="field_field__3U_Rt" type="datetime-local" @change="updatedDateTime">
            <span class="field_label__2eCP7 text-ellipsis">{{settings.placeholder}}</span>
            <span class="bg-color-primary"></span>
        </div>
        <span class="field_message__3Z6FX color-quaternary" v-if="settings.errMsg">{{settings.errMsg}}</span>
    </div>
</template>
<script>
    export default{
        props: ['settings'],
        methods:{
            updatedDateTime(){
                this.$emit('dateTimeChanged', this.settings.value, this.settings);
            }
        }
    }
</script>
