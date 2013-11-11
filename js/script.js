var chatEvent = document.createEvent('Event')
chatEvent.initEvent('lpChatEvent', true, true)
var djAdvanceEvent = document.createEvent('Event')
djAdvanceEvent.initEvent('lpDjAdvanceEvent', true, true)
var djUpdateEvent = document.createEvent('Event')
djUpdateEvent.initEvent('lpDjUpdateEvent', true, true)
var userFanEvent = document.createEvent('Event')
userFanEvent.initEvent('lpUserFanEvent', true, true)

var lastWaitListPosition = 0

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

var settings = {}
var timeIdle = []

setTimeout(function() {

	API.on(API.CHAT, lpChatEventFunction)
	API.on(API.CHAT_COMMAND, lpChatCommandEventFunction)
	API.on(API.DJ_ADVANCE, lpDjAdvanceEventFunction)
	API.on(API.DJ_UPDATE, lpDjUpdateEventFunction)
	API.on(API.USER_FAN, lpUserFanEventFunction)
	API.on(API.USER_JOIN, lpUserJoinEventFunction)
	API.on(API.VOTE_UPDATE, lpVoteUpdateEventFunction)

	$.each(API.getUsers(), function(index, value) { 
		timeIdle[value.id] = 0
	})
	settings = $.parseJSON($('#lpSettingsDiv').text())

}, 10000)

setTimeout(function() {
	// setInterval(function() {
	// 	$.each(API.getUsers(), function(index, value) { 
	// 		timeIdle[value.id]++
	// 	})
	// 	var djs = API.getDJs()
	// 	for (var i = 0; i < 5; i++) {
	// 		if (djs.length > i) {
	// 			$('#idle-timer-' + i).html(secondsToString(timeIdle[djs[i].id]))
	// 		} else {
	// 			$('#idle-timer-' + i).html('')
	// 		}
	// 	}
	// }, 1000)
	$('#users-button').click(function() {
		$.each(API.getUsers(), function(i, v) {
			if(v.vote == -1) {
				$('.list.room .user').each(function(li, lv) {
					if($(lv).find('.name').html() == v.username) {
						$(lv).append('<i class="icon icon-meh" style="left: auto; right: 8px; top: -1px;"></i>')
					}
				})
			}
		})
	})
}, 10000)

function lpChatEventFunction(data) {
	timeIdle[data.fromID] = 0
	if(data.fromID != API.getUser().id) {
		if(data.message.indexOf("@" + API.getUser().username) > -1) {
			var jsondata = {"from": (data.from), "message": (data.message), "avatar": API.getUser(data.fromID).avatarID, "type": "Mentions", "bit": "1"}
		} else {
			var jsondata = {"from": (data.from), "message": (data.message), "avatar": API.getUser(data.fromID).avatarID, "type": "Chat Messages", "bit": "0"}
		}
		var json = JSON.stringify(jsondata)
		fireLpChatEvent(json)
	}
}

function lpChatCommandEventFunction(value) {
	var tokens = value.split(' ')
	var trigger = tokens[0].toLowerCase()
	var cmd = tokens
	cmd.splice(0, 1)
	cmd = cmd.join(' ')

	switch(trigger) {
		case '/add':
			if(cmd != "") {
				var users = findUser(cmd)
				if(users.count > 1) {
					API.chatLog('Found multiple users: ' + users.names, true)
				} else if(users.count == 1) {
					if(API.getUser().permission >= API.ROLE.BOUNCER) {
						API.moderateAddDJ(users.users[0].id)
					} else {
						API.chatLog('You don\'t have permission to edit the waitlist here.', true)
					}
				} else {
					API.chatLog('No users found.', true)
				}
			} else {
				API.chatLog('/add <username>: Adds <username> to the waitlist.')
			}
			break;
		case '/find':
			if(cmd != "") {
				var users = findUser(cmd)
				if(users.count > 1) {
					API.chatLog('Found multiple users: ' + users.names)
				} else if(users.count == 1) {
					API.chatLog('User found: ' + users.names)
				} else {
					API.chatLog('No users found.')
				}
			} else {
				API.chatLog('/find <part>: Find all the users with <part> in username.')
			}			
			break;
		case '/remove':
			if(cmd != "") {
				var users = findUser(cmd)
				if(users.count > 1) {
					API.chatLog('Found multiple users: ' + users.names, true)
				} else if(users.count == 1) {
					if(API.getUser().permission >= API.ROLE.BOUNCER) {
						API.moderateRemoveDJ(users.users[0].id)
					} else {
						API.chatLog('You don\'t have permission to edit the waitlist here.', true)
					}
				} else {
					API.chatLog('No users found.', true)
				}
			} else {
				API.chatLog('/remove <username>: Removes <username> from the waitlist.')
			}
			break;
		case '/skip':
			if(API.getUser().permission >= API.ROLE.BOUNCER) {
				API.moderateForceSkip()
			} else {
				API.chatLog('You don\'t have permission to skip here.', true)
			}
			break;
		default:
			API.chatLog(value + ': command not found.', true)
			break;
	}
}

