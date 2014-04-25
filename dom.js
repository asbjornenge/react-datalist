module.exports = function(markup) {
    if (typeof document !== 'undefined') return
    var jsdom   = require("jsdom").jsdom
    global.document    = jsdom(markup || '')
    global.window      = document.createWindow()
    global.navigator   = window.navigator
    global.HTMLElement = window.HTMLElement
}