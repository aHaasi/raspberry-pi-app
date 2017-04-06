var translation = [
    {en: "clear sky", de: "Blauer Himmel"},
    {en: "few clouds", de: "Wenig bewölkt"},
    {en: "scattered clouds", de: "Bewölkt"},
    {en: "broken clouds", de: "Durchbrochende Wolkendecke"},
    {en: "shower rain", de: "Regenschauer"},
    {en: "rain", de: "Regen"},
    {en: "thunderstorm", de: "Gewitter"},
    {en: "snow", de: "Schnee"},
    {en: "mist", de: "Nebel"},
    {en: "light rain", de: "Leichter Regen"},
    {en: "overcast clouds", de: "Dichte Wolkendecke"}
];
var millisecondsToWait = 150000;
var departureStation, arrivalStation, searchedCity;

function getWeather(apiUrl, apiId, id, cityName){
    $.getJSON(apiUrl + "/weather?id="+id+"&&units=metric&APPID="+apiId, function( data ) {
        var weather = data.weather[0];
        $("."+cityName + " .currentTemp").text(Math.round(data.main.temp) + "°");
        var trans = getTranslation(weather.description);
        $("."+cityName + " .currentWeather").text(trans);

        setImage("."+cityName + " .weatherCurrentImg", weather.icon);
    });
}

function setWeatherInterval(apiUrl, apiId, id, cityName){
    setInterval(function() {
        getWeather(apiUrl, apiId, id, cityName);
    }, millisecondsToWait);
}

function getForecast(apiUrl, apiId, id, cityName){
    $.getJSON(apiUrl + "/forecast/daily?id="+id+"&&units=metric&APPID="+apiId, function( data ) {
        var dataList = data.list;
        //current day
        var currentDay = getWeatherDates(dataList, 0);
        $("."+cityName + " .currentTempMin").text(Math.round(currentDay.temp.min) + "°");
        $("."+cityName + " .currentTempMax").text(" / " + Math.round(currentDay.temp.max) + "°");

        //tomorrow
        var tomorrow = getWeatherDates(dataList, 1);
        $("."+cityName + " .weatherTomorrowTempMin").text(Math.round(tomorrow.temp.min) + "°");
        $("."+cityName + " .weatherTomorrowTempMax").text(" / " + Math.round(tomorrow.temp.max) + "°");
        setImage("."+cityName + " .weatherTomorrowImg", tomorrow.weather[0].icon);

        //in 2 days
        var in2Days = getWeatherDates(dataList, 2);
        $("."+cityName + " .weatherIn2DaysTempMin").text(Math.round(in2Days.temp.min) + "°");
        $("."+cityName + " .weatherIn2DaysTempMax").text(" / " + Math.round(in2Days.temp.max) + "°");
        setImage("."+cityName + " .weatherIn2DaysImg", in2Days.weather[0].icon);
        $("."+cityName + " .weatherIn2DaysDate").text(getDay(in2Days.dt));

        //in 3 days
        var in3Days = getWeatherDates(dataList, 3);
        $("."+cityName + " .weatherIn3DaysTempMin").text(Math.round(in3Days.temp.min) + "°");
        $("."+cityName + " .weatherIn3DaysTempMax").text(" / " + Math.round(in3Days.temp.max) + "°");
        setImage("."+cityName + " .weatherIn3DaysImg", in3Days.weather[0].icon);
        $("."+cityName + " .weatherIn3DaysDate").text(getDay(in3Days.dt));
    });
}

function setForecastIntervall(apiUrl, apiId, id, cityName){
    setInterval(function() {
        getForecast(apiUrl, apiId, id, cityName);
    }, millisecondsToWait);
}

function getIconSrc(currentImageUrl, imageName){
    if(currentImageUrl){
        var imagePath = currentImageUrl.substring(0, currentImageUrl.lastIndexOf('/')+1);
        var icon = imageName;
        if(icon.indexOf('n')>-1){
            icon = icon.replace('n', 'd');
        }
        return imagePath + icon + ".png";
    }
}

function setImage(imageClass, icon){
    var imageSrc = $(imageClass).attr("src");
    if(imageSrc){
        $(imageClass).attr("src", getIconSrc(imageSrc, icon));
    }
}
/**
 * Get day formatted as dd.mm.
 * @param timestamp
 * @returns {string}
 */
