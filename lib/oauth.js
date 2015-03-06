var client_id;
var auth_type;
var callback_function;

function init(data) {
  client_id = data.client_id;
  auth_type = data.auth_type;
  callback_function = data.callback_function;
}

function login() {
  console.log("It works");

  window.open(
    "https://api.imgur.com/oauth2/authorize?client_id=" + client_id + "&response_type=" + auth_type + "&state=");
}
