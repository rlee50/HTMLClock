function success(data) {
    console.log(data);
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
}

function getTemp() {
    $.getJSON("https://api.forecast.io/forecast/c0a1d30b8286511ce5c34f8d3aa02ec0/35.300399,-120.662362?callback=?", success);
}

function getTime() {
    var d = new Date();
    document.getElementById("clock").innerHTML = d.toLocaleTimeString();
    setTimeout(getTime, 1000);
}

getTime();
getTemp();

function showAlarmPopup() {
    $("#mask").removeClass("hide");
    $("#popup").removeClass("hide");
}

function hideAlarmPopup() {
    $("#mask").addClass("hide");
    $("#popup").addClass("hide");
}

function insertAlarm(hours, mins, ampm, alarmName) {
    var newdiv = $("<div></div>");
    newdiv.addClass("flexable");
    newdiv.append("<div class='name'>" + alarmName + "</div>");
    newdiv.append("<div class='time'>" + hours + ":" + mins + " " + ampm + "</div>");
    $("#alarms").append(newdiv);
}

function addAlarm() {
    var hours = $("#hours option:selected").text();
    var mins = $("#mins option:selected").text();
    var ampm = $("#ampm option:selected").text();
    var alarmName = $("#alarmName option:selected").text();

    insertAlarm(hours, mins, ampm, alarmName);
    hideAlarmPopup();
}
