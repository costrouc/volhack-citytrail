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
// Get the close button
var closeNewUser = document.getElementById('newUserOK');
closeNewUser.onclick = function() {
	newUserModal.style.display = "none";
}
