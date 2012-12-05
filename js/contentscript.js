var s = document.createElement('script');
s.src = chrome.extension.getURL("js/script.js");
document.head.appendChild(s);

function createHiddenDiv(divname) {
	var t = document.createElement('div');
	t.id = divname;
	t.style.cssText = "display:none;";
	document.body.appendChild(t);
}

createHiddenDiv("lpChatEventDiv")
createHiddenDiv("lpDjAdvanceEventDiv")
createHiddenDiv("lpDjUpdateEventDiv")
createHiddenDiv("lpUserFanEventDiv")

$('#booth-canvas').after('<span id="idle-timer-4" style="width: 30px; text-align: center; position: absolute; top: 75%; left: 57px; padding: 4px;">0:00</span>');
$('#booth-canvas').after('<span id="idle-timer-3" style="width: 30px; text-align: center; position: absolute; top: 75%; left: 133px; padding: 4px;">0:00</span>');
$('#booth-canvas').after('<span id="idle-timer-2" style="width: 30px; text-align: center; position: absolute; top: 75%; left: 207px; padding: 4px;">0:00</span>');
$('#booth-canvas').after('<span id="idle-timer-1" style="width: 30px; text-align: center; position: absolute; top: 75%; left: 284px; padding: 4px;">0:00</span>');
$('#dj-canvas').after('<span id="idle-timer-0" style="width: 155px; text-align: center; position: absolute; top: 75%; left: 535px; padding-top: 4px;">0:00</span>');
$('#chat-messages').append('<div class="chat-update"><span class="chat-text" style="color: white;">LastPlug 0.4 enabled!</span></div>');

chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_grayscale"}, function(response) {
	if(response.value == "true") {
		function addTheRule(selector, rule) {
			document.styleSheets[0].addRule(selector, rule);
			document.styleSheets[3].addRule(selector, rule);
		}
		addTheRule(".chat-emote", "color: white;");
		addTheRule(".chat-from-ambassador", "color: #CFADFF;");
		addTheRule(".chat-from-moderator", "color: #666;");
		addTheRule(".chat-from-super", "font-weight: bold; color: #CCC;");
		addTheRule(".chat-from-you", "color: white;");
		addTheRule(".chat-mention", "color: white;");
		addTheRule(".chat-moderator", "background: url('http://i.imgur.com/J0Ek5.png') no-repeat 0 5px;");
	}
});
document.getElementById('lpChatEventDiv').addEventListener('lpChatEvent', function() {
	var eventData = document.getElementById('lpChatEventDiv').innerText;
	var data = JSON.parse(eventData);
	
	//var isYoutubeURL = data.message.replace(/^[^v]+v.(.{11}).*/,"$1");

	//if(isYoutubeURL) {
	//	alert(isYoutubeURL);
	//}

	chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_grayscale"}, function(response) {
		if(response.value == "false") {
			$('span[class*="chat-from"]').each(function() {
				if($(this).html() == "Master Lucas") { 
					$(this).css("color", "#1AD71A"); 
				}
				if($(this).html() == "Maxorq") { 
					$(this).css("color", "red");
				}
			});
		}
	});
	
	chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_mentions"}, function(response) {
		if(response.value == "true") {
			if(data.bit == "1") {
				chrome.extension.sendRequest({avatar: 'http://www.plug.dj/images/avatars/thumbs/' + data.avatar + '.png', title: chrome.i18n.getMessage("NOTIFICATION_MENTIONED"), message: "<b>" + data.from + " " + chrome.i18n.getMessage("GENERAL_SAYS") + ":</b> " + data.message, color: "red"});
			}
		}
	});
	chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_chatmessages"}, function(response) {
		if(response.value == "true") {
			if(data.bit == "0") {
				chrome.extension.sendRequest({avatar: 'http://www.plug.dj/images/avatars/thumbs/' + data.avatar + '.png', title: "Someone wrote a message on plug.dj!", message: "<b>" + data.from + " " + chrome.i18n.getMessage("GENERAL_SAYS") + ":</b> " + data.message, color: "blue"});
			}
		}
	});
});

document.getElementById('lpDjAdvanceEventDiv').addEventListener('lpDjAdvanceEvent', function() {
	chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_djadvances"}, function(response) {
		var eventData = document.getElementById('lpDjAdvanceEventDiv').innerText;
		var data = JSON.parse(eventData);
		if(response.value == "true") {
			chrome.extension.sendRequest({avatar: 'http://www.plug.dj/images/avatars/thumbs/' + data.avatar + '.png', title: data.username + ' ' + chrome.i18n.getMessage("NOTIFICATION_ISNOWPLAYING"), message: data.song + " <b>(" + secondsToString(decodeURIComponent(data.duration)) + ")</b>", color: "orange"});
		}
		chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_autowoot"}, function(anotherresponse) {
			if((anotherresponse.value == "true") && (data != null)) {
				$('#button-vote-positive').click();
			}
		});
	});
});

document.getElementById('lpDjUpdateEventDiv').addEventListener('lpDjUpdateEvent', function() {
	chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_djupdates"}, function(response) {
		if(response.value == "true") {
			var eventData = document.getElementById('lpDjUpdateEventDiv').innerText;
			var data = JSON.parse(eventData);
			chrome.extension.sendRequest({avatar: 'http://www.plug.dj/images/avatars/thumbs/' + data.avatar + '.png', title: 'You are close to the booth!', message: 'You will play ' + data.song, color: "purple"});
		}
	});
});

document.getElementById('lpUserFanEventDiv').addEventListener('lpUserFanEvent', function() {
	chrome.extension.sendRequest({method: "getLocalStorage", value: "enable_fans"}, function(response) {
		if(response.value == "true") {
			var eventData = document.getElementById('lpUserFanEventDiv').innerText;
			var data = JSON.parse(eventData);
			chrome.extension.sendRequest({avatar: 'http://www.plug.dj/images/avatars/thumbs/' + data.avatar + '.png', title: chrome.i18n.getMessage("NOTIFICATION_FANNED"), message: "<b>" + data.from + "</b> " + chrome.i18n.getMessage("NOTIFICATION_ISNOWYOURFAN") + "!", "color": "green"});
		}
	});
});

function secondsToString(seconds) {
	var numdays = Math.floor(seconds / 86400);
	var numhours = Math.floor((seconds % 86400) / 3600);
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
	var numseconds = ((seconds % 86400) % 3600) % 60;
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