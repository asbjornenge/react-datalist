var dom            = require('../dom')('<html><body><div id="container"></div></body></html>')
var assert         = require('assert')
var React          = require('react')
var nanodom        = require('nanodom')
var datalist       = require('../react-datalist')
var ReactAddons    = require('react/addons')

var ReactTestUtils = React.addons.TestUtils

/** VARIABLES **/

var filterSetter;
var setFilter      = function(fn) { filterSetter = fn }
var options        = ['apple','orange','pear','pineapple','melon']
var defaultOptions = {options:options, list:'fruit', forcePoly:true, setFilter:setFilter}
var _datalist;

/** HELPER FUNCTIONS **/

function render(options, callback) {
    _datalist = React.renderComponent(datalist(options), nanodom('#container')[0], callback)
}
function merge(obj1, obj2) {
    var obj3 = {}
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname] }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname] }
    return obj3
}
function setInputValue(value) {
     var __input   = nanodom('.react-datalist-input')[0]
     var _input    = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
     __input.value = value
    ReactTestUtils.Simulate.change(_input)
}
function clickOption(index) {
    var _options = ReactTestUtils.scryRenderedDOMComponentsWithClass(_datalist, 'react-datalist-option')
    ReactTestUtils.Simulate.click(_options[index])
}

/** TESTS **/

describe('DATALIST', function() {

    before(function(done) {
        render(merge(defaultOptions, {initialFilter:'meh', placeholder:'Choose project'}), function() {
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

    it('Should support setting initial input value throught initialFilter property', function() {
        var __input = nanodom('.react-datalist-input')[0]
        assert(__input.value === 'meh')
    })

    it('Should render a datalist with the passed options', function() {
        setInputValue('')
        var domlist = nanodom('.react-datalist')
        assert(domlist.length == 1)
        assert(domlist[0].childNodes.length == options.length)
        assert(domlist[0].id == 'fruit')
    })

    it('Filter options should change when the input value changes', function() {
        var __datalist = nanodom('.react-datalist')[0]
        setInputValue('')
        assert(__datalist.childNodes.length == options.length)
        setInputValue('melon')
        assert(__datalist.childNodes.length == 1)
    })

    it('Should call its callback', function(done) {
        var onInputChange = function(event) {
            assert(true)
            // Additional render here to reset options
            render(defaultOptions, function() {
                done()
            })
        }
        var opts = merge(defaultOptions, {onInputChange:onInputChange})
        render(opts, function() {
            setInputValue('p')
        })
    })

    it('Can navigate options with arrow keys', function() {
        setInputValue('')
        var __datalist = nanodom('.react-datalist')[0]
        var __input    = nanodom('.react-datalist-input')[0]
        var _input     = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
        assert(__datalist.childNodes.length == options.length)
        // Down to first item
        ReactTestUtils.Simulate.keyDown(_input, {which: 40, type: "keydown"})
        var __option = nanodom('.react-datalist-option-selected')
        assert(__option.length == 1)
        assert(__option[0].innerHTML == options[0])
        // Down to second item
        ReactTestUtils.Simulate.keyDown(_input, {which: 40, type: "keydown"})
        var __option = nanodom('.react-datalist-option-selected')
        assert(__option.length == 1)
        assert(__option[0].innerHTML == options[1])
        // Up to first item
        ReactTestUtils.Simulate.keyDown(_input, {which: 38, type: "keydown"})
        var __option = nanodom('.react-datalist-option-selected')
        assert(__option.length == 1)
        assert(__option[0].innerHTML == options[0])
    })

    it('Can select an option by hitting enter', function(done) {
        var onOptionSelected = function(option) {
            assert(option == options[0])
            render(defaultOptions, function() {
                done()
            })
        }
        var opts = merge(defaultOptions, {onOptionSelected:onOptionSelected})
        render(opts, function() {
            setInputValue('')
            var __datalist = nanodom('.react-datalist')[0]
            var __input    = nanodom('.react-datalist-input')[0]
            var _input     = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
            assert(__datalist.childNodes.length == options.length)
            // Down to an item
            ReactTestUtils.Simulate.keyDown(_input, {which: 40, type: "keydown"})
            var __option = nanodom('.react-datalist-option-selected')
            assert(__option.length == 1)
            // Enter to select it
            ReactTestUtils.Simulate.keyDown(_input, {which: 13, type: "keydown"})
        })
    })

    it('Can hide the options by pressing ESC', function(done) {
        setInputValue('p')
        var __datalist, __input, _input;
        _input     = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
        ReactTestUtils.Simulate.change(_input)
        __datalist = nanodom('.react-datalist')[0]
        assert(__datalist.childNodes.length == 3)
        // ESC to hide the options
        ReactTestUtils.Simulate.keyUp(_input, {which: 27, type: "keyup"})
        __datalist = nanodom('.react-datalist')[0]
        __input    = nanodom('.react-datalist-input')[0]
        assert(__datalist.style._values.display === 'none')
        assert(__input.value === 'p')
        // ESC again to clear filter
        ReactTestUtils.Simulate.keyUp(_input, {which: 27, type: "keyup"})
        __datalist = nanodom('.react-datalist')[0]
        __input    = nanodom('.react-datalist-input')[0]
        assert(__datalist.style._values.display === 'none')
        assert(__input.value === '')
        done()
    })

    it('Will select an option if you click it', function(done) {
        var onOptionSelected = function(option) {
            assert(option == options[3])
            render(defaultOptions, function() {
                done()
            })
        }
        var opts = merge(defaultOptions, {filter:'', onOptionSelected:onOptionSelected})
        render(opts, function() {
            clickOption(3)
        })
    })

    it('Will releveal the available options if the input field is clicked', function() {
        clickOption(0)
        var domlist = nanodom('.react-datalist')[0]
        assert(domlist.style._values.display === 'none')
        var _input = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
        ReactTestUtils.Simulate.click(_input)
        var domlist = nanodom('.react-datalist')[0]
        assert(domlist.style._values.display === 'block')
    })

    it('Will hide the options on input blur', function(done) {
        setInputValue('melon')
        var domlist = nanodom('.react-datalist')[0]
        assert(domlist.childNodes.length == 1)
        assert(domlist.style._values.display === 'block')
        var _input = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
        ReactTestUtils.Simulate.blur(_input)
        // The options hang for 10ms so that click works properly
        setTimeout(function() {
            var domlist = nanodom('.react-datalist')[0]
            assert(domlist.childNodes.length == 1)
            assert(domlist.style._values.display === 'none')
            done()
        },120)
    })

    it('Will expose the input blur event', function(done) {
        var blur = function(event) {
            assert(true)
            render(defaultOptions, function() {
                done()
            })
        }
        var opts = merge(defaultOptions, { onInputBlur : blur })
        render(opts, function() {
            var _input = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
            ReactTestUtils.Simulate.blur(_input)
        })
    })

    it('Can autoposition itself', function() {
        setInputValue('p')
        var domlist  = nanodom('.react-datalist')[0]
        var style    = window.getComputedStyle(domlist)
        var position = style.getPropertyValue('position')
        assert(position == 'absolute')
    })


    it('Can take a placeholder property for the input', function() {
        var __input = nanodom('.react-datalist-input')[0]
        assert(__input.attributes.placeholder.value === 'Choose project')
    })

    it('Has facitilies for controlling the input state externally', function() {
        var __input = nanodom('.react-datalist-input')[0]
        assert(__input.value != 'poop')
        filterSetter('poop')
        assert(__input.value == 'poop')
    })

})