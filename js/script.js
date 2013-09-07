var chatEvent = document.createEvent('Event')
chatEvent.initEvent('lpChatEvent', true, true)
var djAdvanceEvent = document.createEvent('Event')
djAdvanceEvent.initEvent('lpDjAdvanceEvent', true, true)
var djUpdateEvent = document.createEvent('Event')
djUpdateEvent.initEvent('lpDjUpdateEvent', true, true)
var userFanEvent = document.createEvent('Event')
userFanEvent.initEvent('lpUserFanEvent', true, true)

function fireLpChatEvent(data) {
	hiddenDiv = document.getElementById('lpChatEventDiv')
	hiddenDiv.innerText = data
	hiddenDiv.dispatchEvent(chatEvent)
}
function fireLpDjAdvanceEvent(data) {
	hiddenDiv = document.getElementById('lpDjAdvanceEventDiv')	
	hiddenDiv.innerText = data
	hiddenDiv.dispatchEvent(djAdvanceEvent)
}
function fireLpDjUpdateEvent(data) {
	hiddenDiv = document.getElementById('lpDjUpdateEventDiv')	
	hiddenDiv.innerText = data
	hiddenDiv.dispatchEvent(djUpdateEvent)
}
function fireLpUserFanEvent(data) {
	hiddenDiv = document.getElementById('lpUserFanEventDiv')	
	hiddenDiv.innerText = data
	hiddenDiv.dispatchEvent(userFanEvent)
}

var timeIdle = []

setTimeout(function() {

	API.on(API.CHAT, lpChatEventFunction)
	API.on(API.DJ_ADVANCE, lpDjAdvanceEventFunction)
	API.on(API.DJ_UPDATE, lpDjUpdateEventFunction)
	API.on(API.USER_FAN, lpUserFanEventFunction)
	API.on(API.USER_JOIN, lpUserJoinEventFunction)

	$.each(API.getUsers(), function(index, value) { 
		timeIdle[value.id] = 0
	})
	var settings = $.parseJSON($('#lpSettingsDiv').text())
	if(settings.disable_animations == "true") {
		animSpeed = Infinity
	}
	if(settings.disable_audience == "true") {
		$('#audience').remove()
	}

}, 10000)

setTimeout(function() {
	setInterval(function() {
		$.each(API.getUsers(), function(index, value) { 
			timeIdle[value.id]++
		})
		var djs = API.getDJs()
		for (var i = 0; i < 5; i++) {
			if (djs.length > i) {
				$('#idle-timer-' + i).html(secondsToString(timeIdle[djs[i].id]))
			} else {
				$('#idle-timer-' + i).html('')
			}
		}
	}, 1000)
}, 10000)

function lpChatEventFunction(data) {
	timeIdle[data.fromID] = 0
	//if(data.from != API.getUser().username) {
		if(data.message.indexOf("@" + API.getUser().username) > -1) {
			var jsondata = {"from": (data.from), "message": (data.message), "avatar": API.getUser(data.fromID).avatarID, "type": "Mentions", "bit": "1"}
		} else {
			var jsondata = {"from": (data.from), "message": (data.message), "avatar": API.getUser(data.fromID).avatarID, "type": "Chat Messages", "bit": "0"}
		}
		var json = JSON.stringify(jsondata)
		fireLpChatEvent(json)
	//}
}

function lpDjAdvanceEventFunction(obj) {
	if(obj.media) {
		var jsondata = { "avatar": obj.dj.avatarID, "username": (obj.dj.username), "song": (obj.media.author) + " - " + (obj.media.title), "duration": (obj.media.duration), "type": "DJ Advances" }
		var json = JSON.stringify(jsondata)
		fireLpDjAdvanceEvent(json)
	}
}

function lpDjUpdateEventFunction(djs) {
	var djs = API.getDJs()
	for (var i = 0; i < djs.length; i++) {
		if (djs[i].username == API.getUser().username) {
			var jsondata = { "avatar": API.getUser().avatarID, "song": ($('#up-next').html()), "type": "Booth Notifications" }
			var json = JSON.stringify(jsondata)
			fireLpDjUpdateEvent(json)
		}
	}
}

function lpUserFanEventFunction(user) {
	var jsondata = {"avatar": user.avatarID, "from": (user.username), "type": "Fans"}
	var json = JSON.stringify(jsondata)
	fireLpUserFanEvent(json)
}

function lpUserJoinEventFunction(user) {
	timeIdle[user.id] = 0
}

function secondsToString(seconds) {
	var numdays = Math.floor(seconds / 86400)
	var numhours = Math.floor((seconds % 86400) / 3600)
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60)
	var numseconds = ((seconds % 86400) % 3600) % 60
	if(numdays > 0) {
		return ">1 day"
	} else {
		if(numhours > 0) {
			return ">" + numhours + "h"
		} else {
			if(numseconds > 9) {
				return numminutes + ":" + numseconds
			} else {
				return numminutes + ":0" + numseconds
			}
		}
	}
}