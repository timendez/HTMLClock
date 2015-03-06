var client_id;
var type;
var callback_function;
var popup;


function init() {
   client_id = "c0f568e98c36ec5";
   type = "token";
   callback_function = "redirect_init";
}

//https://api.imgur.com/oauth2/authorize?client_id=c0f568e98c36ec5&response_type=token&state=waffles
function login() {
   popup = window.open("https://api.imgur.com/oauth2/authorize?client_id=c0f568e98c36ec5&response_type=token&state=waffles");
}