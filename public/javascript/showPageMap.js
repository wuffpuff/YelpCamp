
mapboxgl.accessToken = mapToken;  //get the access-token from "show.ejs"  file
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // map style, there are many style.  mapbox.com
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 12, // starting zoom on map
    projection: 'globe' // display the map as a 3D globe
});
    map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});


//add a pin marker to the map, showing the location
new mapboxgl.Marker() //you can style the pin marker
    .setLngLat(campground.geometry.coordinates) //set the Latitude and Longtitude of a campground
    .setPopup( //set on that Pop-up marker
        new mapboxgl.Popup({ offset:30}) //properties of pop-up
            .setHTML (
                `<h3>${campground.title}</h3> <p>${campground.location}</p>`
            )
    )
    .addTo(map) //finally add the data above to the map