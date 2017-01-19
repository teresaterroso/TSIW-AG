//
// GET current weather from DarkSky API (https://darksky.net/dev/)
//

$(document).ready(function() {

    let esmadLat = "41.366174";
    let esmadLon = "-8.7396931";

    $.ajax({
        dataType: "jsonp",
        url: `https://api.darksky.net/forecast/${darkSkyApiKey}/${esmadLat},${esmadLon}`,
        data: {
            lang: "pt", 
            exclude: "minutely,hourly,daily,alerts,flags", // only currently
            units: "si" // celsius
        }
    }).done(function(res) {

        let currentWeather = res.currently;
        let summary = currentWeather.summary;
        let temperature = currentWeather.temperature;
        let humidity = currentWeather.humidity * 100;

        $("#current-weather").text(`${temperature}ºC - ${summary} | ${humidity}% humidade`);
        
    });

});