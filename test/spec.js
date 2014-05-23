var dom           = require('./dom')('<html><body></body></html>')
var ReactDatalist = require('../react-datalist')
var assert        = require('assert')
var _             = require('lodash')
var React         = require('react')
var nanodom       = require('nanodom')
var ReactAddons   = require('react/addons')

var ReactTestUtils = React.addons.TestUtils

/** VARIABLES **/

var filterSetter;
var setFilter    = function(fn) { filterSetter = fn }
var options      = ['apple','orange','pear','pineapple','melon']
var defaultProps = {options:options, list:'fruit', forcePoly:true, setFilter:setFilter}

/** HELPER FUNCTIONS **/

function render(props, callback) {
    return React.renderComponent(ReactDatalist(_({}).merge(defaultProps).merge(props).__wrapped__), document.body, function() {
        if (typeof callback === 'function') setTimeout(callback)
    })
}
function setInputValue(datalist, value) {
     var __input   = nanodom('.react-datalist-input')[0]
     var _input    = ReactTestUtils.findRenderedDOMComponentWithTag(datalist, 'input')
     __input.value = value
    ReactTestUtils.Simulate.change(_input)
}
function clickOption(datalist, index) {
    var _options = ReactTestUtils.scryRenderedDOMComponentsWithClass(datalist, 'react-datalist-option')
    ReactTestUtils.Simulate.click(_options[index])
}

/** TESTS **/

describe('DATALIST', function() {

    afterEach(function(done) {
        React.unmountComponentAtNode(document.body)
        document.body.innerHTML = ""
        setTimeout(done)
    })

    it('Should render a container, an input and a datalist', function(done) {
        render({},function() {
            var __datalist = nanodom('.react-datalist')
            assert(__datalist.length == 1)
            var __container = nanodom('.react-datalist-container')
            assert(__container.length == 1)
            var __input = nanodom('.react-datalist-input')
            assert(__input.length == 1)
            done()            
        })
    })

    it('Should be able to filter options', function(done) {
        var _datalist = render({},function() {
            var filtered = _datalist.filterOptions(options, null)
            assert(filtered.length === options.length)
            filtered = _datalist.filterOptions(options)
            assert(filtered.length === options.length)
            filtered = _datalist.filterOptions(options, "p")
            assert(filtered.length === 3)
            filtered = _datalist.filterOptions(options, "lon")
            assert(filtered.length === 1)
            done()            
        })
    })

    it('Should support setting initial input value throught initialFilter property', function(done) {
        render({initialFilter : 'meh'}, function() {
            var __input = nanodom('.react-datalist-input')[0]
            assert(__input.value === 'meh')
            done()
        })
    })

    it('Should render a datalist with the passed options', function(done) {
        var _datalist = render({}, function() {
            setInputValue(_datalist, '')
            var domlist = nanodom('.react-datalist')
            assert(domlist.length == 1)
            assert(domlist[0].childNodes.length == options.length)
            assert(domlist[0].id == 'fruit')
            done()
        })
    })

    it('Filter options should change when the input value changes', function(done) {
        var _datalist = render({}, function() {
            var __datalist = nanodom('.react-datalist')[0]
            setInputValue(_datalist, '')
            assert(__datalist.childNodes.length == options.length)
            setInputValue(_datalist, 'melon')
            assert(__datalist.childNodes.length == 1)
            done()
        })
    })

    it('Should call its callback', function(done) {
        var onInputChange = function(event) {
            assert(true)
            done()
        }
        var _datalist = render({ onInputChange : onInputChange }, function() {
            setInputValue(_datalist, 'p')
        })
    })

    it('Can navigate options with arrow keys', function(done) {
        var _datalist = render({}, function() {
            setInputValue(_datalist, '')
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
            done()
        })
    })

    it('Can select an option by hitting enter', function(done) {
        var onOptionSelected = function(option) {
            assert(option == options[0])
            done()
        }
        var _datalist = render({ onOptionSelected : onOptionSelected }, function() {
            setInputValue(_datalist, '')
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
        var _datalist = render({}, function() {
            setInputValue(_datalist, 'p')
            var __datalist, __input, _input;
            _input     = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
            ReactTestUtils.Simulate.change(_input)
            __datalist = nanodom('.react-datalist')[0]
            assert(__datalist.childNodes.length == 3)
            // ESC to hide the options
            ReactTestUtils.Simulate.keyUp(_input, {which: 27, type: "keyup"})
            __datalist = nanodom('.react-datalist')[0]
            __input    = nanodom('.react-datalist-input')[0]
            assert(__datalist.style.display === 'none')
            assert(__input.value === 'p')
            // ESC again to clear filter
            ReactTestUtils.Simulate.keyUp(_input, {which: 27, type: "keyup"})
            __datalist = nanodom('.react-datalist')[0]
            __input    = nanodom('.react-datalist-input')[0]
            assert(__datalist.style.display === 'none')
            assert(__input.value === '')
            done()
        })
    })

    it('Will select an option if you click it', function(done) {
        var onOptionSelected = function(option) {
            assert(option == options[3])
            done()
        }
        var _datalist = render({filter:'', onOptionSelected:onOptionSelected}, function() {
            clickOption(_datalist, 3)
        })
    })

    it('Will releveal the available options if the input field is clicked', function(done) {
        var _datalist = render({}, function() {
            clickOption(_datalist, 0)
            var domlist = nanodom('.react-datalist')[0]
            assert(domlist.style.display === 'none')
            var _input = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
            ReactTestUtils.Simulate.click(_input)
            var domlist = nanodom('.react-datalist')[0]
            assert(domlist.style.display === 'block')
            done()
        })
    })

    it('Will hide the options on input blur', function(done) {
        var _datalist = render({}, function() {
            setInputValue(_datalist, 'melon')
            var domlist = nanodom('.react-datalist')[0]
            assert(domlist.childNodes.length == 1)
            assert(domlist.style.display === 'block')
            var _input = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
            ReactTestUtils.Simulate.blur(_input)
            // The options hang for 10ms so that click works properly
            setTimeout(function() {
                var domlist = nanodom('.react-datalist')[0]
                assert(domlist.childNodes.length == 1)
                assert(domlist.style.display === 'none')
                done()
            },120)            
        })
    })

    it('Will expose the input blur event', function(done) {
        var blur = function(event) {
            assert(true)
            // Need to account for the timeout that in turn calles setState
            // if we don't it will try to setState on an unmounted component
            // and the test will crash.
            setTimeout(function() {
                done()
            }, 120)
        }
        var _datalist = render({ onInputBlur : blur }, function() {
            var _input = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
            ReactTestUtils.Simulate.blur(_input)
        })
    })

    it('Can autoposition itself', function(done) {
        var _datalist = render({}, function() {
            setInputValue(_datalist, 'p')
            setTimeout(function() {
                var domlist  = nanodom('.react-datalist')[0]
                var style    = window.getComputedStyle(domlist)
                var position = style.getPropertyValue('position')
                assert(position == 'absolute')
                done()
            }, 100)
        })
    })


    it('Can take a placeholder property for the input', function(done) {
        render({ placeholder : 'Choose project' }, function() {
            var __input = nanodom('.react-datalist-input')[0]
            assert(__input.attributes.placeholder.value === 'Choose project')
            done()            
        })
    })

    it('Has facitilies for controlling the input state externally', function(done) {
        render({}, function() {
            var __input = nanodom('.react-datalist-input')[0]
            assert(__input.value != 'poop')
            filterSetter('poop')
            assert(__input.value == 'poop')
            done()
        })
    })

})