module.exports = function() {
    if (typeof document !== 'undefined') return
    var jsdom   = require("jsdom").jsdom
    global.document    = jsdom('')
    global.window      = document.createWindow()
    global.navigator   = window.navigator
    global.HTMLElement = window.HTMLElement
}