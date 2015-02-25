//userID of logged in Facebook user. In database for retrieving/setting alarms
var sorryGlobal;

function getTime() {
   var d = new Date();
   var hour = d.getHours();
   var time  = ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);

   if(hour === 24) {
      hour -= 12;
      time = hour + time + "am";
   }
   else if (hour === 12) {
      time = hour + time + "pm";
   }
   else if(hour > 12) {
      hour -= 12;
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
         setElements(latitude, longitude);
      }, function errorFunc() {
         setElements(latitude, longitude);
      });
   }
   else {
      setElements(latitude, longitude);
   }
}

function setElements(latitude, longitude) {
   var url = "https://api.forecast.io/forecast/6207bfdb81ffb068a9efdd74abdbaf3f/" + latitude + "," + longitude + "?callback=?";
   var cityURL = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=true";
   
   //Getting JSON for name of city
   $.getJSON(cityURL, function(data) {
      var city = data.results[0].address_components[2].long_name;
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

function showAlarmPopup() {
   $("#mask").removeClass("hide");
   $("#popup").removeClass("hide");
}

function hideAlarmPopup() {
   $("#mask").addClass("hide");
   $("#popup").addClass("hide");
}

function insertAlarm(hours, mins, ampm, alarmName, alarmObject) {
   var div = document.createElement("div");
   var div2 = document.createElement("div");
   var deleteDiv = document.createElement("button");
   var div3 = document.createElement("div");
   
   $(deleteDiv).html("Delete");
   $(deleteDiv).data("alarmObject", alarmObject);
   $(deleteDiv).data("divv", div);
   $(deleteDiv).attr("onClick", "deleteAlarm($(this).data(\"alarmObject\"), $(this).data(\"divv\"))");
   
   $(div).addClass("flexable");
   $(div2).addClass("name");
   $(div3).addClass("time");
   
   $(div2).html(alarmName);
   $(div3).html(hours + ":" + mins + ampm);
   
   $(div3).append(deleteDiv);
   $(div2).append(div3);
   $(div).append(div2);

   $("#alarms").append(div);
   
   //Alarm alert
   alarmAlert(hours, mins, ampm, alarmName, alarmObject);
}

function deleteAlarm(alarmObject, div) {
   //Google Analytics
   ga('send', 'event', 'Alarm', 'Delete');
   
   alarmObject.destroy({
      success: function(alarmObject) {
      
         //if no alarms present
         if(!$(div).next().length && !$(div).prev().hasClass("flexable")) {
            toggleNoAlarmsSet();
         }
         $(div).remove();
      },
      error: function(alarmObject, error) {
         alert("Error in deleting alarm");
      }
   });
   
}

function addAlarm() {
   //Google Analytics
   ga('send', 'event', 'Alarm', 'Add');

   var hours = $("#hours option:selected").text();
   var mins = $("#mins option:selected").text();
   var ampm = $("#ampm option:selected").text();
   var alarmName = $("#alarmName").val();
   
   var AlarmObject = Parse.Object.extend("Alarm"); 
   var alarmObject = new AlarmObject();

   if(sorryGlobal === undefined) {
      hideAlarmPopup();
      alert("You must login with Facebook in order to save an alarm!");
   }
   else {
      alarmObject.save({"hours": hours, "mins": mins, "ampm": ampm, "alarmName": alarmName, "userId": sorryGlobal}, {
         success: function(object) {
            hideNoAlarmsSet();
            insertAlarm(hours, mins, ampm, alarmName, alarmObject);
            hideAlarmPopup();
         }
      });
   }
}

function alarmAlert(hours, mins, ampm, alarmName, alarmObject) {
   var future = 0; //MS until alarm should go off
   var now = new Date();
   var curHours = now.getHours(), curMins = now.getMinutes(), curSecs = now.getSeconds();
   var hoursNum = parseInt(hours), minsNum = parseInt(mins);
   var hoursToMS = 3600000; //how many ms are in an hour
   var minsToMS = 60000; //how many ms are in a minute
   var secsToMS = 1000; //how many ms are in a minute
   
   //converting to military time
   if(ampm === "pm" && hours !== "12")
      hoursNum += 12;
   else if(ampm === "am" && hours === "12")
      hoursNum = 0;
   
   if(24 - curHours + hoursNum >= 25) //current day
      future += (hoursNum - curHours - 1) * hoursToMS;
   else {
      if(24 - curHours + hoursNum === 24) {
         if(curMins > minsNum) //next day
            future += 24 * hoursToMS; //one day later
      }
      else //next day
         future += (24 - curHours + hoursNum - 1) * hoursToMS;
   }
   
   if(60 - curMins + minsNum >= 61) //current hour
      future += (minsNum - curMins - 1) * minsToMS;
   else
      future += (60 - curMins + minsNum - 1) * minsToMS;      
   
   if(60 - curSecs >= 61)
      future += (0 - curSecs) * secsToMS;
   else
      future += (60 - curSecs) * secsToMS;
  
   var timeout = setTimeout(function() {
      alarmObject.fetch({
         //Alarm hasn't been deleted
         success: function(alarmObject) {
            alert(alarmName + "!");
            alarmAlert(hours, mins, ampm, alarmName, alarmObject);
         }
      });
   }, future);
}

function setOptions() {
   for(var mins = 0; mins < 60; mins++)
      $("<option>").text(zeroPadding(mins)).appendTo("select#mins");
      
   for(var hours = 1; hours < 13; hours++)
      $("<option>").text(zeroPadding(hours)).appendTo("select#hours");
}

function zeroPadding(numba) {
   var str = numba + "";
   
   if(str.length >= 2) {
      return str;
   }
   
   //number is 0-9
   return "0" + str;
}

function getAllAlarms(userId) {
   Parse.initialize("mIfg90i20nfcorygEDNRCSmqMmiO6lWG6wjGKUQD", "QMQ1Fzjy2j7Ep28CCCVDDq15Agi4xmQ7Y70OqGET");

   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   
   query.equalTo("userId", userId);
   sorryGlobal = userId;
   
   query.find({
     success: function(results) {

        for (var i = 0; i < results.length; i++) { 
           insertAlarm(results[i].attributes.hours, results[i].attributes.mins, results[i].attributes.ampm, results[i].attributes.alarmName, results[i]);
        }
        
        //if there are loaded alarms
        if(i !== 0) {
           toggleNoAlarmsSet();
        }
     }
   });
}

function toggleNoAlarmsSet() {
   $("#noAlarmsSet").toggle();
}

function hideNoAlarmsSet() {
   $("#noAlarmsSet").hide();
}