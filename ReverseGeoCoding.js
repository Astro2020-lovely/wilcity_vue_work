export const ReverseGeoCoding = {
    data() {
        return {lat: '', lng: '', errMsg: '', mapType: ''}
    },
    methods: {
        async googleMapFindAddressByLatLng() {
            const geocoder = new google.maps.Geocoder

            await geocoder.geocode({
                'location': {
                    lat: lat,
                    lng: lng
                }
            }, ((oResults, status) => {
                if (status === 'OK') {
                    if (oResults[0]) {
                        return oResults[0].formatted_address
                    } else {
                        this.errMsg = 'No results found'
                        return false
                    }
                } else {
                    this.errMsg = 'Geocoder failed due to: ' + status
                    return false
                }
            }))
        },

        async mapboxFindAddressByLatLng() {
            const baseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + this.lng + ',' + this.lat + '.json?access_token=' + WILOKE_GLOBAL.mapAPI;
            const oAddress = await jQuery.get(baseURL);
            if (oAddress.features[0]) {
                return oAddress.features[0].place_name;
            }
            return false;
        },

        getAddressByLatLng() {
            if (WILOKE_GLOBAL.mapType === 'mapbox') {
                return this.mapboxFindAddressByLatLng()
            } else {
                return this.googleMapFindAddressByLatLng();
            }
        }
    }
}
