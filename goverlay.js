/**
 * custom google map overlay container for multiple markers.
 * @author : Saket Pandey
 */

var GOverlay = GOverlay || (function($){

    function GOverlay (options){

        this.div_ = null;
        this.map_ = options.map;
        this.markerList = options.markers;

        //Assign this overlay to a map
        this.setMap(options.map);
    }

    //Inheriting native google overlay
    GOverlay.prototype = new google.maps.OverlayView();
    GOverlay.prototype.onAdd = function(){
        var div = document.createElement('div');
        div.style.border = 'none';
        div.style.borderWidth = '0px';
        //div.style.position = 'absolute';

        this.div_ = div;
        //Add this element to overlay pane
        var panes = this.getPanes();
        //Attach it to 'overlayMouseTarget' so that it receives DOM events
        //https://developers.google.com/maps/documentation/javascript/reference#MapPanes
        panes.overlayMouseTarget.appendChild(div);
        var me = this;
        google.maps.event.addDomListener(div, 'click', function(e){
            console.log('GOverlay click | e: ', e);
        });
        google.maps.event.addDomListener(div, 'mouseover', function(e){
            console.log('GOverlay mouseover | e: ', e);
        });
        google.maps.event.addDomListener(div, 'mouseout', function(e){
            console.log('GOverlay mouseout | e: ', e);
        });
    };
    // Note: setMap(null) calls OverlayView.onRemove()
    GOverlay.prototype.onRemove = function(){
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    };
    GOverlay.prototype.draw = function(){
        var zoom = this.getMap().getZoom();
        var projection = this.getProjection();

        //For performance reasons I'm using here docfrag...
        var fragment = document.createDocumentFragment();

        //Enuff said :X :X ....Plot now..
        this.markerList.each(function(markerModel){
            var latLng = new google.maps.LatLng(markerModel.get('lat'), markerModel.get('lng'));
            var planePos = projection.fromLatLngToDivPixel(latLng);
            var tmpl = document.getElementById('tmpl-srp-marker').innerHTML;
            var _tmpl = _.template(tmpl);
            var compiledTmpl = _tmpl(markerModel.toJSON());
            var tmpDiv = document.createElement('div');
            tmpDiv.innerHTML = compiledTmpl;
            var markerDomNode = tmpDiv.children[0];
            //position this marker...
            markerDomNode.style.left = planePos.x+'px';
            markerDomNode.style.top = planePos.y+'px';
            markerDomNode.style.position = 'absolute';
            markerDomNode.style.cursor = 'pointer';
            fragment.appendChild(markerDomNode);
        });

        //all done !!
        this.div_.appendChild(fragment);
        console.log('DONE: Markers Plotting....');
    };

    return GOverlay;

})(jQuery);
