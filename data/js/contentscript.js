setup()

function addTheRule(selector, rule) {
	document.styleSheets[2].addRule(selector, rule);
}

function createHiddenDiv(divname) {
	$('<div></div>').css('display', 'none').attr('id', divname).appendTo('body')
}

setTimeout(function() {
	var divs = [
		"lpChatEventDiv",
		"lpDjAdvanceEventDiv",
		"lpDjUpdateEventDiv",
		"lpSettingsDiv",
		"lpUserFanEventDiv"
	]
	$.each(divs, function(index, value) {
		createHiddenDiv(value)
	})

	$.get('http://statpoint.info/lastplug/', function(data) {
		nicknameStyles = JSON.parse(data)
	});

	getVersion(function(response) {
		$('#chat-messages').append('<div class="update"><span class="text">Also, welcome to the LastPlug ' + response.value + '!</span></div>');
	});

	getLocalStorage("enable_grayscale", function(response) {
		if(response.value == "true") {
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
		var eventData = $('#lpChatEventDiv').text()
		var data = JSON.parse(eventData)

		getLocalStorage("enable_grayscale", function(response) {
			if(response.value == "false") {
				$('span[class*="from"]').each(function() {
					if(nicknameStyles.hasOwnProperty($(this).html())) {
						$(this).css(nicknameStyles[$(this).html()])
					}
					if($(this).html() == "Maxorq ") { 
						$(this).parent().css("background", "url('http://i.imgur.com/y9V8q2x.png') no-repeat 7px 7px");
					}
				});
			}
		});
		
		getLocalStorage("enable_mentions", function(response) {
			if(response.value == "true") {
				if(data.bit == "1") {
					notification({icon: "mention", title: "You got mentioned on plug.dj!", message: data.from + " " + chrome.i18n.getMessage("GENERAL_SAYS") + ": " + data.message});
				}
			}
		});
		getLocalStorage("enable_chatmessages", function(response) {
			if(response.value == "true") {
				if(data.bit == "0") {
					notification({icon: "chat", title: "New message on plug.dj!", message: data.from + " " + chrome.i18n.getMessage("GENERAL_SAYS") + ": " + data.message});
				}
			}
		});
	});

	document.getElementById('lpDjAdvanceEventDiv').addEventListener('lpDjAdvanceEvent', function() {
		getLocalStorage("enable_djadvances", function(response) {
			var eventData = $('#lpDjAdvanceEventDiv').text();
			var data = JSON.parse(eventData);
			if(response.value == "true") {
				notification({icon: 'playing', title: data.username + ' ' + chrome.i18n.getMessage("NOTIFICATION_ISNOWPLAYING"), message: data.song + " (" + secondsToString(data.duration) + ")"});
			}
			getLocalStorage("enable_autowoot", function(anotherresponse) {
				if((anotherresponse.value == "true") && (data != null)) {
					$('#woot').click();
				}
			});
		});
	});

	document.getElementById('lpDjUpdateEventDiv').addEventListener('lpDjUpdateEvent', function() {
		getLocalStorage("enable_djupdates", function(response) {
			if(response.value == "true") {
				var eventData = $('#lpDjUpdateEventDiv').text();
				var data = JSON.parse(eventData);
				notification({icon: "booth", title: 'You are close to the booth!', message: 'You will play ' + data.song});
			}
		});
	});


	document.getElementById('lpUserFanEventDiv').addEventListener('lpUserFanEvent', function() {
		getLocalStorage("enable_fans", function(response) {
			if(response.value == "true") {
				var eventData = $('#lpUserFanEventDiv').text();
				var data = JSON.parse(eventData);
				notification({icon: "fan", title: chrome.i18n.getMessage("NOTIFICATION_FANNED"), message: "<b>" + data.from + "</b> " + chrome.i18n.getMessage("NOTIFICATION_ISNOWYOURFAN") + "!"});
			}
		});
	});

	var settings = { };
	getLocalStorage("enable_autofan", function(response) {
		settings.enable_autofan = response.value
	});
	getLocalStorage("enable_historywarn", function(response) {
		settings.enable_historywarn = response.value
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