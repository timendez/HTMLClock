var client_id;
var type;
var callback_function;
var popup;


function init() {
   client_id = "c0f568e98c36ec5";
   type = "token";
   callback_function = callback;
}

//https://api.imgur.com/oauth2/authorize?client_id=c0f568e98c36ec5&response_type=token&state=waffles
function login() {
   popup = window.open("https://api.imgur.com/oauth2/authorize?client_id=c0f568e98c36ec5&response_type=token&state=waffles", "myWindow", "width=500, height=300");
}

function callback() {
alert("callback initiated!!");
   $.ajax({
      url: "https://api.imgur.com/3/account/me",
      method: "GET",
      headers: {
         Authorization: "Bearer " + localStorage.getItem("access_token"),
         Accept: "application/json"
      },
      success: function(result) {
      alert("SUCCESS");
         alert("Welcome " + result.data.url);
      }
   });
}