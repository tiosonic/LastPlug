
var bs = bs.prototype = {
	storage: {},

	getBrowser: function() {
		return 'Firefox'
	},
	getLocalStorage: function(setting, callback) {
		self.port.emit('getSimpleStorage', {value: setting})
		self.port.on('simpleStorage', function(response) {
			callback({value: response})
		})
	},
	getStorage: function(callback) {
		callback(storage)
	},
	getVersion: function(callback) {

	},
	notification: function(options) {
		self.port.emit('notification', options)
	},
	saveStorage: function(storage) {
		self.port.emit('storage', storage)
	},
	setup: function() {
		self.port.emit('getScriptUrl')
		self.port.on('scriptUrl', function(scriptUrl) {
			var s = document.createElement('script')
			s.src = scriptUrl
			document.head.appendChild(s)
		})
	}
}

self.port.on('storage', function(response) {
	bs.storage = response
})