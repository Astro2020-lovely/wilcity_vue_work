export default {
    data() {
        return {images: [], errMsg: ""}
    },
    watch: {
        images: {
            handler(newVal) {
                this.$emit("change", newVal);
            },
            deep: true
        }
    },
    computed: {
        isMultiple() {
            return this.maximumItems > 1;
        }
    },
    mounted() {
        this.setDefault();
    },
    props: {
        value: {
            type: [
                Array, Object
            ],
            default: () => []
        },
        field: {
            type: Object,
            default: () => {}
        },
        isRequired: {
            type: Boolean,
            default: false
        },
        maximumItems: {
            type: Number,
            default: 1,
            required: false
        },
        wrapperClasses: {
            type: String,
            default: "field_module__1H6kT field_style2__2Znhe"
        },
        innerClasses: {
            type: String,
            default: "field_wrap__Gv92k"
        },
        label: {
            type: String,
            default: ""
        }
    },
    methods: {
        setDefault() {
            if (this.isMultiple) {
                if (this.value.length) {
                    this.images = [...this.value];
                }
            } else {
                if (this.value.src) {
                    this.images = {
                        ...this.value
                    };
                }
            }
        }
    }
}
