'use strict';
// Code for the Navigate page.
 
// The following is sample code to demonstrate navigation between pages of the
// app.  You need can replace this in your final app.
 
// Map Initialisation callback.  Will be called when Maps API loads.
var pathIndex = localStorage.getItem(APP_PREFIX + "-selectedPath");
if (pathIndex !== null)
{
    // If a path index was specified, show name in header bar title. This
    // is just to demonstrate navigation.  You should set the page header bar
    // title to an appropriate description of the path being navigated
    var pathNames = [pathData[0].title, pathData[1].title, pathData[2].title, pathData[3].title, pathData[4].title];
    document.getElementById("headerBarTitle").textContent = pathNames[pathIndex];
    
    var route = new Path(pathData[pathIndex].title, pathData[pathIndex].locations);
    
    var routeCoordinates = route.getCoordinates();    
}

// Global vairables
var map = null;
var marker = null;
var circle = null;
var walkPath = null;
var history1 = null;
var history2 = null;
var heading = null;
var toggleFollow = true;

// Pattern for the dashed line
var dashedLine = {
  path: 'M 0,-1 0,1',
  strokeOpacity: 1,
  scale: 4
};

function toggleCameraFollow()
    {
        if(toggleFollow)
            {
                toggleFollow = false;
            }
        else
            {
                toggleFollow = true;
            }
    }

function panToMarker()
    { 
        map.setCenter(marker.getPosition());
    }

function nextAction(alpha, heading)
    {
        // Is a function that will compute the next action considering the angle 
        // between the current destination and the direction the user is currently facing
        
        //////////////////// Parameters/////////////////////////////////
        // Alpha is the direction in which the user is currently facing, it is obtained from the device orientation
        // Heading is the angle in which the destination is relative to the user's current position
        
        // Both Alpha and Heading have the same value range which is [-180, 180)
        
        // 15 degree tolerance for go forward command
        if(Math.abs(heading - alpha) >= 0 && Math.abs(heading - alpha) <= 15)
            {
                document.getElementById("infoNextAction").innerHTML = "Go forward";
                document.getElementById('nextAction').src = "images/straight.svg";
                document.getElementById('audioTrack').src = "audio/go_forward.mp3";
                document.getElementById('audioTrack').play();
            }
        // Both of them have to be on opposite ends with a tolerance of 35 degrees to execute the u-turn command
        else if((alpha - heading >= 145 && alpha - heading <= 215) || (heading - alpha >= 145 && heading - alpha <= 215))
            {
                document.getElementById("infoNextAction").innerHTML = "Make a U-turn";
                document.getElementById('nextAction').src = "images/uturn.svg";
                document.getElementById('audioTrack').src = "audio/make_a_uturn.mp3";
                document.getElementById('audioTrack').play();
            }
        if(alpha < heading)
            {
                // Go right
                // 15 - 45 degrees for slight
                if(heading - alpha >= 15 && heading - alpha <= 45)
                    {
                        document.getElementById("infoNextAction").innerHTML = "Slight right";
                        document.getElementById('nextAction').src = "images/slight_right.svg";
                        document.getElementById('audioTrack').src = "audio/slight_right.mp3";
                        document.getElementById('audioTrack').play();
                    }
                // 45 to 145 degrees for turn
                else if(heading - alpha > 45 && heading - alpha <= 145)
                    {
                        document.getElementById("infoNextAction").innerHTML = "Turn right";
                        document.getElementById('nextAction').src = "images/right.svg";
                        document.getElementById('audioTrack').src = "audio/turn_right.mp3";
                        document.getElementById('audioTrack').play();
                    }
                // If alpha has gone past the u-turn area
                else if(heading - alpha > 215)
                    {
                        document.getElementById("infoNextAction").innerHTML = "Turn left";
                        document.getElementById('nextAction').src = "images/left.svg";
                        document.getElementById('audioTrack').src = "audio/turn_left.mp3";
                        document.getElementById('audioTrack').play();
                    }
            }
        else if(alpha > heading)
            {
                // Go left
                // 15 - 45 degrees for slight
                if(alpha - heading >= 15 && alpha - heading <= 45)
                    {
                        document.getElementById("infoNextAction").innerHTML = "Slight left.svg";
                        document.getElementById('nextAction').src = "images/slight_left.svg";
                        document.getElementById('audioTrack').src = "audio/slight_left.mp3";
                        document.getElementById('audioTrack').play();
                    }
                // 45 to 145 degrees for turn
                else if(alpha - heading > 45 && alpha - heading <= 145)
                    {
                        document.getElementById("infoNextAction").innerHTML = "Turn left";
                        document.getElementById('nextAction').src = "images/left.svg";
                        document.getElementById('audioTrack').src = "audio/turn_left.mp3";
                        document.getElementById('audioTrack').play();
                    }
                // If alpha has gone past the u-turn area
                else if(alpha - heading > 215)
                    {
                        document.getElementById("infoNextAction").innerHTML = "Turn right";
                        document.getElementById('nextAction').src = "images/right.svg";
                        document.getElementById('audioTrack').src = "audio/turn_right.mp3";
                        document.getElementById('audioTrack').play();
                    }                
            }
    }
 
