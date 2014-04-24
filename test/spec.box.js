var dom            = require('../dom')('<html><body><div id="container"></div></body></html>')
var assert         = require('assert')
var React          = require('react')
var nanodom        = require('nanodom')
var datalist       = require('../react-datalist-box')
var ReactAddons    = require('react/addons')

var ReactTestUtils = React.addons.TestUtils

var options   = ['apple','orange','pear','pineapple','melon']
var _datalist;
function render(options, callback) {
    _datalist = React.renderComponent(datalist(options), nanodom('#container')[0], callback)
}

describe('DATALIST BOX', function() {

    before(function(done) {
        render({options:options, list:'fruit', force:true}, function() {
            done()
        })
    })

    it('Should render a container, an input and a datalist', function(done) {
        var __datalist = nanodom('.react-datalist')
        assert(__datalist.length == 1)
        var __container = nanodom('.react-datalist-container')
        assert(__container.length == 1)
        var __input = nanodom('.react-datalist-input')
        assert(__input.length == 1)
        done()
    })

    it('Should filter options should change when the input value changes', function(done) {
        render({filter:'p'}, function() {
            var __datalist = nanodom('.react-datalist')[0]
            var __input    = nanodom('.react-datalist-input')[0]
            var _input     = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
            assert(__datalist.childNodes.length == 3)
            __input.value = "melon"
            ReactTestUtils.Simulate.change(_input)
            assert(__datalist.childNodes.length == 1)
            done()
        })
    })

    it('Should call its callback', function(done) {
        var onChange = function(event) {
            assert(true)
            done()
        }
        render({onChange:onChange}, function() {
            var _input = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
            ReactTestUtils.Simulate.change(_input)
        })
    })

/*
    test filters
    test click
    test arrow up/down
    test esc
    test trigger onChange etc. callbacks for box too
*/

})