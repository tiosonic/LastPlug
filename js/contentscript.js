var s = document.createElement('script');
s.src = chrome.extension.getURL("js/script.js");
document.head.appendChild(s);

function createHiddenDiv(divname) {
	var t = document.createElement('div');
	t.id = divname;
	t.style.cssText = "display:none;";
	document.body.appendChild(t);
}

setTimeout(function() {
	createHiddenDiv("lpChatEventDiv")
	createHiddenDiv("lpDjAdvanceEventDiv")
	createHiddenDiv("lpDjUpdateEventDiv")
	createHiddenDiv("lpSettingsDiv")
	createHiddenDiv("lpUserFanEventDiv")

	$.get('http://statpoint.info/lastplug/', function(data) {
		nicknameStyles = JSON.parse(data)
	});

	chrome.extension.sendRequest({method: "getVersion"}, function(response) {
		$('#chat-messages').append('<div class="update"><span class="text">Also, welcome to the LastPlug ' + response.value + '!</span></div>');
	});

	chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_grayscale"}, function(response) {
		if(response.value == "true") {
			function addTheRule(selector, rule) {
				document.styleSheets[2].addRule(selector, rule);
			}
			addTheRule("#chat a", "color: white !important;");
			addTheRule("#chat .icon", "opacity: 0.3 !important;");
			addTheRule(".from.ambassador", "color: #CFADFF !important;");
			addTheRule(".from.staff", "color: #666 !important;");
			addTheRule(".from.super", "font-weight: bold; color: #CCC !important;");
			addTheRule(".from.you", "color: white !important;");
			addTheRule(".is-you .name", "color: white !important;");
			addTheRule(".chat-moderator", "background: url('http://i.imgur.com/J0Ek5.png') no-repeat 0 5px !important;");
		}
	});
	document.getElementById('lpChatEventDiv').addEventListener('lpChatEvent', function() {
		var eventData = document.getElementById('lpChatEventDiv').innerText;
		var data = JSON.parse(eventData);

		chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_grayscale"}, function(response) {
			if(response.value == "false") {
				$('span[class*="from"]').each(function() {
					if(nicknameStyles.hasOwnProperty($(this).html())) {
						$(this).css(nicknameStyles[$(this).html()]);
					}
					if($(this).html() == "Maxorq ") { 
						$(this).parent().css("background", "url('http://i.imgur.com/y9V8q2x.png') no-repeat 7px 7px");
					}
				});
			}
		});
		
		chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_mentions"}, function(response) {
			if(response.value == "true") {
				if(data.bit == "1") {
					chrome.extension.sendRequest({icon: "mention", title: "You got mentioned on plug.dj!", message: data.from + " " + chrome.i18n.getMessage("GENERAL_SAYS") + ": " + data.message});
				}
			}
		});
		chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_chatmessages"}, function(response) {
			if(response.value == "true") {
				if(data.bit == "0") {
					chrome.extension.sendRequest({icon: "chat", title: "New message on plug.dj!", message: data.from + " " + chrome.i18n.getMessage("GENERAL_SAYS") + ": " + data.message});
				}
			}
		});
	});

	document.getElementById('lpDjAdvanceEventDiv').addEventListener('lpDjAdvanceEvent', function() {
		chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_djadvances"}, function(response) {
			var eventData = document.getElementById('lpDjAdvanceEventDiv').innerText;
			var data = JSON.parse(eventData);
			if(response.value == "true") {
				chrome.extension.sendRequest({icon: 'playing', title: data.username + ' ' + chrome.i18n.getMessage("NOTIFICATION_ISNOWPLAYING"), message: data.song + " (" + secondsToString(data.duration) + ")"});
			}
			chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_autowoot"}, function(anotherresponse) {
				if((anotherresponse.value == "true") && (data != null)) {
					$('#woot').click();
				}
			});
		});
	});

	document.getElementById('lpDjUpdateEventDiv').addEventListener('lpDjUpdateEvent', function() {
		chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_djupdates"}, function(response) {
			if(response.value == "true") {
				var eventData = document.getElementById('lpDjUpdateEventDiv').innerText;
				var data = JSON.parse(eventData);
				chrome.extension.sendRequest({icon: "booth", title: 'You are close to the booth!', message: 'You will play ' + data.song});
			}
		});
	});


	document.getElementById('lpUserFanEventDiv').addEventListener('lpUserFanEvent', function() {
		chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_fans"}, function(response) {
			if(response.value == "true") {
				var eventData = document.getElementById('lpUserFanEventDiv').innerText;
				var data = JSON.parse(eventData);
				chrome.extension.sendRequest({icon: "fan", title: chrome.i18n.getMessage("NOTIFICATION_FANNED"), message: "<b>" + data.from + "</b> " + chrome.i18n.getMessage("NOTIFICATION_ISNOWYOURFAN") + "!"});
			}
		});
	});

	var settings = { };
	chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_autofan"}, function(response) {
		settings.enable_autofan = response.value
	});
	setTimeout(function() {
		$('#lpSettingsDiv').text(JSON.stringify(settings))
	}, 1000)
}, 5000)


function secondsToString(seconds) {
	var numdays = Math.floor(seconds / 86400);
	var numhours = Math.floor((seconds % 86400) / 3600);
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
	var numseconds = Math.floor(((seconds % 86400) % 3600) % 60);
	if(numdays > 0) {
		return ">1 day"
	} else {
		if(numhours > 0) {
			return ">" + numhours + " hours"
		} else {
			if(numminutes > 9) {
				if(numseconds > 9) {
					return numminutes + ":" + numseconds
				} else {
					return numminutes + ":0" + numseconds
				}
			} else {
				if(numseconds > 9) {
					return "0" + numminutes + ":" + numseconds
				} else {
					return "0" + numminutes + ":0" + numseconds
				}
			}
		}
	}
}