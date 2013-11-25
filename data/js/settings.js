var defaults = [5000, false, true, true, true, true, true, false, true, false, false];
var settings = ['notificationTimeout',
				'enable_chatmessages', 
				'enable_djadvances', 
				'enable_djupdates', 
				'enable_fans', 
				'enable_mentions', 
				'enable_updates', 
				'enable_autofan',
				'enable_autowoot', 
				'enable_grayscale',
				'enable_historywarn'];

var theStorage = {}

function loadSettings() {
	for(var i = 0; i < settings.length; i++) {
		if(theStorage[settings[i]] == undefined || theStorage[settings[i]] == 'undefined') {
			theStorage[settings[i]] = defaults[i]
		}
		if($('#' + settings[i]).attr('type') == 'checkbox') {
			if(theStorage[settings[i]] == 'true') {
				$('#' + settings[i]).click()
			}
		} else {
			if(i == 0) {
				$('#' + settings[i]).val(theStorage[settings[i]] / 1000)
			} else {
				$('#' + settings[i]).val(theStorage[settings[i]])
			}
		}
	}
	$('#session').css('display', 'none');
}

function saveSettings() {
	for(var i = 0; i < settings.length; i++) {
		if($('#' + settings[i]).attr('type') == 'checkbox') {
			if($('#' + settings[i] + ":checked").val() !== undefined && $('#' + settings[i] + ":checked").val() !== 'undefined' ) {
				theStorage[settings[i]] = 'true';
			} else {
				theStorage[settings[i]] = 'false';
			}
		} else {
			if(i == 0) {
				theStorage[settings[i]] = $('#' + settings[i]).val() * 1000;
			} else {
				theStorage[settings[i]] = $('#' + settings[i]).val();
			}
		}
	}

	saveStorage(theStorage)

	$('#session').slideDown('slow').html('Settings have been saved.<br />You may need to refresh the page.');
	setTimeout(function() {
		$('#session').slideUp('slow');
	}, 3000);
}

$(function() {
	setInterval(function() {
		bs.getStorage(function(storage) {
			console.log('THESTORAGE')
			theStorage = storage
			$('#session').slideDown('slow').html(theStorage)
			loadSettings()
		})
	}, 1000)
	$('#saveSettings').click(function() {
		saveSettings();
	});
});