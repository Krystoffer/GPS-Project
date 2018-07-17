'use strict';
// Shared code needed by all pages of the app.

// function to calculate distance between 2 coordinates
function calcDistance(lat1, lon1, lat2, lon2)
    {
        var R = 6371000; // metres                                                                                                                      //
        var phi1 = lat1 * Math.PI / 180;                //lat1.toRadians();                                                                             //
        var phi2 = lat2 * Math.PI / 180;                //.toRadians();                                                                                 //  Formula taken from 
        var deltaPhi = (lat2-lat1) * Math.PI / 180;     //.toRadians();                                                                                 //
        var deltaLamda = (lon2-lon1) * Math.PI / 180;   //.toRadians();                                                                                 //  https://www.movable-
                                                                                                                                                        //  type.co.uk/scripts/latlong.html
        var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLamda/2) * Math.sin(deltaLamda/2);        //
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));                                                                                           //
                                                                                                                                                        //
        var d = R * c;                                                                                                                                  //
        return d                                                                                                                                        //
    }

// Making the path class
function Path(initTitle, initCoordinates)
    {
        // Private attributes and initialization of the values
        var title = initTitle;
        var coordinates = initCoordinates;
            
        // Private methods
        var setTitle = function(newTitle)
        {
            title = newTitle;
        }

        var setCoordinates = function(newCoordinates)
        {
            coordinates = newCoordinates;
        }
        
        // Public methods
        this.getTitle = function()
        {
            return title
        }

        this.getCoordinates = function()
        {
            return coordinates
        }
        
        this.getDistance = function(index)
        {
            var totalDistance = 0;
            for(var i = index; i < coordinates.length - 1; i++)     // Has index as the parameter so that it can calculate the distance starting from any waypoint
                {
                    totalDistance += calcDistance(coordinates[i].lat, coordinates[i].lng, coordinates[i+1].lat, coordinates[i+1].lng);
                }
            return totalDistance
        }
        
        this.getTurns = function(index)
        {
            var totalTurns = 0;
            for (var i = index; i < coordinates.length; i++)
                {
                    totalTurns++
                }
            return totalTurns
        }
    };

// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "monash.eng1003.navigationApp";

// Array of saved Path objects.
var availablePaths = [];
var pathData = [];

// Parse both path data into variables
var claytonPathData = JSON.parse(localStorage.getItem('claytonCampus'));    // Each of these path data is an object with 3 properties
var sunwayPathData = JSON.parse(localStorage.getItem('sunwayCampus'));      // locations (an array consisting objects with properties lat and lng), prerecordedRoutesIndex (starts from 1), title

// Combine all the path data into 1 array
for(var index = 0; index < claytonPathData.length; index++)
    {
        pathData.push(claytonPathData[index]);
    };

for(var index = 0; index < sunwayPathData.length; index++)
    {
        pathData.push(sunwayPathData[index]);
    };