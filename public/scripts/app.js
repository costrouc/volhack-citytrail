require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/VectorTileLayer",
    "dojo/domReady!"
], function(Map, MapView, VectorTileLayer) {
    var map = new Map();

    var view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 4,
        center: [15, 65]
    });

    var tileLayer = new VectorTileLayer("/data/basemap-theme.json");
    map.add(tileLayer);
});