function getDay(timestamp){
    var date = new Date(timestamp*1000);
    var day = date.getDate() < 10 ? '0'+  date.getDate() :  date.getDate();
    var correctMonth = date.getMonth() +1;
    var month = correctMonth < 10 ? '0'+  correctMonth :  correctMonth;
    return day + "." + month + ".";
}

/**
 * Return true if 2 dates are the same
 * @param date1
 * @param date2
 * @returns {boolean}
 */
function compareDay(date1, date2){
    var resettedDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), 0, 0, 0);
    var resettedDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), 0, 0, 0);
    return resettedDate1.getTime() === resettedDate2.getTime();
}

/**
 * Get the weather dates of specific date
 * @param dataList
 * @param daysInFuture: days in future: 0 is today, 1 tomorrow,..
 * @returns {*}
 */
function getWeatherDates(dataList, daysInFuture){
    var searchedDate = new Date();
    if(daysInFuture > 0){
        searchedDate.setDate(searchedDate.getDate() + daysInFuture);
    }
    for(var i=0; i<dataList.length; i++){
        var dateOfWeather = new Date(dataList[i].dt*1000);
        if(compareDay(dateOfWeather, searchedDate)){
            return dataList[i];
        }
    }
    return null;
}

/**
 * Get the translation of current weather
 * @param en
 * @returns {*}
 */
function getTranslation(en){
    for(var i=0; i<translation.length; i++){
        if(translation[i].en === en){
            return translation[i].de;
        }
    }
    return en;
}

/**
 * Get the names of people that has today his birthday
 * @param birthdays
 */
function getCurrentBirthday(birthdays){
    var birthdayArray = getBirthdayArray(birthdays);
    var today = new Date();
    var todayISO = today.toISOString();
    var todayDate = todayISO.substring(0, todayISO.indexOf('T'));
    var yearOfToday = today.getUTCFullYear();
    var people = getBirthdayPeople(birthdayArray, todayDate);
    var text = 'Heute ';
    if(people.length > 1){
        $(".birthday-start-text").text('Heute haben ');
        // text += 'haben ';
    }else{
        $(".birthday-start-text").text('Heute hat ');
        // text += 'hat niemand';
    }
    var names = '';
    for(var i=0; i<people.length; i++){
        var age = yearOfToday - parseInt(people[i].year);
        names += people[i].name + ' (' + age + ' Jahre)';
        if(i !== people.length -1){
            names += ', '
        }
    }
    if(people.length === 0){
        $(".birthday-people").text('niemand');
    }else{
        $(".birthday-people").text(names);
    }
    $(".birthday-end-text").text(' Geburtstag');
}

/**
 * Format the yml file and save all birthdays in an array.
 * @param birthdays
 * @returns {Array}
 */
function getBirthdayArray(birthdays){
    var unformattedArray = birthdays.split('",');
    var formattedArray = [];
    for(var i=0; i<unformattedArray.length; i++){
        var currentLine = unformattedArray[i].trim();
        var names = '';
        if(i === unformattedArray.length -1){
            names = currentLine.substring(currentLine.indexOf('=>"') + 3, currentLine.length-2);
        }else{
            names = currentLine.substring(currentLine.indexOf('=>"') + 3, currentLine.length);
        }

        var date = currentLine.split(' ')[1];
        formattedArray[date] = names;
    }

    return formattedArray;
}

/**
 * Iterate over birthday array and return all people that has birthday on specific date.
 * @param birthdayArray
 * @param searchedDate
 * @returns {Array}
 */
function getBirthdayPeople(birthdayArray, searchedDate){
    var names = [];
    var todayDay = searchedDate.substring(5, searchedDate.length);
    for(var key in birthdayArray){
        var date = key.substring(5, key.length);
        if(date === todayDay){
            var year = key.substring(0, 4);
            names.push({name: birthdayArray[key], year: year});
        }
    }
    return names;
}

