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
        this.props.select(this.props.option)
    }
})

var Datalist = React.createClass({
    render : function() {
        var filtered = this.state.supported ? this.props.options : this.filterOptions(this.props.options, this.props.filter)
        var options  = filtered.map(function(option, index) {
            return this.state.supported ? React.DOM.option({value:option}) : DatalistOption({option:option})
        }.bind(this))

        var containerStyle = {}
        if (!this.state.supported) {
            if (this.props.hide) containerStyle.display = 'none'
            else if (filtered.length == 0) containerStyle.display = 'none'
            else if (filtered.length == 1 && filtered[0] == this.props.filter) containerStyle.display = 'none'
            else containerStyle.display = 'block'
            containerStyle.top   = this.state.top   + 'px'
            containerStyle.left  = this.state.left  + 'px'
            containerStyle.width = (this.state.width - 2) + 'px'
        }
        var Node = this.state.supported ? React.DOM.datalist : React.DOM.div

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
        var support = !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement)
        if (this.props.force) support = false
        return {
            supported     : support,
            top           : 0,
            left          : 0,
            selectedIndex : false,
            input         : null
        }
    },
    // componentDidMount : function() {
    //     if (this.state.supported) return
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
    filterOptions : function(options, filter) {
        if (filter == null) return options
        return options.filter(function(option) {
            return option.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        })
    },
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