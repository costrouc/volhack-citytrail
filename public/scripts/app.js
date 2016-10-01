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
    return false; //Prevent page reload
};

//Handle getting player icons
document.getElementsByTagName("BODY")[0].onload = function(){
    addIcons(document.getElementById("newUserIcons"));
};

function addIcons(parentDiv){
    //Replace this with actual icon loading
    var icons = ["http://www.freeiconspng.com/uploads/person-icon-person-icon-clipart-image-from-our-icon-clipart-category--9.png"];
    for(var i = 0; i < icons.length; i++)
    {
        var curNode = document.createElement("label");
        var curRadio = document.createElement("input");
        curRadio.setAttribute("type", "radio");
        curRadio.setAttribute("name", icons[i].substring(0, icons[i].length - 4));
        curRadio.setAttribute("value", "small");
        var curImage = document.createElement("img");
        curImage.setAttribute("src", icons[i]);
        curNode.appendChild(curRadio);
        curNode.appendChild(curImage);
        parentDiv.appendChild(curNode);
    }
};

