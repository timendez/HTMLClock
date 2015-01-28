function getTime() {
   var d = new Date();
   var hour = d.getHours();
   var time  = ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);

   if(hour > 12) {
      hour -= 12;
      time = hour + time + "pm";
   }
   else if (hour === 12) {
      time = hour + time + "pm";
   }
   else {
      time = hour + time + "am";
   }

   document.getElementById("clock").innerHTML = time;
   setTimeout(getTime, 1000);
}

function getTemp() {
   var latitude = "35.300399";
   var longitude = "-120.662362";
   
   //If user declines geolocation, lat/long automatically set to Building 14 of Cal Poly
   if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(coord) {
         latitude = coord.coords.latitude;
         longitude = coord.coords.longitude;
      });
   }
   
   var url = "https://api.forecast.io/forecast/6207bfdb81ffb068a9efdd74abdbaf3f/" + latitude + "," + longitude + "?callback=?";
   var cityURL = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=true";
   
   //Getting JSON for name of city
   $.getJSON(cityURL, function(data) {
      var city = data.results[0].address_components[1].long_name;
      document.getElementById("city").innerHTML = city;
   });
   
   //Getting JSON for forecast information
   $.getJSON(url, function(data) {
      document.getElementById("forecastLabel").innerHTML = data.daily.summary;
      $("#forecastIcon").attr("src", "img/" + data.daily.icon + ".png");
      
      $("body").addClass(function() {
         var tmp = data.daily.data[0].temperatureMax;

         if(tmp < 60)
            return "cold";
         else if(tmp < 70)
            return "chilly";
         else if(tmp < 80)
            return "nice";
         else if(tmp < 90)
            return "warm";
         else
            return "hot";
      });
   });
}