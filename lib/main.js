var notifications = require('sdk/notifications')
var pageMod = require('sdk/page-mod')
var panel = require('sdk/panel')
var self = require('sdk/self')
var ss = require('sdk/simple-storage')
var widgets = require('sdk/widget')
 
var jquery = self.data.url('js/jquery-1.9.1.min.js')

var settings = panel.Panel({
	width: 318,
	height: 500,
	contentURL: self.data.url('settings.html'),
	contentScriptFile: [jquery,
						self.data.url('bs/firefox.js'),
						self.data.url('js/settings.js')],
	contentScriptWhen: 'end',
	onShow: function() {
		console.log('EMITTING ' + JSON.stringify(ss.storage))
		settings.port.emit('storage', ss.storage)
	}
})

settings.port.on('storage', function(storage) {
	ss.storage = storage
	console.log('Storage is ' + JSON.stringify(ss.storage))
})

var widget = widgets.Widget({
	id: "lastplug",
	label: "LastPlug",
	contentURL: "http://www.mozilla.org/favicon.ico",
	panel: settings
})

pageMod.PageMod({
	include: "*.plug.dj",
	contentScriptFile: [jquery,
						self.data.url('bs/firefox.js'),
						self.data.url('js/contentscript.js')],
	onAttach: function(worker) {
		worker.port.on('getScriptUrl', function() {
			worker.port.emit('scriptUrl', self.data.url('js/script.js'))
		})
		// worker.port.on('getSimpleStorage', function(value) {
		// 	worker.port.emit('simpleStorage', ss.storage[value])
		// })
		// worker.port.on('getStorage', function() {
		// 	worker.port.emit('storage', ss.storage)
		// })
		// worker.port.on('storage', function(storage) {
		// 	ss.storage = storage
		// })
		worker.port.on('notification', function(options) {
			notifications.notify({
				title: options.title,
				text: options.message,
				iconURL: self.data.url('img/' + options.icon + '.png')
			})
		})
	}
})