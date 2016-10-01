"use strict";

var UID = "asdf";
var mock_players = [
    {
        username: "Chris Ostrouchov",
        uid: "1234"
        position: {x: -110.4140625, y: 30.2578125},
        image: "/data/icons/player1.png",
        transportation: "WALK",
        path: null
    },
    {
        username: "Tyler Whittin",
        uid: "1432"
        position: {x: -120.4140625, y: 50.2578125},
        image: "/data/icons/player3.png",
        transportation: "WALK",
        path: null
    },
    {
        username: 'Anonymous Coward',
        uid: "asdf",
        position: {x: 10.00, y: -10.2578125},
        image: "/data/icons/player2.png",
        transportation: "BIKE",
        path: null
    },
    {
        username: 'Bob',
        uid: "zxcv",
        position: {x: -90.4140625, y: -50.2578125},
        image: "/data/icons/player5.png",
        transportation: "CAR",
        path: null
    },
    {
        username: 'costrouc',
        uid: "qwer",
        position: {x: 70.4140625, y: 2.2578125},
        image: "/data/icons/player4.png",
        transportation: "WALK",
        path: null
    }
];

var mock_locations = [
    {
        position: {x: 30.4140625, y: 100.2578125},
        type: "CAR",
        image: "/data/icons/location1.png"
    },
    {
        position: {x: 50.4140625, y: 0.2578125},
        type: "CAR",
        image: "/data/icons/location1.png"
    },
    {
        position: {x: -10.4140625, y: -50.2578125},
        type: "EXIT",
        image: "/data/icons/destination.png"
    },
    {
        position: {x: 30.4140625, y: -90.2578125},
        type: "BIKE",
        image: "/data/icons/location2.png"
    }
];

var mock_userSelection = {
    option: 2,
    target: {x: 10.0, y: 30.0},
    uid:
};

var mock_options = [
    "Option 1", "Option 2", "Option 3", "Option 4", "Option 5"
];

var mock_events = [
    "You got Polio!", "You won..."
];

var locationTypes = ["CAR", "BIKE", "EXIT"];

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
