var defaultNotificationTimeout = 5000;
var defaultChatMessages = false;
var defaultDjAdvances = true;
var defaultDjUpdates = true;
var defaultFans = true;
var defaultMentions = true;
var defaultUpdates = true;

function loadSettings() {
	var notificationTimeout = window.localStorage["notificationTimeout"];
	var enableChatMessages = window.localStorage["enable_chatmessages"];
	var enableDjAdvances = window.localStorage["enable_djadvances"];
	var enableDjUpdates = window.localStorage["enable_djupdates"];
	var enableFans	= window.localStorage["enable_fans"];
	var enableMentions = window.localStorage["enable_mentions"];
	var enableUpdates = window.localStorage["enable_updates"];
	
	if(notificationTimeout == undefined) {
		notificationTimeout = defaultNotificationTimeout;
	}
	if(enableChatMessages == undefined) {
		enableChatMessages = defaultChatMessages;
	}
	if(enableDjAdvances == undefined) {
		enableDjAdvances = defaultDjAdvances;
	}
	if(enableDjUpdates == undefined) {
		enableDjUpdates = defaultDjUpdates;
	}
	if(enableFans == undefined) {
		enableFans = defaultFans;
	}
	if(enableMentions == undefined) {
		enableMentions = defaultMentions;
	}
	if(enableUpdates == undefined) {
		enableUpdates = defaultUpdates;
	}
	
	if(enableChatMessages == "true") {
		$('#enable_chatmessages').click()
	}
	if(enableDjAdvances == "true") {
		$('#enable_djadvances').click()
	}
	if(enableDjUpdates == "true") {
		$('#enable_djupdates').click()
	}
	if(enableFans == "true") {
		$('#enable_fans').click()
	}
	if(enableMentions == "true") {
		$('#enable_mentions').click()
	}
	if(enableUpdates == "true") {
		$('#enable_updates').click()
	}
	
	$('#notificationTimeout').val(notificationTimeout / 1000);
}
function saveSettings() {
	window.localStorage["notificationTimeout"] = $('#notificationTimeout').val() * 1000;
	
	if($('#enable_chatmessages:checked').val() !== undefined) {
		window.localStorage["enable_chatmessages"] = true;
	} else {
		window.localStorage["enable_chatmessages"] = false;
	}
	if($('#enable_djadvances:checked').val() !== undefined) {
		window.localStorage["enable_djadvances"] = true;
	} else {
		window.localStorage["enable_djadvances"] = false;
	}
	if($('#enable_djupdates:checked').val() !== undefined) {
		window.localStorage["enable_djupdates"] = true;
	} else {
		window.localStorage["enable_djupdates"] = false;
	}
	if($('#enable_fans:checked').val() !== undefined) {
		window.localStorage["enable_fans"] = true;
	} else {
		window.localStorage["enable_fans"] = false;
	}
	if($('#enable_mentions:checked').val() !== undefined) {
		window.localStorage["enable_mentions"] = true;
	} else {
		window.localStorage["enable_mentions"] = false;
	}
	if($('#enable_updates:checked').val() !== undefined) {
		window.localStorage["enable_updates"] = true;
	} else {
		window.localStorage["enable_updates"] = false;
	}
	
	$('#session').html('Saved!')
}
function eraseSettings() {
	window.localStorage.removeItem("notificationTimeout");
	window.location.reload();
}

$(function() {
	loadSettings();
	$('#saveSettings').click(function() {
		saveSettings();
	});
	$('#eraseSettings').click(function() {
		eraseSettings();
	});
});