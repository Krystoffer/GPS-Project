'use strict';
// Code for the Main page of the app.

// The following is sample code to demonstrate navigation.
// You need not use it for final app.

var APP_PREFIX = "monash.eng1003.navigationApp";
function viewPath(pathIndex)
    {
        // Save the selected path index to local storage so it can be accessed
        // from the Navigate page.
        localStorage.setItem(APP_PREFIX + "-selectedPath", pathIndex);
        // ... and then load the Navigate page.
        location.href = 'navigate.html';
    }

function getClaytonData(json)
    {
        localStorage.setItem('claytonCampus', JSON.stringify(json));
    }

function getSunwayData(json)
    {
        localStorage.setItem('sunwayCampus', JSON.stringify(json));
    }


// Get the data from monash server
var dataSource1 = document.createElement('script');
dataSource1.src = 'https://eng1003.monash/api/campusnav/?campus=clayton&callback=getClaytonData';
document.body.appendChild(dataSource1);

var dataSource2 = document.createElement('script');
dataSource2.src = 'https://eng1003.monash/api/campusnav/?campus=sunway&callback=getSunwayData';
document.body.appendChild(dataSource2);

// Calculate the distance and turns for each path displayed
for(var i = 0; i < pathData.length; i++)
    {
        // The use of 'window[]' instead of 'var' allows a string to be used as a variable name so the variable name can dynamically change
        window['route' + i] = new Path(pathData[i].title, pathData[i].locations);
        document.getElementById('info' + i).innerHTML = 'Distance = ' + window['route' + i].getDistance(0).toFixed(2) + ' m, Turns: ' + window['route' + i].getTurns(0);
    };