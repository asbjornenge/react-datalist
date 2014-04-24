var dom      = require('../dom')('<html><body><input list="fruit" /><div id="container"></div></body></html>')
var assert   = require('assert')
var React    = require('react')
var nanodom  = require('nanodom')
var Datalist = require('../react-datalist')

var options   = ['apple','orange','pear','pineapple','melon']
var _datalist;
function render(options, callback) {
    _datalist = React.renderComponent(Datalist(options), nanodom('#container')[0], callback)
}

describe('DATALIST', function() {

    before(function(done) {
        render({options:options, id:'fruit', force:true}, function() {
            done()
        })
    })

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

    it('Should be able to position the options list', function() {
        var input = nanodom('input')[0]
        var pos = _datalist.findPos(input)
        assert(pos.length === 2)
        assert(typeof pos[0] === 'number')
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

    it('Supports labels', function() {
        // TODO
    })

/*

    test filters
    test click
    test arrow up/down
    test esc

*/

})