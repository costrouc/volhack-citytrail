require([
    "esri/map",
    "esri/layers/VectorTileLayer",
    "dojo/domReady!"
], function(Map, VectorTileLayer) {
    var map = new Map("mapView", {
        zoom: 4,
        center: [15, 65]
    });

    var tileLayer = new VectorTileLayer("/data/basemap-theme.json");
    map.addLayer(tileLayer);
});
