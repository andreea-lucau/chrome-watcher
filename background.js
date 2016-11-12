var urls = {};
var currentUrl = null;
var currentDay = null;
var startTime = null;

function resetDay(d) {
    var today = d.getDay();

    if (currentDay == null) {
        currentDay = today;
        return;
    }

    if (currentDay != today) {
        alert("reset");
        urls = {}
        currentUrl = null;
        startTime = null;
        currentDay = today;
    }
}

function formatUrl(url) {
	var start = url.indexOf("://") + 3;
	var end = url.indexOf("/", start);
	
	if (end == -1)
		end = url.length;

	url = url.substring(start, end);
	return url;
}

function updateCurrentTime() {
	var d = new Date();

    resetDay(d);
	if (currentUrl == null)
		return;

	var now = d.getTime();
	var delta_time = now - startTime;

	if (!(currentUrl in urls))
		urls[currentUrl] = delta_time;
	else
		urls[currentUrl] += delta_time;
    startTime = now;
}

function updateUrls(url) {
	if (url.indexOf("chrome://") != -1)
        return;

	url = formatUrl(url);
	if (currentUrl == url) {
		updateCurrentTime();
		return;
	}

	if (currentUrl == null) {
		var d = new Date();
		var now = d.getTime();
		startTime = now;
		currentUrl = url;
		return;
	}
	updateCurrentTime();
	currentUrl = url;
}

function tabUpdated(tabId, changeInfo, tab) {
	if (tab.url != null)
		updateUrls(tab.url);
}

function tabActivated(activeInfo) {
	chrome.tabs.get(activeInfo.tabId, function(tab) {
		updateUrls(tab.url);
	});
}

chrome.tabs.onActivated.addListener(tabActivated);
chrome.tabs.onUpdated.addListener(tabUpdated);
