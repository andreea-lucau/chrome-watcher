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

function getFormattedTable(topUrls) {
    var table_rows = "";
	for (var i = 0; i < topUrls.length; i++) {
		var url = topUrls[i];
        var url_cell = "<a href=http://" + url[0] + " target=\"_blank\">" + url[0] + "</a>";
		table_rows += "<tr><td id=\"url\" class=\"mdl-data-table__cell--non-numeric\">" + url_cell + "</td><td>" + msToTime(url[1]) + "</td></tr>";
	}
    if (topUrls.length == 0)
        table_rows = "No pages visited yet";

    return table_rows;
}

document.addEventListener('DOMContentLoaded', function () {
	var bg = chrome.extension.getBackgroundPage();
    var topUrls = bg.getTopUrls();
	document.getElementById("top_urls").innerHTML = getFormattedTable(topUrls);
});
