var jsdom      = require("jsdom").jsdom;
document       = jsdom('');
window         = document.createWindow();

require('./spec.js')