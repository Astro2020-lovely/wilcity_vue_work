<template>
    <span @input="onInput" contenteditable=true :class="elClass" v-html="value"/>
</template>

<script>
export default {
    props: {
        value: {
          type: String,
          default: '',
        },
        elClass:{
            type: String,
            default: '',
        }
    },
    methods: {
        onInput(e) {
            this.$emit('input', e.target.innerText);
        }
    }
};
</script>