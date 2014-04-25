var React = require('react')
var dom   = require('nanodom')

var DatalistOption = React.createClass({
    render : function() {
        var classes = this.props.selected ? ['react-datalist-option', 'react-datalist-option-selected'] : ['react-datalist-option']
        return (
            React.DOM.div
            ({
                className : classes.join(' '),
                onClick   : this.handleClick
            }, this.props.option)
        )
    },
    handleClick : function(e) {
        this.props.select(this.props.index)
    }
})

var Datalist = React.createClass({
    render : function() {
        var options  = this.props.options.map(function(option, index) {
            return this.props.support ? 
                        React.DOM.option
                        ({
                            value:option
                        }) : 
                        DatalistOption
                        ({
                            option   : option, 
                            index    : index,
                            selected : (this.props.selected === index),
                            select   : this.props.select
                        })
        }.bind(this))

        var containerStyle = {}
        if (!this.props.support) {
            if (this.props.hide) containerStyle.display = 'none'
            else if (this.props.options.length == 0) containerStyle.display = 'none'
            else if (this.props.options.length == 1 && this.props.options[0] == this.props.filter) containerStyle.display = 'none'
            else containerStyle.display = 'block'
            // containerStyle.top   = this.state.top   + 'px'
            // containerStyle.left  = this.state.left  + 'px'
            // containerStyle.width = (this.state.width - 2) + 'px'
        }
        var Node = this.props.support ? React.DOM.datalist : React.DOM.div

        return (
            Node
            ({
                id        : this.props.id,
                className : "react-datalist",
                style     : containerStyle
            }, options)
        )
    },
    getInitialState : function() {
        return {
            top           : 0,
            left          : 0,
            input         : null
        }
    },
    // componentDidMount : function() {
    //     if (this.props.support) return
    //     var input = dom('input[list="'+this.props.id+'"]')
    //     if (input.length == 0) { console.log('Unable to find related input element'); return }
    //     var input = input[0]

    //     /** POSITION **/

    //     // TODO :  MOVE THIS TO BOX ??

    //     var pos = this.findPos(input)
    //     this.setState({
    //         origFilter : input.value,
    //         filter     : input.value,
    //         top        : pos[0] + input.offsetHeight,
    //         left       : pos[1],
    //         width      : input.offsetWidth,
    //         input      : input
    //     })

    // },
    findPos : function(element) {
      if (element) {
        var parentPos = this.findPos(element.offsetParent);
        return [ parentPos[0] + element.offsetTop, parentPos[1] + element.offsetLeft]
      } else {
        return [0,0];
      }
    }
})

module.exports = Datalist