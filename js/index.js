function getTemp() {
    $.getJSON("https://api.forecast.io/forecast/c0a1d30b8286511ce5c34f8d3aa02ec0/35.300399,-120.662362?callback=?", function(data) {
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
    newdiv.append("<div class='name'>" + alarmName + "</div>");
    newdiv.append("<div class='time'>" + time + "</div>");
    newdiv.append("<input type='button' value='Delete Alarm' class='button' id='" + objID + "' onclick='deleteAlarm(this)'/>");
    $("#alarms").append(newdiv);
}

function addAlarm() {
    var hours = $("#hours option:selected").text();
    var mins = $("#mins option:selected").text();
    var ampm = $("#ampm option:selected").text();
    var alarmName = $("#alarmName option:selected").text();
    var time = hours + ":" + mins + " " + ampm;

    var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();
      alarmObject.save({"time": time,"alarmName": alarmName, "objID": alarmObject.id}, {
      success: function(object) {
          insertAlarm(time, alarmName, alarmObject.id);
          hideAlarmPopup();
      }
    });
}

function getAllAlarms() {
    Parse.initialize("G2MG1grUdJw2wafABmzAyI4XMKMuyr1jD9we5RI8", "pO9iDawMGCTTz4IRUuOvW3zwYoPjqzgVCl1YievQ");

    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.find({
        success: function(results) {
            for (var i = 0; i < results.length; i++) {
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

getTime();
getTemp();
getAllAlarms();
