<template>
    <div>
        <component v-for="(oField, order) in aFields" v-on:input="oField.value=$target" v-on:uploadImgChanged="oField.value=$target" :is="oField.component" :settings="oField.settings" :key="generateComponentID(oField)"></component>
    </div>
</template>
<script>
import WilokeSelect2 from './WilokeSelectTwo.vue'
import WilokeCheckbox2 from './WilokeCheckboxTwo.vue'
import WilokeText from './WilokeInput.vue'
import WilokeTextarea from './WilokeTextarea.vue'
import WilokeUploadImg from './WilokeUploadImg.vue'

export default{
    props: {
        aFields: {
            type: Array,
            default: {}
        }
    },
    methods: {
        generateComponentID(oField){
            return 'wiloke-group' + oField.component;
        }
    },
    components:{
        WilokeSelect2,
        WilokeCheckbox2,
        WilokeText,
        WilokeTextarea,
        WilokeUploadImg
    }
}
</script>
