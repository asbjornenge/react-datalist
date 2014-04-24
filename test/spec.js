require('node-jsx').install({extension: '.jsx'})
var dom      = require('../dom')()
var assert   = require('assert')
var React    = require('react')
var nanodom  = require('nanodom')
var datalist = require('../react-datalist.jsx')

var options   = ['apple','orange','pear','pineapple','melon']
var container = nanodom('<div id="container"></div>')
var input     = nanodom('<input list="fruit" />')
nanodom('body')[0].innerHTML=""
nanodom('body').append(input)
nanodom('body').append(container)
var _datalist;
function render(options, callback) {
    _datalist = React.renderComponent(datalist(options), container[0], callback)
}
render({options:options, id:'fruit', force:true})

describe('TAGUHB HEADER', function() {

    it('Should be able to filter options', function() {
        var filtered = _datalist.filterOptions(options, null)
        assert(filtered.length === options.length)
        filtered = _datalist.filterOptions(options)
        assert(filtered.length === options.length)
        filtered = _datalist.filterOptions(options, "p")
        assert(filtered.length === 3)
        filtered = _datalist.filterOptions(options, "lon")
        assert(filtered.length === 1)
    })

    it('Should render a datalist with the passed options', function(done) {
        render({options:options, id:'fruit', force:true}, function() {
            var domlist = nanodom('.react-datalist')
            assert(domlist.length == 1)
            assert(domlist[0].childNodes.length == options.length)
            assert(domlist[0].id == 'fruit')
            assert(domlist[0].style._values.display === 'block')
            done()
        })
    })

    it('Should filter options based on filter prop', function(done) {
        render({options:options, id:'fruit', force:true, filter:'p'}, function() {
            var domlist = nanodom('.react-datalist')[0]
            assert(domlist.childNodes.length == 3)
            assert(domlist.id == 'fruit')
            assert(domlist.style._values.display === 'block')
            done()
        })
    })

    it('Filter matching option should hide the options', function(done) {
        render({options:options, id:'fruit', force:true, filter:'melon'}, function() {
            var domlist = nanodom('.react-datalist')[0]
            assert(domlist.childNodes.length == 1)
            assert(domlist.style._values.display === 'none')
            done()
        })
    })

    it('Passing hide should hide options no matter what', function(done) {
        render({options:options, id:'fruit', force:true, hide:true}, function() {
            var domlist = nanodom('.react-datalist')[0]
            assert(domlist.childNodes.length == options.length)
            assert(domlist.style._values.display === 'none')
            done()
        })
    })

/*

    test filters
    test click
    test arrow up/down
    test esc

*/

})