function getBrowser() {
	return 'Chrome'
}

function getLocalStorage(setting, callback) {
	chrome.extension.sendRequest({method: "getLocalStorage", value: setting}, function(response) {
		callback(response)
	})
}

function getStorage(callback) {
	callback(window.localStorage)
}

function getVersion(callback) {
	chrome.extension.sendRequest({method: "getVersion"}, function(response) {
		callback(response)
	})
}

function notification(options) {
	chrome.extension.sendRequest(options)
}

function saveStorage(storage) {
	
}

function setup() {
	var s = document.createElement('script')
	s.src = chrome.extension.getURL("data/js/script.js")
	document.head.appendChild(s)
}