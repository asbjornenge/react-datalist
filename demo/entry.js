var React    = require('react')
var datalist = require('../react-datalist-box')

var options  = ['apple','orange','pear','pineapple','melon']

React.renderComponent(datalist({options:options, id:'fruit', force:true}), document.querySelectorAll('#container')[0], function() {

    var _input = document.querySelectorAll('input')[0]
    _input.value = "kanin"
    var evt    = document.createEvent("HTMLEvents")
    evt.initEvent("change", false, true)
    _input.dispatchEvent(evt)

})