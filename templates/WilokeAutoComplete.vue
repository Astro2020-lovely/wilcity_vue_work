<template>
    <div :class="parseWrapperClass">
        <div class="field_wrap__Gv92k">
            <input :id="generateID" v-if="settings.isRequired" v-model="place" class="field_field__3U_Rt" type="text" :placeholder="placeholder" @change="onChanged">
            <input v-else v-model="place" :id="generateID" class="field_field__3U_Rt" type="text" :placeholder="placeholder" @change="onChanged">
            <span class="bg-color-primary"></span>
            <div v-if="settings.askVisitorForLocation=='yes'" class="field_right__2qM90 pos-a-center-right"><a class="field_icon__1_sOi" href="#" style="cursor: pointer; pointer-events: auto;" @click.prevent="askMyLocation"><i class="la la-map-pin"></i></a></div>
        </div>
        <span class="field_message__3Z6FX color-quaternary" v-show="settings.errMsg!=''">{{settings.errMsg}}</span>
    </div>
</template>
<script>
    export default{
        props: {
            settings: {
                type: Object,
                default: ()=>{
                    return {
                        value: '',
                        askVisitorForLocation: 'no',
                        isRequired: 'no',
                        placeholder: ''
                    }
                }
            },
            wrapperClass: {
                type: String,
                default: 'field_module__1H6kT field_style2__2Znhe mb-15'
            }
        },
        data(){
            return {
                instSearchBox: {},
                instAutocomplete: {},
                oGeoCode: {},
                geocoder: null,
                place: typeof this.settings.value != 'undefined' ? this.settings.value : '',
                placeholder: typeof this.settings.placeholder !== 'undefined' ? this.settings.placeholder : this.place,
                originalValue: this.settings.value,
                oTranslation: WILCITY_I18,
                countryRestriction: typeof WILOKE_GLOBAL.searchCountryRestriction !== 'undefined' ? WILOKE_GLOBAL.searchCountryRestriction : '',
                fieldID: null
            }
        },
        computed: {
            generateID(){
                let oDate = new Date();
	            this.fieldID = 'wilcity-searchbox-field-' + oDate.getUTCMilliseconds();
	            return this.fieldID;
            },
            parseWrapperClass(){
                if ( this.place.length ){
                    return this.wrapperClass + ' active';
                }

                return this.wrapperClass;
            }
        },
        methods: {
            parseCountryRestriction(){
                if ( !this.countryRestriction.length ){
                    return '';
                }

                let aRaw = this.countryRestriction.split(',');
                return aRaw.map((val)=>{
                    return val.trim();
                });
            },
            getAddressByLatLng(lat, lng){
                if ( WILOKE_GLOBAL.mapType == 'mapbox' ){
                    let baseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' +lng+','+lat+ '.json?access_token='+WILOKE_GLOBAL.mapAPI+'&types=poi';
                    if ( typeof WILOKE_GLOBAL.mapLanguage !== 'undefined' && WILOKE_GLOBAL.mapLanguage.length ){
                        baseURL += '&language='+WILOKE_GLOBAL.mapLanguage;
                    }
                    jQuery.get(baseURL, (oResponse=>{
                        if ( typeof oResponse.features !== 'undefined' && oResponse.features.length ){
                            this.oGeoCode.address = oResponse.features[0].place_name;
                            this.place = this.oGeoCode.address;
                            
                            this.$emit('geocode-changed', this.oGeoCode, this.settings);
                        }
                    }))
                }else{
                    if ( this.geocoder == null ){
                        this.geocoder = new google.maps.Geocoder();
                    }
                    let latlng = new google.maps.LatLng(lat, lng);

                    this.geocoder.geocode({
                        'latLng': latlng
                    }, ((results, status) => {
                        if (status === google.maps.GeocoderStatus.OK) {
                            this.oGeoCode.address = results[0].formatted_address;
                            this.place = this.oGeoCode.address;
                            
                            this.$emit('geocode-changed', this.oGeoCode, this.settings);
                        }
                    }));
                }
            },
            askMyLocation(){
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((oShowPosition)=>{
                        this.oGeoCode.lat = oShowPosition.coords.latitude;
                        this.oGeoCode.lng = oShowPosition.coords.longitude;
                        this.getAddressByLatLng(oShowPosition.coords.latitude, oShowPosition.coords.longitude);
                    });
                } else {
                    alert(this.oTranslation.geoCodeIsNotSupportedByBrowser);
                }
            },
            getPlaces(){
                let oPlaces = this.instSearchBox.getPlaces();
                if (oPlaces.length === 0) {
                    this.$emit('geocode-changed', '', this.settings);
					return false;
				}

                let oPlace = oPlaces.pop(),
                    aGeoCode = {
                        address: oPlace.formatted_address,
                        lat: oPlace.geometry.location.lat(),
                        lng: oPlace.geometry.location.lng()
                    };
                this.place = oPlace.formatted_address;
                this.$emit('geocode-changed', aGeoCode, this.settings);
            },
            getPlace(){
                let oPlace = this.instSearchBox.getPlace();
                if (!oPlace.geometry) {
                    this.$emit('geocode-changed', '', this.settings);
                    return false;
                }
                let aGeoCode = {
                    address: oPlace.formatted_address,
                    lat: oPlace.geometry.location.lat(),
                    lng: oPlace.geometry.location.lng()
                };
                
                this.place = oPlace.formatted_address;
                this.$emit('geocode-changed', aGeoCode, this.settings);
            },
            init(){
                if ( WILOKE_GLOBAL.mapType == 'mapbox' ){
                    this.mapboxAutoComplete();
                }else{
                    this.googleAutoComplete();
                }
            },
            mapboxBoundingBox(){
                let aParseStart = [], aParseEnd = [];
                if ( WILOKE_GLOBAL.isUseMapBound == 'no' || WILOKE_GLOBAL.mapBoundStart == '' || WILOKE_GLOBAL.mapBoundEnd == '' ){
                    return false;
                }else{
                    aParseStart = WILOKE_GLOBAL.mapBoundStart.split(',');
                    aParseEnd = WILOKE_GLOBAL.mapBoundEnd.split(',');
                }

                return [ parseFloat(aParseStart[1]), parseFloat(aParseStart[0]), parseFloat(aParseEnd[1]), parseFloat(aParseEnd[0]) ];
            },
            buildMapboxSearchURL(query){
                let baseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(query) + '.json?access_token='+WILOKE_GLOBAL.mapAPI+'&limit=10&autocomplete=true';
                if( WILOKE_GLOBAL.searchCountryRestriction ) {
                    baseURL += '&country=' + WILOKE_GLOBAL.searchCountryRestriction;
                }
                // let bbox = this.mapboxBoundingBox();

                // if(bbox) {
                //     baseURL += '&bbox=' + bbox.join(',');
                // }
                return baseURL;
            },
            mapboxAutoComplete(){
                let place = this.place,
                    selected = false,
                    oGeoCode = {
                        address: this.place
                    };
                jQuery('#'+this.generateID).autocomplete({
                    closeOnSelect: true,
                    source: ( (request, response )=>{
                        jQuery.ajax({
                            type: 'GET',
                            url: this.buildMapboxSearchURL(this.place),
                            success: (data=>{
                                if ( data.features.length ){
                                    let aSuggestions =  data.features.map((oSuggestion=>{
                                        return {
                                            geocode: oSuggestion.center,
                                            label: oSuggestion.place_name,
                                            value: oSuggestion.place_name
                                        };
                                    }), data.features);

                                    response(aSuggestions);
                                }else{
                                    response([]);
                                }
                            })
                        });
                    }),
                    select: ((event, oSelected)=>{
                        this.place = oSelected.item.value;
                        oGeoCode.address = oSelected.item.value;
                        oGeoCode.lat = oSelected.item.geocode[1];
                        oGeoCode.lng = oSelected.item.geocode[0];
                        this.$emit('geocode-changed', oGeoCode, this.settings);
                        selected = true;
                    }),
                    search: (( event, ui ) => {
                        oGeoCode.address = this.place;
                    }),
                    open: function () {
                        jQuery(this).data('uiAutocomplete').menu.element.addClass('wil-auto-complete wil-mapbox-geocode');
                    }
                }).blur( () => {
                    if( !selected && place != oGeoCode.address) {
                        this.$emit('geocode-changed', oGeoCode, this.settings);
                        selected = false;
                    }
                });
            },
            googleAutoComplete(){
                new Promise((resolve, reject)=>{
                    if ( typeof google !== 'undefined' ){
                        resolve('loaded');
                    }
                }).then((msg)=>{
                    let target = document.getElementById(this.fieldID);
                    
                    if ( target ){
                        if ( typeof google.maps.places.Autocomplete === 'function' ){
                            let aRestriction = this.parseCountryRestriction();
                            if ( aRestriction.length ){
                                var options = {
                                    componentRestrictions: {country: aRestriction}
                                };
                                this.instSearchBox = new google.maps.places.Autocomplete(target, options);
                            }else{
                                this.instSearchBox = new google.maps.places.Autocomplete(target);
                            }
                            this.instSearchBox.addListener('place_changed', this.getPlace);
                        }else{
                            this.instSearchBox = new google.maps.places.SearchBox(target);
                            this.instSearchBox.addListener('places_changed', this.getPlaces);
                        }
                    }
                })
            },
            resetValue(){
                this.$parent.$on('resetEverything', ()=>{
                    this.place = this.originalValue;
                });
            },
            onChanged(event){
                if ( event.target.value==='' ){
                    this.$emit('geocode-changed', '', this.settings);
                }
            }
        },
        mounted(){
            this.init();
            this.resetValue();
        }
    }
</script>
