import React         from 'react'
import ReactDataList from './datalist'
import style         from './demo.styl'
import fruit         from './fruit'

var options  = ['apple','orange','pear','pineapple','melon']

class NativeSwitch extends React.Component {
    render() {
        return (
            <div className="onoffswitch" onClick={this.toggleNative.bind(this)}>
                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" />
                <label className="">
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
            </div>
        )
    }
    getInitialState() {
        return { checked : '' }
    }
    toggleNative(event) {
        this.props.onChange(this.state.checked == '' ? true : false)
        this.setState({ checked : this.state.checked == '' ? 'checked' : '' })
    }
}

var MessageBox = React.createClass({
    render : function() {
        var selectedOption, error, info_img;
        if (this.props.selectedOption != undefined) {
            selectedOption = React.DOM.div
            ({
                className:'info-message'
            }, 
            [
                React.DOM.span({className:'intro'}, 'Your favorite is...'), 
                React.DOM.span({className:'choice'}, this.props.selectedOption),
                React.DOM.img({src:'http://gifs.joelglovier.com/excited/thumbs-up.gif'}),
                React.DOM.span({className:'advice'}, 'Good choice!')
            ])
        }
        if (this.props.error != undefined) error = React.DOM.div({className:'error-message'}, this.props.error)
        return (
            React.DOM.div({
                className : 'message-box'
            },[
                selectedOption,
                error
            ])
        )
    }
})

var Demo = React.createClass({
    render : function() {
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
                MessageBox({
                    selectedOption : this.state.selectedOption, 
                    conflicted     : !this.state.support && !this.state.forcePoly
                })
            ])
        )
    },
    getInitialState : function() {
        return { 
            forcePoly      : true,
            support        : !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement)
        }
    },
    handleNativeRequest : function(native) {
        this.setState({ 
            forcePoly      : !native,
            filter         : '',
            selectedOption : undefined
        })
    },
    onOptionSelected : function(option) {
        this.setState({ 
            selectedOption : option
        })
    }
})

React.renderComponent(Demo(), document.querySelectorAll('#container')[0])
