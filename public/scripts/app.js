require([
    "esri/map",
    "esri/layers/VectorTileLayer",
    "esri/graphic", "esri/layers/GraphicsLayer",
    "esri/geometry/Point", "esri/symbols/PictureMarkerSymbol",
    "dojo/domReady!"
], function(Map,
            VectorTileLayer,
            Graphic, GraphicsLayer,
            Point, PictureMarkerSymbol) {
    var map = new Map("mapView", {
        zoom: 4,
        center: [15, 65]
    });

    // url, width px, height px
    var player1 = new PictureMarkerSymbol("/data/icons/player1.png", 100, 100);
    var point = new Point(-104.4140625, 69.2578125, map.spatialReference);
    var attr = {"name": "blah blah", "speed": 10};

    // TODO: Can display infoTemplate (html thing for each graphic)
    var graphic = new Graphic(
        point,
        player1,
        attr
    );

    var tileLayer = new VectorTileLayer("/data/basemap-theme.json");
    var graphicsLayer = new GraphicsLayer();
    map.addLayer(tileLayer);
    map.addLayer(graphicsLayer);
    graphicsLayer.add(graphic);
});
