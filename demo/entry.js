var React         = require('react')
var ReactDatalist = require('../react-datalist')

/** STYLE **/

require('../react-datalist.styl')
require('./demo.styl')

var options  = ['apple','orange','pear','pineapple','melon']

var NativeSwitch = React.createClass({
    render : function() {
        return (
            React.DOM.div({ className : 'onoffswitch', onClick : this.toggleNative }, [
                React.DOM.input({
                    type      : 'checkbox',
                    name      : 'onoffswitch',
                    className : 'onoffswitch-checkbox',
                    id        : 'myonoffswitch',
                    checked   : this.state.checked
                }),
                React.DOM.label({ className : 'onoffswitch-label' }, [
                    React.DOM.div({ className : 'onoffswitch-inner' }),
                    React.DOM.div({ className : 'onoffswitch-switch' })
                ])
            ])
        )
    },
    getInitialState : function() {
        return { checked : '' }
    },
    toggleNative : function(event) {
        this.props.onChange(this.state.checked == '' ? true : false)
        this.setState({ checked : this.state.checked == '' ? 'checked' : '' })
    }
})

var Demo = React.createClass({
    render : function() {
        return (
            React.DOM.div(null, [
                React.DOM.div({ className : 'switchbox' }, [
                    NativeSwitch({onChange:this.handleNativeRequest}),
                    React.DOM.span({ className : 'switchlabel' }, 'Try a native datalist.'),
                ]),
                React.DOM.h1({ className : 'mainlabel' }, 'Find your favorite fruit!'),
                ReactDatalist({options:options, list:'fruit', forcePoly:this.state.forcePoly, hideOptions:true})
            ])
        )
    },
    getInitialState : function() {
        return { forcePoly : true }
    },
    handleNativeRequest : function(native) {
        this.setState({ forcePoly : !native })
    }
})

// React.renderComponent(ReactDatalist({options:options, id:'fruit', force:true, hideOptions:true}), document.querySelectorAll('#container')[0], function() {
//     console.log('ready')
// })

React.renderComponent(Demo(), document.querySelectorAll('#container')[0])