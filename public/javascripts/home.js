
      // This example displays an address form, using the autocomplete feature
      // of the Google Places API to help users fill in the information.

      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

      var placeSearch, autocomplete;

      function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')),{types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress);
      }

      function fillInAddress() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();

        angular.element(document.getElementById('autocomplete')).scope().getPraia(place);
      }
      
      $("#modalMaps").on("shown.bs.modal", function () {
        google.maps.event.trigger(map, 'resize');
        // var var_location = new google.maps.LatLng(document.getElementById('txtLat').value,document.getElementById('txtLng').value);
        // map.setCenter(var_location);
      });


