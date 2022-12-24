// NOAA-formatted TideObjects are a class with three elements;
// t, the time and date; v, the height of the tide; and type, high or low tide;
// t, the NOAA time string, will be formatted as "YYYY-MM-DD hh:mm"

var todayDate = new Date();
var todayDate2 = new Date();
var tomorrowDate = todayDate2.setDate(todayDate2.getDate() + 1);
var today = formatDate(todayDate);
var tomorrow = formatDate(tomorrowDate);

// From NOAA API: https://api.tidesandcurrents.noaa.gov/api/prod/
var SAGAMORE_BEACH_STATION_ID = 8447173;
var BASE_URL = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";
var QUERY_PARAMETERS = "?date=today&station=" + SAGAMORE_BEACH_STATION_ID.toString();

// took these from the "Tide Predictions (high/low) - 8557863 Rehoboth Beach, MD - August 2025" example on the NOAA API documentation
var DEFAULT_QUERY_PARAMETERS = "&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=DataAPI_Sample&format=json";

var FULL_URL = BASE_URL + QUERY_PARAMETERS + DEFAULT_QUERY_PARAMETERS;

// takes in a date and formats it YYYYMMDD
// borrowed from user o-o on StackOverflow
function formatDate(d) {
  var nd = new Date(d);
  var mm = nd.getMonth() + 1;
  var dd = nd.getDate();
  return [nd.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
}

// gets the NOAA-formatted date from a TideObject and formats it as "YYYYMMDD"
function getNOAADate(tide) {
  // a string formatted as described
  var tideDate = tide.t;
  // useful elements of this date
  var tideMonth = tideDate.substring(5, 7);
  var tideDay = tideDate.substring(8, 10);
  var tideYear = tideDate.substring(0, 4);
  // the substring containing only the date, formatted YYYYMMDD
  var formattedDate = tideYear + tideMonth + tideDay;

  return formattedDate;
}

// given a TideObject, gets a string telling the type of tide ("high" or "low")
function getType(tide) {
  var NOAAType = tide.type;

  if (NOAAType == "H") {
    return "high";
  } else if (NOAAType == "L") {
    return "low";
  } else {
    return;
  }
}

// tells the time at which a TideObject will occur, formatted as a string
function getTime(tide) {
  var NOAADate = tide.t;
  var time = NOAADate.substring(11, 16);

  return time;
}

// places the first four tides into div with the "tides" id
// where tide is a TideObject and index is a number, 1-4, representing which
// tide to print
function placeOneTide(tide, index) {
  var tideDate = getNOAADate(tide);
  var indexString = index.toString();
  var prefix = "tide";
  var tideElement = document.getElementById(prefix.concat(indexString));
  if (tideDate == today) {
    tideElement.innerHTML = "Today, a " + getType(tide) + " tide will occur at " + getTime(tide) + ".";
  } else if (tideDate == tomorrow) {
    // currently the FULL_URL is hard-coded to only fetch tides for today
    // but this code exists if we want to change FULL_URL to pull tomorrow's tides as well
    tideElement.innerHTML = "Tomorrow, a " + getType(tide) + " tide will occur at " + getTime(tide) + ".";
  } else {
    return;
  }
  return;
}

// returns array of TideObjects
function fetchTideData() {
  return fetch(FULL_URL)
    .then(res => res.json());
}

// places the first four tides at their respective positions on the webpage
// data is an array of TideObjects
// serves as the "main" function of this file, calls the other functions
function replaceTides(rawTideData) {
  // actual array is in rawTideData.predictions
  var tideData = rawTideData.predictions;
  for (i = 0; i < tideData.length; i++) {
    placeOneTide(tideData[i], i + 1)
  }
};

function main() {
  fetchTideData().then(
    rawTideData => replaceTides(rawTideData)
  )
}

main();