function lpDjAdvanceEventFunction(obj) {
	if(obj.media) {
		var jsondata = { "avatar": obj.dj.avatarID, "username": (obj.dj.username), "song": (obj.media.author) + " - " + (obj.media.title), "duration": (obj.media.duration), "type": "DJ Advances" }
		var json = JSON.stringify(jsondata)
		fireLpDjAdvanceEvent(json)
	}
	if(settings.enable_historywarn == "true") {
		$.each(API.getHistory(), function(index, value) {
			if(value.media.id == API.getMedia().id) {
				API.chatLog('This song has been played in history about ' + (index + 1) + ' songs ago by ' +  value.user.username + '!', true)
			}
		})
	}
}

function lpDjUpdateEventFunction(djs) {
	if(API.getWaitListPosition() < 5 && API.getWaitListPosition() != lastWaitListPosition) {
		var jsondata = { "avatar": API.getUser().avatarID, "song": API.getNextMedia().media.author + " - " + API.getNextMedia().media.title + " (" + secondsToString(API.getNextMedia().media.duration) + ")", "type": "Booth Notifications" }
		var json = JSON.stringify(jsondata)
		fireLpDjUpdateEvent(json)
		lastWaitListPosition = API.getWaitListPosition()
	}

}

function lpUserFanEventFunction(user) {
	var jsondata = {"id": user.id, "from": (user.username), "type": "Fans"}
	var json = JSON.stringify(jsondata)
	fireLpUserFanEvent(json)
	if(settings.enable_autofan == "true") {
		var fs = require('app/services/user/UserFanService')
		new fs(true, user.id)
	}
}

function lpUserJoinEventFunction(user) {
	timeIdle[user.id] = 0
}

function lpVoteUpdateEventFunction(obj) {
	if(obj.vote == -1) {
		if($('.list.room').length == 1) {
			$('.list.room .user').each(function(li, lv) {
				if($(lv).find('.name').html() == obj.user.username) {
					$(lv).append('<i class="icon icon-meh" style="left: auto; right: 8px; top: -1px;"></i>')
				}
			})
		}
	} else if(obj.vote == 0) {
		if($('.list.room').length == 1) {
			$('.list.room .user').each(function(li, lv) {
				if($(lv).find('.name').html() == obj.user.username) {
					$(lv).find('.icon-meh').remove()
				}
			})
		}
	}
}

function secondsToString(seconds) {
	var numdays = Math.floor(seconds / 86400)
	var numhours = Math.floor((seconds % 86400) / 3600)
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60)
	var numseconds = Math.floor(((seconds % 86400) % 3600) % 60)
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

function findUser(username) {
	var results = {
		count: 0,
		names: "",
		users: []
	}
	$.each(API.getUsers(), function(index, value) {
		if(value.username.toLowerCase().indexOf(username.replace('"', '').replace("'", '').toLowerCase()) > -1) {
			results.users.push(value)
			results.count++
			if(index > 0) {
				results.names += ", "
			}
			results.names += value.username
		}
	})
	return results
}