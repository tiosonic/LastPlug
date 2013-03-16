var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-31054199-1']);
_gaq.push(['_trackPageviews']);
_gaq.push(['_setCustomVar', 1, 'Version', chrome.app.getDetails().version, '3']);
_gaq.push(['_trackEvent', 'LastPlug Stats', 'Loads Into Page', chrome.app.getDetails().version]);
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

function showNotification(title, message, avatar, color) {
	var notification = webkitNotifications.createHTMLNotification('notification.html?title=' + title + '&message=' + message + '&avatar=' + avatar + '&color=' + color);
		
	notification.show();
	
	_gaq.push(['_trackEvent', 'LastPlug Stats', 'Notifications Served', chrome.app.getDetails().version]);
	
	var notificationTimeout = window.localStorage["notificationTimeout"];
	if(notificationTimeout == undefined) {
		notificationTimeout = 5000;
	}
	
	setTimeout(function() { notification.cancel(); }, notificationTimeout);
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if(request.method == "getLocalStorage") {
		sendResponse({value: localStorage[request.value]});
	} else {
		showNotification(request.title, request.message, request.avatar, request.color);
	}
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(tab.url.indexOf('plug.dj') > -1) {
		chrome.pageAction.show(tabId);
		if(window.localStorage['enable_updates'] == "true") {
			if(window.localStorage['lastVersion'] !== undefined) {
				if(window.localStorage['lastVersion'] !== chrome.app.getDetails().version) {
					showNotification('LastPlug have just been updated!', 'Updated from ' + window.localStorage['lastVersion'] + " to " + chrome.app.getDetails().version + '.<br /><a style="color: white" href="http://github.com/Maxorq/LastPlug/wiki/Changelog" target="_blank">See the changelog here...</a>', 'img/icon.png', 'red');
					window.localStorage['lastVersion'] = chrome.app.getDetails().version;
				}
			} else {
				window.localStorage['lastVersion'] = chrome.app.getDetails().version;
			}
		}
	}
});