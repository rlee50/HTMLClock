function getTemp() {
  var latitude = document.getElementById("lat").innerHTML;
  var longitude = document.getElementById("lng").innerHTML;
    $.getJSON("https://api.forecast.io/forecast/c0a1d30b8286511ce5c34f8d3aa02ec0/" + latitude
          + "," + longitude + "?callback=?", function(data) {
        $("#forecastLabel").html(data.daily.summary);
        var icon = data.daily.icon;
        $("#forecastIcon").attr("src", "img/" + data.daily.icon + ".png");
        var counter = 0;
        var temp = data.daily.data[counter++].temperatureMax;
        while(counter < data.daily.data.length) {
            if(data.daily.data[counter].temperatureMax > temp)
                temp = data.daily.data[counter].temperatureMax;
            counter++;
        }
        var backC;
        if(temp < 60)
            backC = "cold";
        if(temp >= 60)
            backC = "chilly";
        if(temp >= 70)
            backC = "nice";
        if(temp >= 80)
            backC = "warm";
        if(temp >= 90)
            backC = "hot";
        $("body").addClass(backC);
    });
}

function getTime() {
    var d = new Date();
    document.getElementById("clock").innerHTML = d.toLocaleTimeString();
    setTimeout(getTime, 1000);
}

function showAlarmPopup() {
    $("#mask").removeClass("hide");
    $("#popup").removeClass("hide");
}

function hideAlarmPopup() {
    $("#mask").addClass("hide");
    $("#popup").addClass("hide");
}

function insertAlarm(time, alarmName, objID) {
    var newdiv = $("<div></div>");
    newdiv.addClass("flexable");
    newdiv.addClass(objID);
    newdiv.append("<div class='name'>" + alarmName + " - </div>");
    newdiv.append("<div class='time'> " + time + "</div>");
    newdiv.append("<input type='button' value='Delete Alarm' class='button' id='" + objID + "' onclick='deleteAlarm(this)'/>");
    $("#alarms").append(newdiv);
}

function addAlarm() {
    var hours = $("#hours option:selected").text();
    var mins = $("#mins option:selected").text();
    var ampm = $("#ampm option:selected").text();
    var alarmName = $("#alarmName").val();
    var time = hours + ":" + mins + " " + ampm;

    Parse.initialize("G2MG1grUdJw2wafABmzAyI4XMKMuyr1jD9we5RI8", "pO9iDawMGCTTz4IRUuOvW3zwYoPjqzgVCl1YievQ");

    var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();
    alarmObject.set("time", time);
    alarmObject.set("alarmName", alarmName);
    var userid = document.getElementById("userid").innerHTML;
    alarmObject.set("userid", userid);
    alarmObject.save(null, {
        success: function(object) {
            insertAlarm(time, alarmName, alarmObject.id);
            hideAlarmPopup();
        }
    });
}

function getAllAlarms(userid) {
    Parse.initialize("G2MG1grUdJw2wafABmzAyI4XMKMuyr1jD9we5RI8", "pO9iDawMGCTTz4IRUuOvW3zwYoPjqzgVCl1YievQ");

    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.find({
        success: function(results) {
            for (var i = 0; i < results.length; i++) {
                if(results[i].get('userid') == userid)
                    insertAlarm(results[i].get('time'), results[i].get('alarmName'), results[i].id);
            }
        }
    });
}

function deleteAlarm(object) {
    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    var objID = $(object).attr("id");
    query.get(objID, {
        success: function(result) {
            result.destroy({
                success: function(complete) {
                    //window.location.reload();
                    $("." + objID).html(" ");
                }
            });
        }
    });
}

function signinCallback(authResult) {
  if (authResult['status']['signed_in']) {
    // Update the app to reflect a signed in user
    // Hide the sign-in button now that the user is authorized, for example:
    document.getElementById('signinButton').setAttribute('style', 'display: none');
    document.getElementById('addAlarm').className = 'button';
    gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({
          'userId' : 'me'
        });
        request.execute(function(resp) {
          getAllAlarms(resp.id);
          //var newdiv = $("<div></div>");
          //newdiv.addClass("flexable");
          //newdiv.append("<div class='displayName'>" + resp.displayName + "</div>");
          //$("#displayName").append(newdiv);
          document.getElementById("displayName").innerHTML = resp.displayName;
          document.getElementById("userid").innerHTML = resp.id;
        });
    });
  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + authResult['error']);
  }
}

getTime();
getLocation();
getTemp();
