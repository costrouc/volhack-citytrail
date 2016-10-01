"use strict";
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


//Modal stuff
//get the modal
var newUserModal = document.getElementById('newUserModal');
//New user submit
document.getElementById("newUserForm").onsubmit = function(){
    newUserModal.style.display = "none";
    var mainForm = document.getElementById("newUserForm");
    sendPlayer(mainForm.elements["Username"].value, mainForm.elements["Icons"].value);
    return false; //Prevent page reload
};

//Handle getting player icons
window.onload = function(){
    addIcons(document.getElementById("newUserIcons"));
};

function addIcons(parentDiv){
    //Replace this with actual icon loading
    var icons = ["data/icons/player1.png", "data/icons/player2.png","data/icons/player3.png","data/icons/player4.png","data/icons/player5.png"];
    for(var i = 0; i < icons.length; i++)
    {
        var curNode = document.createElement("label");
        var curRadio = document.createElement("input");
        curRadio.setAttribute("type", "radio");
        curRadio.setAttribute("name", "Icons");
        curRadio.setAttribute("value", "player" + (i + 1));
        var curImage = document.createElement("img");
        curImage.setAttribute("src", icons[i]);
        curNode.appendChild(curRadio);
        curNode.appendChild(curImage);
        parentDiv.appendChild(curNode);
    }
};

function sendPlayer(username, playerIcon)
{
    console.log('userName = ' + username);
    console.log('icon = ' + playerIcon);
}
