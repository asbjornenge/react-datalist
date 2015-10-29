import React         from 'react'
import ReactDOM      from 'react-dom'
import ReactDataList from '../lib/ReactDataList'
import fruit         from './fruit'

var options  = ['apple','orange','pear','pineapple','melon']

class NativeSwitch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked : ''
        }
    }
    render() {
        return (
            <div className="onoffswitch" onClick={this.toggleNative.bind(this)}>
                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked={this.state.checked} />
                <label className="onoffswitch-label">
                    <div className="onoffswitch-inner"></div>
                    <div className="onoffswitch-switch"></div>
                </label>
            </div>
        )
    }
    toggleNative(event) {
        this.props.onChange(this.state.checked == '' ? true : false)
        this.setState({ checked : this.state.checked == '' ? 'checked' : '' })
    }
}

class MessageBox extends React.Component {
    render() {
        var selectedOption, error, info_img;
        if (this.props.selectedOption != undefined) {
            selectedOption = (
                <div className="info-message">
                    <span className="intro">Your favorite is...</span>
                    <span className="choice">{this.props.selectedOption}</span>
                    <img src="http://gifs.joelglovier.com/thumbs-up/thumbs-up.gif" />
                    <span className="advice">Good choice!</span>
                </div>
            )
        }
        if (this.props.error != undefined) error = <div className="error-message">{this.props.error}</div>
        return (
            <div className="message-box">
                {selectedOption}
                {error}
            </div>
        )
    }
}

class Demo extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            forcePoly : true,
            support   : !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement)
        }
    }
    render() {
        if (!this.state.support && !this.state.forcePoly) errorMessage = 'Your browser does not support the native datalist :-( No worries, react-datalist got your back.'
        return (
            <div>
                <NativeSwitch onChange={this.handleNativeRequest.bind(this)} />
                <h1 className="main-label">Find your favorite fruit!</h1>
                <ReactDataList 
                    list="fruit" 
                    options={fruit} 
                    forcePoly={this.state.forcePoly} 
                    onOptionSelected={this.onOptionSelected.bind(this)} />
                <MessageBox 
                    selectedOption={this.state.selectedOption} 
                    conflicted={!this.state.support && !this.state.forcePoly} />
            </div>
        )
    }
    handleNativeRequest(native) {
        this.setState({ 
            forcePoly      : !native,
            filter         : '',
            selectedOption : undefined
        })
    }
    onOptionSelected(option) {
        this.setState({ 
            selectedOption : option
        })
    }
}

ReactDOM.render(<Demo />, document.querySelectorAll('#container')[0])
