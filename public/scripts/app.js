require([
    "esri/Map",
    "esri/views/MapView",
    "dojo/domReady!"
], function(Map, MapView) {
    var map = new Map({
        basemap: "streets"
    });

    var view = new MapView({
        container: "viewDiv",  // Reference to the DOM node that will contain the view
        map: map,               // References the map object created in step 3
        zoom: 4,
        center: [15, 65]
    });
});


//Modal stuff
//get the modal
var newUserModal = document.getElementById('newUserModal');
//New user submit
document.getElementById("newUserForm").onsubmit = function(){
    newUserModal.style.display = "none";
    alert('userName = ' + document.getElementById("newUserForm").elements["Username"].value); 
    return false;
};
document.getElementById("newUserForm").onload = function(){

};


