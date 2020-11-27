<template>
    <div class="field_module__1H6kT field_style2__2Znhe mb-15 js-field">
        <div class="field_wrap__Gv92k">
            <div class="js-slider-info" :data-active="infoStatus">
                <span class="js-slider-info__number">{{value}}</span>
                <span  v-if="settings.unit" class="js-slider-info__unit"> {{settings.unit}}</span>
            </div>
            <div class="js-slider"></div>
            <span class="field_label__2eCP7 text-ellipsis">{{settings.label}}</span>
            <span class="bg-color-primary"></span>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                originalVal: this.settings.value,
                value: this.settings.value,
                $slider: null
            }
        },
        props: ['settings', 'wrapperClass'],
        mounted(){
            this.slider();
            this.resetValue();
        },
        computed: {
            infoStatus(){
               return this.value > 0 ? 'true' : '';
            }
        },
        methods: {
            resetValue(){
                this.$parent.$on('resetEverything', ()=>{
                    this.value = this.originalVal;
                    this.$slider.slider('value', this.originalVal);
                });
            },
            slider(){
                let self = jQuery(this.$el),
                    info = self.find('.js-slider-info');
                    this.$slider = self.find('.js-slider');

                this.$slider.slider({
                    range: 'min',
                    min: 0,
                    max: parseFloat(this.settings.maximum),
                    value: parseFloat(this.value),
                    slide: (event, ui) => {
                        this.value = ui.value;
                        this.$slider.attr('data-slider-value', this.value);
                    },
                    stop: (event, ui)=>{
                        this.$emit('sliderChanged', ui.value, this.settings);
                    }
                });
            }
        }
    }
</script>
