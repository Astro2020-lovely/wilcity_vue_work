const CreateHTMLMapMarker = ({
    googleOverView = new google.maps.OverlayView(),
    ...args
}) => {
    const CustomMapMarker = function (latlng, map, args) {
        this.latlng = latlng;
        this.args = args;
        this.setMap(map);
    }

    CustomMapMarker.prototype = googleOverView;

    CustomMapMarker.prototype.draw = function () {
        let div = this.div;

        if (! div) {
            div = this.div = document.createElement('div');
            div.className = 'marker_module__2Kxbk';
            div.style.width = '48px';

            let svgCanvas = document.createElement('div');
            svgCanvas.className = 'marker_background__47Zv3';
            let svnImg = document.createElement('IMG');
            svnImg.src = this.args.markerSvg;
            svgCanvas.appendChild(svnImg);

            let a = document.createElement('a');
            a.href = '#';

            let markerThumb = document.createElement('div');
            markerThumb.className = 'marker_thumb__2NXEV';
            markerThumb.style.backgroundImage = "url('" + this.args.logoUrl + "')";

            let logo = document.createElement('IMG');
            logo.src = this.args.logoUrl;
            markerThumb.appendChild(logo);

            a.appendChild(markerThumb);

            div.appendChild(svgCanvas);
            div.appendChild(a);

            div.dataset.marker_id = this.args.marker_id;
            google.maps.event.addDomListener(div, "click", event => {
                event.preventDefault();
                google.maps.event.trigger(this, "click");
            });

            let panes = this.getPanes();
            panes.overlayImage.appendChild(div);
        }

        const point = this.getProjection().fromLatLngToDivPixel(this.latlng);

        if (point) {
            div.style.left = point.x + 'px';
            div.style.top = point.y + 'px';
        }
    };

    CustomMapMarker.prototype.remove = function () {
        if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    };

    CustomMapMarker.prototype.getPosition = function () {
        return this.latlng;
    };

    return new CustomMapMarker(args.latLng, args.map, args);
};

export {
    CreateHTMLMapMarker
}
