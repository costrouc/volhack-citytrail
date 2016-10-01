"use strict";
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


//Modal stuff
//get the modal
var newUserModal = document.getElementById('newUserModal');
//New user submit
document.getElementById("newUserForm").onsubmit = function(){
    newUserModal.style.display = "none";
    alert('userName = ' + document.getElementById("newUserForm").elements["Username"].value); 
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
        curRadio.setAttribute("name", "icons");
        curRadio.setAttribute("value", "small");
        var curImage = document.createElement("img");
        curImage.setAttribute("src", icons[i]);
        curNode.appendChild(curRadio);
        curNode.appendChild(curImage);
        parentDiv.appendChild(curNode); 
    }
};

