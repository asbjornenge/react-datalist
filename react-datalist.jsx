/** @jsx React.DOM */
var React = require('react')
var dom   = require('nanodom')

function filterOptions(options, filter) {
    return options.filter(function(option) {
        return option.toLowerCase().indexOf(filter.toLowerCase()) >= 0
    })
}
function findPos(element) {
  if (element) {
    var parentPos = findPos(element.offsetParent);
    return [ parentPos[0] + element.offsetTop, parentPos[1] + element.offsetLeft]
  } else {
    return [0,0];
  }
}

var containerStyle = {
    position : 'absolute',
    top      : 0,
    left     : 0,
    border   : '1px solid red'
}
var optionStyle = {
    display : 'block',
    width   : '100%'
}

var datalist = React.createClass({
    render : function() {
        var filtered = this.state.supported ? this.props.options : filterOptions(this.props.options, this.state.value)
        var options  = filtered.map(function(option) {
            return this.state.supported ? <option value={option} /> : <div className="react-datalist-option" style={optionStyle}>{option}</div>
        }.bind(this))

        // if (!this.state.supported) {
        // }

        return this.state.supported ? (

            <datalist id={this.props.id}>
                {options}
            </datalist>

        ) : (

            <div id={this.props.id} className="react-datalist" style={containerStyle}>
                {options}
            </div>

        )
    },
    getInitialState : function() {
        return {
            suggestions : [],
            supported   : !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement),
            value       : ""
        }
    },
    componentDidMount : function() {
        if (this.state.supported) return
        var input = dom('input[list="'+this.props.id+'"]')
        if (input.length == 0) { console.log('Unable to find related input element'); return }

        /** POSITION **/

        var pos = findPos(input[0])
        containerStyle.top  = pos[0]
        containerStyle.left = pos[1]
        this.setState({
            value    : input[0].value
        })

        /** BINDINGS **/

        input[0].onkeyup = function(event) {
            // Only if diff ?
            this.setState({value : event.target.value})
        }.bind(this)
    }
})

module.exports = datalist