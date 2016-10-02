"use strict";

// Global Settings
var LOCATION_TYPES = ["CAR", "BIKE", "EXIT"];
var PLAYER_SIZE = 30; // px
var LOCATION_SIZE = 40; // px
var PLAYER_TEMPLATE = {
    title: "<b>Player: ${name}</b>",
    content: "uid: ${uid} <br/>transportation: ${transportation}"
};
var LOCATION_TEMPLATE = {
    title: "<b>Location ${name}</b>",
    content: "..."
};

// User State
var UID = null;
var USER_SELECTION = {
    option: null,
    target: null,
    uid: null
};

var NEEDS_UPDATE = false;
var STATE_OUTPUT = null;
var USER_CREATED = false;
var MAP = null;


var postSignUp = function(username, icon) {
    var request = new XMLHttpRequest();
    request.open('POST', '/signup');
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onreadystatechange = function() {
        if (request.status >= 200 && request.status < 400) {
            var player = JSON.parse(request.responseText);

            if (player) {
                UID = player.uid;
                USER_CREATED = true;

                updatePlayerStats(player);
            } else {
                console.log("Lobby is full cannot join! (Restart Web Server)");
            }
        }
    };
    var userInfo = {username: username, icon: icon};
    request.send(JSON.stringify(userInfo));
};

var postGameSubmit = function() {
    var request = new XMLHttpRequest();
    request.open('POST', '/gamesubmit');
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    // response does not matter
    request.send(JSON.stringify(USER_SELECTION));
};

var postGameReady = function() {
    var request = new XMLHttpRequest();
    request.open('POST', '/gameready');
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onreadystatechange = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            if (data.status === true) {
                NEEDS_UPDATE = true;
            }
        }
    };
    request.send(JSON.stringify({uid: UID}));
};

var postGameNext = function() {
    var request = new XMLHttpRequest();
    request.open('POST', '/gamenext');
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onreadystatechange = function() {
        if (request.status >= 200 && request.status < 400) {
            STATE_OUTPUT = JSON.parse(request.responseText);
            updateSidePanel(STATE_OUTPUT);
            renderScene();
            NEEDS_UPDATE = false;
        }
    };
    request.send(JSON.stringify({uid: UID}));
};

require([
    "esri/map",
    "esri/InfoTemplate",
    "esri/layers/VectorTileLayer",
    "esri/graphic", "esri/layers/GraphicsLayer",
    "esri/geometry/Point", "esri/symbols/PictureMarkerSymbol",
    "esri/geometry/webMercatorUtils",
    "esri/process/Processor",
    "dojo/domReady!"
], function(Map,
            InfoTemplate,
            VectorTileLayer,
            Graphic, GraphicsLayer,
            Point, PictureMarkerSymbol,
            webMercatorUtils,
            Processor) {

    var drawPlayers = function(map, gl, players) {
        players.forEach(function(player) {
            var point = new Point(player.position.x, player.position.y);
            var symbol = new PictureMarkerSymbol(player.image, PLAYER_SIZE, PLAYER_SIZE);
            var info = new InfoTemplate(PLAYER_TEMPLATE.title, PLAYER_TEMPLATE.content);
            var attr = {
                name: player.username,
                uid: player.uid,
                transportation: player.transportation
            };
            var graphic = new Graphic(point, symbol, attr, info);
            gl.add(graphic);
        });
    };

    var drawLocations = function(map, gl, locations) {
        locations.forEach(function(location) {
            var point = new Point(location.position.x, location.position.y);
            var symbol = new PictureMarkerSymbol(location.image, LOCATION_SIZE, LOCATION_SIZE);
            var info = new InfoTemplate(LOCATION_TEMPLATE.title, LOCATION_TEMPLATE.content);
            var attr = {
                name: location.type
            };
            var graphic = new Graphic(point, symbol, attr, info);
            gl.add(graphic);
        });
    };

    window.renderScene = function() {
        if(MAP.getLayer("graphicsLayer") != null)
            MAP.removeLayer(MAP.getLayer("graphicsLayer"));
        var gl = new GraphicsLayer({id: "graphicsLayer"});
        MAP.addLayer(gl);

        drawPlayers(MAP, gl, STATE_OUTPUT.players);
        drawLocations(MAP, gl, STATE_OUTPUT.locations);
    };

    var initMap = function(center, zoom) {
        var map = new Map("mapView", {
            zoom: zoom,
            center: center
        });

        map.on('click', function(e) {
            USER_SELECTION.uid = UID;
            USER_SELECTION.target = webMercatorUtils.webMercatorToGeographic(e.mapPoint);

            console.log('User Select Target Location');
            console.log('Position: ', USER_SELECTION.target);
            console.log('uid: ', USER_SELECTION.uid);
        });

        var tileLayer = new VectorTileLayer("/data/basemap-theme.json");
        map.addLayer(tileLayer);
        MAP = map;
    };


    var checkForUpdate = function() {
        if (USER_CREATED) {
            postGameReady();
        }

        if (NEEDS_UPDATE) {
            postGameNext();
        }
    };

    initMap([-85.0, 35.0], 8);
    setInterval(checkForUpdate, 5000);
});


