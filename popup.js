function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    if (secs < 10)
        secs = '0' + secs;
    if (mins < 10)
        mins = '0' + mins;

    return hrs + ':' + mins + ':' + secs;
}

function sortUrls(urls) {
    if (urls == null)
        return [];

	// Create items array
	var items = Object.keys(urls).map(function(key) {
		return [key, urls[key]];
	});

	// Sort the array based on the second element
	items.sort(function(first, second) {
		return second[1] - first[1];
	});

    return items;
}

function getFormattedTable(items) {
    var table_rows = "";
	for (var i = 0; i < Math.min(7, items.length); i++) {
		var url = items[i];
        var url_cell = "<a href=http://" + url[0] + " target=\"_blank\">" + url[0] + "</a>";
		table_rows += "<tr><td id=\"url\" class=\"mdl-data-table__cell--non-numeric\">" + url_cell + "</td><td>" + msToTime(url[1]) + "</td></tr>";
	}
    if (items.length == 0)
        table_rows = "No pages visited yet";

    return table_rows;
}

document.addEventListener('DOMContentLoaded', function () {
	var bg = chrome.extension.getBackgroundPage();
	bg.updateCurrentTime();
	var urls = bg.urls;

	var items = sortUrls(urls);
	document.getElementById("top_urls").innerHTML = getFormattedTable(items);
});
