var airports = {};
var map;
$(document).ready(function () {

    $(".info").hide();

    $("#search").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "https://sandbox.paxlife.aero/api/search/" + request.term,
                success: function (data) {
                    var cities = [];
                    for (var i = 0; i < data.length && i < 15; i++) {
                        if (data[i] && data[i].id != "") {
                            cities.push(data[i].name);
                            airports[data[i].name] = data[i].id;
                        }
                    } response(cities);
                }
            });
        },
        minLength: 1,
        select: function (event, ui) {
            $("#search").val = ui.item.value;
            getAirport(ui.item.value);
        }
    });

});

function getAirport(val) {
    if (airports[val]) {
        $.ajax({
            url: "https://sandbox.paxlife.aero/api/" + airports[val]
        }).done(function (data) {
            updateView(data)
        }).fail(function (err) {
            console.log('error', err);
        });
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 52.39886, lng: 13.06566 },
        zoom: 8
    });
}

function updateView(data) {
    $(".info").show();
    $(".headline").text(data.name);
    $(".city").text(data.city);
    $(".country").text(data.country);
    $(".iata").text(data.iata);
    $(".icao").text(data.icao);

    var myLatLng = { lat: data.latitude, lng: data.longitude };
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 8
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
    });
}

