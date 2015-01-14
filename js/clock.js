function getTime() {
   var d = new Date();
   var hour = d.getHours();
   var time  = ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);

   if(hour > 12) {
      hour -= 12;
      time = hour + time + "pm";
   }
   else {
      time = hour + time + "pm";
   }

   document.getElementById("clock").innerHTML = time;
   setTimeout(getTime, 1000);
}