function getCurrentTrains(departure, arrival, cityName){
    departureStation = departure;
    arrivalStation = arrival;
    searchedCity = cityName;
    $.ajax({
        url: 'http://localhost/currentTrains.php',
        // url: "http://reiseauskunft.bahn.de/bin/bhftafel.exe/dn?ld=9646&rt=1&input=%23008010382&boardType=dep&time=actual&productsFilter=11111&start=yes",
        success: function(data) {
            requestTrainDetails(getTrains(data));

        }
    });

}

function getTrains(data){
    var start = data.indexOf('<table class="result stboard dep"');
    var end = data.indexOf('</table>', data.indexOf('<table class="result stboard dep"'));
    var dataList = [];
    if(start > -1 && end >-1){
        var tableOfResult = data.substring(start, end);
        var htmlObject = $.parseHTML(tableOfResult);
        var children = htmlObject[0].children[0].children;
        for(var i=0; i<children.length; i++){
            var child = children[i];
            if(child.id.indexOf('journeyRow') > -1){
                console.log('searched', searchedCity);
                if(checkSearchedTrainStationIsIn(searchedCity, child.children)){
                    dataList.push({
                        id: getIdOfTrain(child.children),
                        url: getUrlOfTrain(child.children)
                    });
                }
            }
        }
    }
    return dataList;

}

function checkSearchedTrainStationIsIn(trainStation, children){
    for(var i=0; i<children.length; i++){
        var child = children[i];
        if(child.className === "route"){
            if(child.innerText.indexOf(trainStation)>-1){
                return true;
            }
        }
    }
    return false;
}

function getUrlOfTrain(children){
    for(var i=0; i<children.length; i++){
        var child = children[i];
        if(child.className === "train"){
            for(var j=0; j<child.children.length; j++){
                if(child.children[j].localName === 'a'){
                    var linkChild = child.children[j];
                    if(linkChild.href.indexOf('localhost') === -1){
                        return linkChild.href;
                    }
                }
            }
        }
    }
    return null;
}

function getIdOfTrain(children){
    for(var i=0; i<children.length; i++){
        var child = children[i];
        if(child.className === "train"){
            for(var j=0; j<child.children.length; j++){
                if(child.children[j].localName === 'a'){
                    var linkChild = child.children[j];
                    if(linkChild.href.indexOf('localhost') > -1){
                        return linkChild.innerHTML;
                    }
                }
            }
        }
    }
    return null;
}

function requestTrainDetails(trains){
    console.log('trains', trains);
    for(var i=0; i<trains.length; i++){
        var data = trains[i];

        $.ajax({ //Process the form using $.ajax()
            type      : 'POST', //Method type
            url       : 'http://localhost/trainDetails.php', //Your form processing file URL
            data      : data, //Forms name
            dataType  : 'json',
            success   : function(data) {
                var htmlElem = data.html;
                var start = htmlElem.indexOf('<table class="result stboard train"');
                var end = htmlElem.indexOf('</table>', htmlElem.indexOf('<table class="result stboard train"'));
                if(start > -1 && end >-1){
                    var tableOfResult = htmlElem.substring(start, end);
                    var htmlObject = $.parseHTML(tableOfResult);
                    var children = htmlObject[0].children[0].children;
                    if(children){
                        var startStation = getDataOfStation(arrivalStation, children, false);
                        var endStation = getDataOfStation(departureStation, children, true);
                        console.log('stations', startStation, endStation);
                    }
                }
            }
        });
    }
}

function getDataOfStation(stationName, children, isDeparture){
    for(var i=0; i<children.length; i++){
        var childTr = children[i];
        if(childTr.innerText.indexOf(stationName)> -1){
            var data = {};
            for(var j=0; j<childTr.children.length; j++){
                var info = childTr.children[j];
                if(info.className === 'station'){
                    data.station = info.innerText;
                }else if(info.className === 'ris'){
                    data.delay = info.innerText;
                }else if(isDeparture && info.className.indexOf('departure') > -1){
                    data.time = info.innerText;
                }else if(!isDeparture && info.className.indexOf('arrival') > -1){
                    data.time = info.innerText;
                }
            }
        }
    }
}

$( document ).ready(function() {
    $('.pull-down').each(function() {
        var $this=$(this);
        $this.css('margin-top', $this.parent().height()-$this.height())
    });

});