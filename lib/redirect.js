function redirect_init() {
   var username, access_token;
   var wholeEnchilada = document.URL;

   //username = wholeEnchilada.substring(wholeEnchilada.indexOf("account_username=") + 17, wholeEnchilada.length);

   access_token = wholeEnchilada.substring(wholeEnchilada.indexOf("access_token=") + 13, wholeEnchilada.indexOf("&expires_in"));

   localStorage["acces_token"] = access_token);
   alert("thissin = " + localStorage["access_token"]);
   //$("#username").text("Hi " + username);

   callback();
   window.close();
}

//http://ec2-54-191-2-205.us-west-2.compute.amazonaws.com/lib/redirect.html?state=waffles#access_token=92e7a6dedca4e4c3aca6c32cefd2a03c03b53841&expires_in=3600&token_type=bearer&refresh_token=960843a6a4f87f0ce122dbd5a78c1d8b53598aa1&account_username=oimgur