document.getElementById("newUserForm").onsubmit = function(e){
    e.preventDefault();

    var newUserModal = document.getElementById('newUserModal');
    newUserModal.style.display = "none";

    var mainForm = document.getElementById("newUserForm");
    var username = mainForm.elements["Username"].value;
    var icon = mainForm.elements["Icons"].value;
    postSignUp(username, icon);

    return false;
};

document.getElementById("playerInput").onsubmit = function(e){
    e.preventDefault();

    USER_SELECTION.uid = UID;

    var playerInputForm = document.getElementById("playerInput");
    USER_SELECTION.option = 0;

    if (USER_SELECTION.target === null) {
        console.log("Must select target before making selection!");
        return false;
    }

    postGameSubmit();

    return false;
};

window.onload = function(){
    addIcons(document.getElementById("newUserIcons"));
};

function addIcons(parentDiv){
    //TODO: Replace this with actual icon loading
    var icons = [
        "data/icons/player1.png",
        "data/icons/player2.png",
        "data/icons/player3.png",
        "data/icons/player4.png",
        "data/icons/player5.png"
    ];
    for(var i = 0; i < icons.length; i++) {
        var curNode = document.createElement("label");
        var curRadio = document.createElement("input");
        curRadio.setAttribute("type", "radio");
        curRadio.setAttribute("name", "Icons");
        curRadio.setAttribute("value", i + 1);
        var curImage = document.createElement("img");
        curImage.setAttribute("src", icons[i]);
        curNode.appendChild(curRadio);
        curNode.appendChild(curImage);
        parentDiv.appendChild(curNode);
    }
};

function updateSidePanel(serverOutput) {
    updateEvent(serverOutput.events);
    updateOptions(serverOutput.options);

    var curPlayer;
    var players = serverOutput.players;
    for(var i = 0; i < players.length; i++) {
        if(players[i].uid == UID) {
            curPlayer = players[i];
        }
    }

    updatePlayerStats(curPlayer);
}

function updateEvent(events) {
    var eventText = document.getElementById("eventText");
    eventText.innerHTML = "";
    for(var i = 0; i < events.length; i++)
    {
            eventText.innerHTML += events[i] + "</br>";
    }

    //TODO: update size?
}

function updateOptions(options) {
    var optionList = document.getElementById("playerOptions");
    while(optionList.firstChild) {
        optionList.removeChild(optionList.firstChild);
    }
    for(var i = 0; i < options.length; ++i) {
       var curListItem = document.createElement("li");

       var curButton = document.createElement("input");
       curButton.setAttribute("type", "radio");
       curButton.setAttribute("name", "options");
       curButton.setAttribute("value", options[i]);

       var curLabel = document.createElement("label");
       curLabel.setAttribute("for", options[i]);
       curLabel.innerHTML = options[i];

       curListItem.appendChild(curButton);
       curListItem.appendChild(curLabel);
       optionList.appendChild(curListItem);
    };
};

function updatePlayerStats(player) {
    var username = document.getElementById("user");
    username.innerHTML = player.username;

    var movement = document.getElementById("movement");
    movement.innerHTML = player.transportation.toLowerCase();
};
