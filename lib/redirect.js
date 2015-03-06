function redirect_init() {
   var access_token;
   var wholeEnchilada = document.URL;

   access_token = wholeEnchilada.substring(wholeEnchilada.indexOf("access_token=") + 13, wholeEnchilada.indexOf("&expires_in"));
   localStorage.access_token = access_token;

   window.opener.callback();
   window.close();
}