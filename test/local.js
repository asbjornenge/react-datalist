var jsdom   = require("jsdom").jsdom
document    = jsdom('')
window      = document.createWindow()
navigator   = window.navigator
HTMLElement = window.HTMLElement
require('./spec.js')