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

var updateTimer;
var mainMap;
var graphicsLayer;

var mock_server_output = {
    players: [
        {
            username: "Chris Ostrouchov",
            uid: "1234",
            position: {x: -110.4140625, y: 30.2578125},
            image: "/data/icons/player1.png",
            transportation: "WALK",
            path: null
        },
        {
            username: "Tyler Whittin",
            uid: "1432",
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
    ],
    locations: [
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
            position: {x: 20.4140625, y: 10.2578125},
            type: "BIKE",
            image: "/data/icons/location2.png"
        }
    ],
    options: [
        "Option 1", "Option 2", "Option 3", "Option 4", "Option 5"
    ],
    events: [
        "You got Polio!", "You won..."
    ],
    paths: [null, null, null, null, null]
};


require([
    "esri/map",
    "esri/InfoTemplate",
    "esri/layers/VectorTileLayer",
    "esri/graphic", "esri/layers/GraphicsLayer",
    "esri/geometry/Point", "esri/symbols/PictureMarkerSymbol",
    "dojo/domReady!"
], function(Map,
            InfoTemplate,
            VectorTileLayer,
            Graphic, GraphicsLayer,
            Point, PictureMarkerSymbol) {

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

    var renderScene = function(map, gl, serverOutput) {
        //TODO: reset graphics
        drawPlayers(map, gl, serverOutput.players);
        drawLocations(map, gl, serverOutput.locations);
    };

    var initMap = function(center, zoom) {
        var map = new Map("mapView", {
            zoom: zoom,
            center: center
        });

        map.on('click', function(e) {
            USER_SELECTION.uid = UID;
            USER_SELECTION.position = e.mapPoint.toJson();

            console.log('User Select Target Location');
            console.log('Position: ', USER_SELECTION.position);
            console.log('uid: ', USER_SELECTION.uid);
        });

        var tileLayer = new VectorTileLayer("/data/basemap-theme.json");
        var gl = new gl();
        map.addLayer(tileLayer);
        map.addLayer(gl);

        
        
        mainMap = map;
        graphicsLayer = gl;
        //renderScene(map, graphicsLayer, mock_server_output);
    };

    initMap([15, 65], 4);
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
    updateTimer = setInterval(checkForUpdate, 1000);
    updateSidePanel(mock_server_output["options"], mock_server_output["events"], mock_server_output["players"][0]);
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
    request.send(JSON.stringify(userInfo));
}

function updateSidePanel(options, events, player)
{
    updateEvent(events);
    updateOptions(options);
    updatePlayerStats(player);
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
        optionList.removeChild(optionDiv.firstChild);
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

function checkForUpdate()
{
    var request = new XMLHttpRequest();
    request.open('GET', '/gameupdate', true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            if(data.status)
            {
                clearInterval(updateTimer);
                getUpdate();
            }
        } else {
        // We reached our target server, but it returned an error

        }
    };

    request.onerror = function() {
    // There was a connection error of some sort
    };

    request.send();
}

function getUpdate()
{
    var request = new XMLHttpRequest();
    request.open('GET', '/gamenext', true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            gameUpdate(data);
        } else {
        // We reached our target server, but it returned an error

        }
    };

    request.onerror = function() {
    // There was a connection error of some sort
    };

    request.send();
}

function gameUpdate(serverOutput)
{
    updateSidePanel(serverOutput['options'], serverOutput['events'], serverOutput['players']);
    renderScene(mainMap, graphicsLayer, serverOutput);
}
