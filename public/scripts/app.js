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
var UID = "asdf";
var USER_SELECTION = {
    option: null,
    target: null,
    uid: null
};

var NEEDS_UPDATE = false;
var STATE_OUTPUT = null;
var USER_CREATED = false;
var MAP = null;

var QUIT = true;

require([
    "esri/map",
    "esri/InfoTemplate",
    "esri/layers/VectorTileLayer",
    "esri/graphic", "esri/layers/GraphicsLayer",
    "esri/geometry/Point", "esri/symbols/PictureMarkerSymbol",
    "esri/geometry/webMercatorUtils",
    "dojo/domReady!", "esri/process/Processor"
], function(Map,
            InfoTemplate,
            VectorTileLayer,
            Graphic, GraphicsLayer,
            Point, PictureMarkerSymbol,
            webMercatorUtils, Processor) {

    var drawPlayers = function(map, gl, players) {
        players.forEach(function(player) {
            var point = new Point(player.position.x,
                                  player.position.y,
                                  map.spatialReference);
            var symbol = new PictureMarkerSymbol(player.image, PLAYER_SIZE, PLAYER_SIZE);
            var info = new InfoTemplate(PLAYER_TEMPLATE.title, PLAYER_TEMPLATE.content);
            var attr = {
                name: player.username,
                uid: player.uid,
                transportation: player.transportation
            };
            gl.add(new Graphic(point, symbol, attr, info));
        });
    };

    var drawLocations = function(map, gl, locations) {
        locations.forEach(function(location) {
            var point = new Point(location.position.x,
                                  location.position.y,
                                  map.spatialReference);
            var symbol = new PictureMarkerSymbol(location.image, LOCATION_SIZE, LOCATION_SIZE);
            var info = new InfoTemplate(LOCATION_TEMPLATE.title, LOCATION_TEMPLATE.content);
            var attr = {
                name: location.type
            };
            gl.add(new Graphic(point, symbol, attr, info));
        });
    };

    var renderScene = function(serverOutput) {
        //if(MAP.getLayer("graphicsLayer") != null)
        //    MAP.removeLayer(MAP.getLayer("graphicsLayer"));
        var gl = new GraphicsLayer({id:"graphicsLayer"});

        MAP.addLayer(gl);
        drawPlayers(MAP, gl, serverOutput.players);
        drawLocations(MAP, gl, serverOutput.locations);
    };

    var initMap = function(center, zoom) {
        var map = new Map("mapView", {
            zoom: zoom,
            center: center
        });

        map.on('click', function(e) {
            USER_SELECTION.uid = UID;
            USER_SELECTION.position = webMercatorUtils.webMercatorToGeographic(e.mapPoint);

            console.log('User Select Target Location');
            console.log('Position: ', USER_SELECTION.position);
            console.log('uid: ', USER_SELECTION.uid);
        });

        var tileLayer = new VectorTileLayer("/data/basemap-theme.json");
        map.addLayer(tileLayer);
MAP = map;

    };


    function checkForUpdate()
    {
        if(USER_CREATED && QUIT)
        {
            var request = new XMLHttpRequest();
            request.open('POST', '/gameready', true);
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            request.onreadystatechange = function() {
                if (request.readyState == XMLHttpRequest.DONE)
                {
                    var response = JSON.parse(request.responseText);
                    if(response.status == true)
                    {
                        getUpdate();
                    }
                }

            }
            var uid = {
                    uid: UID
            };

            request.send(JSON.stringify(uid));
            QUIT = false;
        }
    }   

    function getUpdate()
    {
        var request = new XMLHttpRequest();
        request.open('GET', '/gamenext', true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                var data = JSON.parse(request.responseText);
                STATE_OUTPUT = data;
                NEEDS_UPDATE = true;
        renderScene(STATE_OUTPUT);
            } else {scripts/app.js
            // We reached our target server, but it returned an error

            }
        };

        request.onerror = function() {
        // There was a connection error of some sort
        };

        request.send();
    }

    initMap([15, 65], 4);
    setInterval(checkForUpdate,10000);
});


//Modal stuff
//New user submit
document.getElementById("newUserForm").onsubmit = function(e){
    e.preventDefault();
    //get the modal
    var newUserModal = document.getElementById('newUserModal');
    newUserModal.style.display = "none";

    var mainForm = document.getElementById("newUserForm");
    sendPlayer(mainForm.elements["Username"].value, mainForm.elements["Icons"].value);

    //Prevent page reload
    return false;
};

document.getElementById("playerInput").onsubmit = function(){
    e.preventDefault();

    var playerInputForm = document.getElementById("playerInput");

    var request = new XMLHttpRequest();
    request.open('POST', '/gameupdate', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(JSON.stringify(USER_SELECTION));


    return false;
};

//Handle getting player icons
window.onload = function(){
    addIcons(document.getElementById("newUserIcons"));
    setInterval(gameUpdate, 1000);
};



function addIcons(parentDiv){
    //TODO: Replace this with actual icon loading
    var icons = ["data/icons/player1.png", "data/icons/player2.png","data/icons/player3.png","data/icons/player4.png","data/icons/player5.png"];
    for(var i = 0; i < icons.length; i++)
    {
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

function sendPlayer(username, playerIcon)
{
    console.log('sending user');
    console.log('userName = ' + username);
    console.log('icon = ' + playerIcon);

    var userInfo = {
        username: username,
        icon: playerIcon
    };

    var request = new XMLHttpRequest();
    request.open('POST', '/signup', true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE)
        {
                var response = JSON.parse(request.responseText);
                if(response.uid)
                {
                        UID = response.uid;
                        USER_CREATED = true;
                }
        }

    }
    request.send(JSON.stringify(userInfo));
}

function updateSidePanel(options, events, player)
{
    updateEvent(events);
    updateOptions(options);
    var curPlayer;
    for(var i = 0; i < player.length; i++)
    {
            if(player[i].uid == UID)
            {
                    curPlayer = player[i];
            }
    }
    
    updatePlayerStats(curPlayer);
}

function updateEvent(events)
{
    var eventText = document.getElementById("eventText");
    eventText.innerHTML = "";
    for(var i = 0; i < events.length; i++)
    {
            eventText.innerHTML += events[i] + "</br>";
    }

    //TODO: update size?
}

function updateOptions(options)
{
    var optionList = document.getElementById("playerOptions");
    while(optionList.firstChild)
    {
        optionList.removeChild(optionList.firstChild);
    }
    for(var i = 0; i < options.length; ++i)
    {
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
    }
}

function updatePlayerStats(player)
{
    var username = document.getElementById("user");
    username.innerHTML = player.username;

    var movement = document.getElementById("movement");
    movement.innerHTML = "movement: " + player.transportation.toLowerCase();
}


function gameUpdate()
{
    if(NEEDS_UPDATE)
    {
        updateSidePanel(STATE_OUTPUT['options'], STATE_OUTPUT['events'], STATE_OUTPUT['players']);
    }
}