function initMap() 
    {        
        // Initialise map, centred on the first waypoint on the current path
        map = new google.maps.Map(document.getElementById('map'), {
            center: routeCoordinates[0],
            zoom: 17
        });
        
        // Set a marker on the map with the same position as the first waypoint
        marker = new google.maps.Marker({
            map: map,
            icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 4,
                rotation: 0,
            },
            position: routeCoordinates[0],
            //animation: google.maps.Animation.DROP,
            title: "This is your location"
        });
        
        circle = new google.maps.Circle({
            map: map,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            center: routeCoordinates[0],
            radius: 1
        });
 
        /*var infowindow = new google.maps.InfoWindow({
            position: routeCoordinates[0],
            content: "Start here!!",
            disableAutoPan: true,
            });
        infowindow.open(map);*/
        
        var infowindow = new google.maps.InfoWindow({
            position: routeCoordinates[routeCoordinates.length - 1],
            content: "Destination",
            disableAutoPan: true,
            });
        infowindow.open(map);
                
        walkPath = new google.maps.Polyline({
            path: [routeCoordinates[0], routeCoordinates[0]],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0,
            strokeWeight: 2,
            icons: [{
                icon: dashedLine,
                offset: '0',
                repeat: '20px'
            }],
        });
        walkPath.setMap(map);
                
    }
 
// Initiate the first waypoint as the current waypoint
var currentWaypoint = 0;
function trackPosition(position)
    {
        // Get the coordinate of the user's current location
        var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        
        // If the camera is toggled to follow the user, the map will be re-centered everytime the user move
        if(toggleFollow)
            {
                map.setCenter(location);
            }
        
        // Move the marker and circle indicating the user's current position
        marker.setPosition(location);
        circle.setCenter(location);
        
        // The radius of the circle will indicate the GPS's accuracy
        circle.setRadius(position.coords.accuracy);
        // If the accuracy is less than 20m, make it green indicating that it is quite accurate
        if(position.coords.accuracy <= 20)
            {
                circle.setOptions({
                    strokeColor: '#00FF00',                    
                    fillColor: '#00FF00',
                })
            }
        // Else, make it red indicating that the GPS right now is fairly inaccurate
        else
            {
                circle.setOptions({
                    strokeColor: '#FF0000',                    
                    fillColor: '#FF0000',
                })
            };
        
        // Calculate the distancce between the user's current location and the current waypoint
        if (calcDistance(position.coords.latitude, position.coords.longitude, routeCoordinates[currentWaypoint].lat, routeCoordinates[currentWaypoint].lng) <= position.coords.accuracy)
            {
                // If the current waypoint is not the final one, change the waypoint to the next one
                if(currentWaypoint < routeCoordinates.length - 1)
                    {
                        currentWaypoint++;
                    }
                // If the current waypoint is the final one, alert the user that they have reached their destination
                else if(currentWaypoint === routeCoordinates.length - 1)
                    {
                        alert('You have reached your destination!');
                        document.getElementById('audioTrack').src = "audio/reached_destination.mp3";
                        document.getElementById('audioTrack').play();
                        
                    }
            };
        
        // Generate a path between the user's current location and the current waypoint and draw it on the map
        var currentPath = [location, routeCoordinates[currentWaypoint]];
        walkPath.setPath(currentPath);        
        
        // Generate a path between the user's last location and the current location and draw it on the map
        history1 = history2;
        history2 = location;
        var history = [history1, history2];
        
        var historyPath = new google.maps.Polyline({
            path: history,
            geodesic: true,
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
        });
        historyPath.setMap(map);
        
        // Calculate the ratio of the remaining distance and the total distance
        var currentDistance = calcDistance(position.coords.latitude, position.coords.longitude, routeCoordinates[currentWaypoint].lat, routeCoordinates[currentWaypoint].lng) + route.getDistance(currentWaypoint);
        var totalDistance = calcDistance(position.coords.latitude, position.coords.longitude, routeCoordinates[0].lat, routeCoordinates[0].lng) + route.getDistance(0);
        var walkProgress = currentDistance/totalDistance;
        if(walkProgress <= 0.3)
            {
                walkProgress = 0.3
            }
        // Set the ratio as the line's opacity
        dashedLine.strokeOpacity = walkProgress;
        
        // Display the calculated current to the page
        document.getElementById('infoDistance').innerHTML = "Distance to destination: " + currentDistance.toFixed(2) + " m";
        
        // Calculate the distance between the user's current position and the current waypoint and display it to the page
        var distanceToWaypoint = calcDistance(position.coords.latitude, position.coords.longitude, routeCoordinates[currentWaypoint].lat, routeCoordinates[currentWaypoint].lng)
        document.getElementById('infoDistanceWaypoint').innerHTML = "To next waypoint: " + distanceToWaypoint.toFixed(2) + " m";
        
        // Make the current waypoint's coordinate into a google LatLng object and calculate the heading from the user's curent position
        var waypoint = new google.maps.LatLng(routeCoordinates[currentWaypoint].lat, routeCoordinates[currentWaypoint].lng);
        heading = google.maps.geometry.spherical.computeHeading(location, waypoint);
    }

function handleOrientation(event)
    {
        // Get the direction the user's phone is facing
        var alpha = event.alpha;
        
        // Rotate the marker indicating the user's according to the direction the phone is facing
        marker.setIcon({
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4,
            rotation: alpha,     
        });
        
        // Call the function to determine the next action the user has to take
        nextAction(alpha, heading);        
    }
 
function errorAlert()
    {
        alert("Your device does not support GPS tracking!");
    }

if(navigator.geolocation)
    {
        navigator.geolocation.watchPosition(trackPosition, errorAlert);
    }
else
    {
        alert("Your device does not support GPS tracking!");
    }

window.addEventListener("deviceorientation", handleOrientation);