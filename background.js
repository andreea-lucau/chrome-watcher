var urls = {};
var currentUrl = null;
var currentDay = null;
var startTime = null;
const MAX_TOP_URLS = 7;

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

function sortUrls() {
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

function getTopUrls() {
    updateCurrentTime();
    var topUrls = sortUrls();
    return topUrls.slice(0, Math.min(MAX_TOP_URLS, topUrls.length));
}
