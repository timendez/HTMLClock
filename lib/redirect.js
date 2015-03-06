function redirect_init() {
   var username, access_token, state, token_type, refresh_token;
   var wholeEnchilada = document.URL;
   
   username = wholeEnchilada.substring(wholeEnchilada.indexOf("account_username=") + 17, wholeEnchilada.length);
   $("#username").html(username);
   popup.close();
   alert('fin');
}

http://ec2-54-191-2-205.us-west-2.compute.amazonaws.com/lib/redirect.html?state=waffles#access_token=92e7a6dedca4e4c3aca6c32cefd2a03c03b53841&expires_in=3600&token_type=bearer&refresh_token=960843a6a4f87f0ce122dbd5a78c1d8b53598aa1&account_username=oimgur