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

    // before(function(done) {
    //     render({options:options, id:'fruit', force:true}, function() {
    //         done()
    //     })
    // })

    // it('Should be able to position the options list', function() {
    //     var input = nanodom('input')[0]
    //     var pos = _datalist.findPos(input)
    //     assert(pos.length === 2)
    //     assert(typeof pos[0] === 'number')
    // })


    // it('Supports labels', function() {
    //     // TODO
    // })

/*

    test filters
    test click
    test arrow up/down
    test esc

*/

})