$(document).ready(function () {
    // Initialize empty object to store Amenity IDs
    const checkedAmenities = {};
    const checkedStates = {};
    const checkedCities = {};
    const header = $('div#api_status');
    // Functiom to update the h4 tag with checked amenities
    function updateAmenitiesTag() {
        const  amenitiesList = Object.values(checkedAmenities).join(', ');
        $('.amenities h4').text(amenitiesList);
    }

    // Listen for changes on each input checkbox tag
    $('.amenities input[type="checkbox"]').change(function () {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');

        if ($(this).is(':checked')) {
            // If checkbox is checked, store Amenity ID in the variable
            checkedAmenities[amenityId] = amenityName;
        } else {
            // If checkbox is unchecked, remove Amenity ID from the variable
            delete checkedAmenities[amenityId];
        }

        // Update the h4 tag with the list of checked amenities
        updateAmenitiesTag();
    });

    // Function to make POST request to places_search with checked amenities
    function searchPlacesWithAmenities() {
        // Send POST request to get places data
        $.ajax({
            type: "POST",
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            contentType: "application/json",
            data: JSON.stringify({}), // Sending an empty dictionary as per the requirement
            success: function(data) {
                // Loop through the response and create article tags for each place
                data.forEach(function(place) {
                    const article = $('<article>');
                    const titleBox = $('<div>').addClass('title_box');
                    titleBox.append($('<h2>').text(place.name));
                    titleBox.append($('<div>').addClass('price_by_night').text('$' + place.price_by_night));
                    article.append(titleBox);

                    const information = $('<div>').addClass('information');
                    information.append($('<div>').addClass('max_guest').text(place.max_guest + ' Guest' + (place.max_guest != 1 ? 's' : '')));
                    information.append($('<div>').addClass('number_rooms').text(place.number_rooms + ' Bedroom' + (place.number_rooms != 1 ? 's' : '')));
                    information.append($('<div>').addClass('number_bathrooms').text(place.number_bathrooms + ' Bathroom' + (place.number_bathrooms != 1 ? 's' : '')));
                    article.append(information);

                    // Append article to section.places
                    $('section.places').append(article);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching places:', error);
            }
        });
    }

    // Listen for click on the search button
    $('button').click(function() {
        searchPlacesWithAmenities();
    });

    // Function to update the h4 tag with checked states or cities
    function updateLocationsTag() {
        const statesList = Object.values(checkedStates).join(', ');
        const citiesList = Object.values(checkedCities).join(', ');
        const locationsList = (statesList + (statesList && citiesList ? ', ' : '') + citiesList);
        $('.locations h4').text(locationsList);
    }

    // Listen for changes on each input checkbox tag
    $('.locations input[type="checkbox"], .amenities input[type="checkbox"]').change(function () {
        const id = $(this).data('id');
        const name = $(this).data('name');

        if ($(this).hasClass('state-checkbox')) {
            if ($(this).is(':checked')) {
                // If state checkbox is checked, store state ID
                checkedStates[id] = name;
            } else {
                // If state checkbox is unchecked, remove state ID
                delete checkedStates[id];
            }
        } else if ($(this).hasClass('city-checkbox')) {
            if ($(this).is(':checked')) {
                // If city checkbox is checked, store city ID
                checkedCities[id] = name;
            } else {
                // If city checkbox is unchecked, remove city ID
                delete checkedCities[id];
            }
        } else {
            if ($(this).is(':checked')) {
                // If amenity checkbox is checked, store amenity ID
                checkedAmenities[id] = name;
            } else {
                // If amenity checkbox is unchecked, remove amenity ID
                delete checkedAmenities[id];
            }
        }

        // Update the h4 tag with the list of checked states or cities
        updateLocationsTag();
    });

    // Function to make POST request to places_search with checked amenities, states, and cities
    function searchPlacesWithFilters() {
        $.ajax({
            type: "POST",
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            contentType: "application/json",
            data: JSON.stringify({
                amenities: Object.keys(checkedAmenities),
                states: Object.keys(checkedStates),
                cities: Object.keys(checkedCities)
            }),
            success: function(data) {
                $('section.places').empty(); // Clear existing places
                // Loop through the response and create article tags for each place
                data.forEach(function(place) {
                    const article = $('<article>');
                    const titleBox = $('<div>').addClass('title_box');
                    titleBox.append($('<h2>').text(place.name));
                    titleBox.append($('<div>').addClass('price_by_night').text('$' + place.price_by_night));
                    article.append(titleBox);

                    const information = $('<div>').addClass('information');
                    information.append($('<div>').addClass('max_guest').text(place.max_guest + ' Guest' + (place.max_guest != 1 ? 's' : '')));
                    information.append($('<div>').addClass('number_rooms').text(place.number_rooms + ' Bedroom' + (place.number_rooms != 1 ? 's' : '')));
                    information.append($('<div>').addClass('number_bathrooms').text(place.number_bathrooms + ' Bathroom' + (place.number_bathrooms != 1 ? 's' : '')));
                    article.append(information);

                    // Append article to section.places
                    $('section.places').append(article);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching places:', error);
            }
        });
    }

    // Listen for click on the search button
    $('button').click(function() {
        searchPlacesWithFilters();
    });

    $.getJSON('http://0.0.0.0:5001/api/v1/status/', (data) => {
        const res = data.status === "OK" ? true : false
        // console.log(res);
	header.toggleClass('available', res);
    });
});
