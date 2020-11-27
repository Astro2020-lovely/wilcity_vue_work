<template>
    <div :id="mapId" :class="wrapperClass" v-show="isShowing">
        <div style="height: 200px; background-color: #e7e7ed;"></div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                oTranslation: WILCITY_I18,
                isShowing: false,
                lat: null,
                lng: null
            }
        },
        props: ['rawLat', 'rawLng', 'mapId', 'isShowingImmediately', 'wrapperClass'],
        methods:{
            toggleMap(){

            },
            renderMap(){
                this.lat = parseFloat(this.rawLat);
                this.lng = parseFloat(this.rawLng);

                let oMap = new google.maps.Map(document.getElementById(this.mapId), {
                    zoom: 5,
                    center: {
                        lat: this.lat,
                        lng: this.lng
                    }
                });

                this.instMarker = new google.maps.Marker({
                    map: oMap,
                    position: {
                        lat: this.lat,
                        lng: this.lng
                    },
                    draggable: true,
                    anchorPoint: new google.maps.Point(0, -29)
                });
                this.isCreatedMap = true;
            }
        },
        mounted(){
            if ( this.isShowingImmediately ){
                this.renderMap();
            }
        }

    }
</script>
