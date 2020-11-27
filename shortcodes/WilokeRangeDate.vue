<template>
    <div class=row>
        <div class="col-md-6">
            <date-picker v-model="from" :settings="{value: from, label: fromLabel}" wrapper-class="field_module__1H6kT field_style2__2Znhe"></date-picker>
        </div>
        <div class="col-md-6">
            <date-picker v-model="to" :settings="{value: to, label: toLabel}" wrapper-class="field_module__1H6kT field_style2__2Znhe"></date-picker>
        </div>
    </div>
</template>
<script>
    import DatePicker from './../templates/WilokeDatepicker.vue'
    export default{
        data(){
            return {
                from: typeof this.value.from !== 'undefined' ? this.value.from :'',
                to: typeof this.value.to !== 'undefined' ? this.value.to :''
            }
        },
        props: ['fromLabel', 'toLabel', 'value'],
        components:{
            DatePicker
        },
        watch: {
            from: 'onChangedRange',
            to: 'onChangedRange'
        },
        methods: {
            onChangedRange(){
                this.$emit('onChangedRange', {
                    from: this.from,
                    to: this.to
                }, {key: 'date_range'});
            },
            reset(){
                this.$parent.$on('resetEverything', ()=>{
                    this.$emit('resetEverything', {
                        from: '',
                        to:''
                    }, {key: 'date_range'});
                })
            }
        },
        mounted(){
            this.reset();
        }
    }
</script>
