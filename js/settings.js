var defaults = [5000, false, true, true, true, true, true, false, true, false];
var settings = ['notificationTimeout',
				'enable_chatmessages', 
				'enable_djadvances', 
				'enable_djupdates', 
				'enable_fans', 
				'enable_mentions', 
				'enable_updates', 
				'enable_autofan',
				'enable_autowoot', 
				'enable_grayscale'];


function loadSettings() {
	for(var i = 0; i < settings.length; i++) {
		if(window.localStorage[settings[i]] == undefined || window.localStorage[settings[i]] == 'undefined') {
			window.localStorage[settings[i]] = defaults[i]
		}
		if($('#' + settings[i]).attr('type') == 'checkbox') {
			if(window.localStorage[settings[i]] == 'true') {
				$('#' + settings[i]).click()
			}
		} else {
			if(i == 0) {
				$('#' + settings[i]).val(window.localStorage[settings[i]] / 1000)
			} else {
				$('#' + settings[i]).val(window.localStorage[settings[i]])
			}
		}
	}
	$('#session').css('display', 'none');
}

function saveSettings() {
	for(var i = 0; i < settings.length; i++) {
		if($('#' + settings[i]).attr('type') == 'checkbox') {
			if($('#' + settings[i] + ":checked").val() !== undefined && $('#' + settings[i] + ":checked").val() !== 'undefined' ) {
				window.localStorage[settings[i]] = 'true';
			} else {
				window.localStorage[settings[i]] = 'false';
			}
		} else {
			if(i == 0) {
				window.localStorage[settings[i]] = $('#' + settings[i]).val() * 1000;
			} else {
				window.localStorage[settings[i]] = $('#' + settings[i]).val();
			}
		}
	}
	$('#session').slideDown('slow').html('Settings have been saved.<br />You may need to refresh the page.');
	setTimeout(function() {
		$('#session').slideUp('slow');
	}, 3000);
}

function eraseSettings() {
	for(var i = 0; i < settings.length; i++) {
		window.localStorage.removeItem(settings[i])
	}
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