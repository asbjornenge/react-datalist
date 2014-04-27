var React         = require('react')
var ReactDatalist = require('../react-datalist')
var fruit         = require('./fruit')

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

var MessageBox = React.createClass({
    render : function() {
        var info, error;
        if (this.props.info  != '') info  = React.DOM.div({className:'info-message'},  this.props.info)
        if (this.props.error != '') error = React.DOM.div({className:'error-message'}, this.props.error)
        return (
            React.DOM.div({
                className : 'message-box'
            },[
                info,
                error
            ])
        )
    }
})

var Demo = React.createClass({
    render : function() {
        var infoMessage, errorMessage;
        if (this.state.selectedOption) infoMessage = 'You choose ' + this.state.selectedOption + '. Good job!'
        if (!this.state.support && !this.state.forcePoly) errorMessage = 'Your browser does not support the native datalist :-( No worries, react-datalist got your back.'
        return (
            React.DOM.div(null, [
                NativeSwitch({onChange:this.handleNativeRequest}),
                React.DOM.h1({ className : 'main-label' }, 'Find your favorite fruit!'),
                ReactDatalist({
                    options          : fruit,
                    list             : 'fruit',
                    forcePoly        : this.state.forcePoly,
                    onOptionSelected : this.onOptionSelected
                }),
                MessageBox({ info : infoMessage, error : errorMessage })
            ])
        )
    },
    getInitialState : function() {
        return { 
            forcePoly      : true,
            selectedOption : '',
            support        : !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement)
        }
    },
    handleNativeRequest : function(native) {
        this.setState({ 
            forcePoly : !native,
            filter    : ''
        })
    },
    onOptionSelected : function(option) {
        this.setState({ 
            selectedOption : option
        })
        clearTimeout(this.optionSelectedTimeout)
        this.optionSelectedTimeout = setTimeout(function() {
            this.setState({selectedOption : ''})
        }.bind(this), 3000)
    }
})

React.renderComponent(Demo(), document.querySelectorAll('#container')[0])