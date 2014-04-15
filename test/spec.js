require('node-jsx').install({extension: '.jsx'})
var assert   = require('assert')
var React    = require('react')
var dom      = require('nanodom')
var datalist = require('../react-datalist.jsx')

var options   = ['apples','oranges','pears','melons']
var container = dom('<div id="container"></div>')
var input     = dom('<input list="fruit" />')
dom('body').append(input)
dom('body').append(container)

describe('TAGUHB HEADER', function() {

    it('Should render a datalist with the passed options', function(done) {
        React.renderComponent(datalist({options:options, list_id:'fruit'}), container[0], function() {
            var domlist = dom('.react-datalist')
            assert(domlist.length == 1)
            assert(domlist[0].childNodes.length == options.length)
            assert(domlist[0].id == 'fruit')
            done()
        })
    })

})