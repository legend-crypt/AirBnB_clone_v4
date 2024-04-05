$(document).ready(function () {
    // Initialize empty object to store Amenity IDs
    const checkedAmenities = {};
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
    $.getJSON('http://0.0.0.0:5001/api/v1/status/', (data) => {
        const res = data.status === "OK" ? true : false
        // console.log(res);
	header.toggleClass('available', res);
    });
});

