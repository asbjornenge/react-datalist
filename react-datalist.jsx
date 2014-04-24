/** @jsx React.DOM */
var React = require('react')
var dom   = require('nanodom')

var datalistOption = React.createClass({
    render : function() {
        var classes = this.props.selected ? ['react-datalist-option', 'react-datalist-selected'] : ['react-datalist-option']
        return (
            <div className={classes.join(' ')} onClick={this.handleClick}>{this.props.option}</div>
        )
    },
    handleClick : function(e) {
        this.props.select(this.props.option)
    }
})

var datalist = React.createClass({
    render : function() {
        var filtered = this.state.supported ? this.props.options : this.filterOptions(this.props.options, this.props.filter)
        var options  = filtered.map(function(option, index) {
            return this.state.supported ? <option value={option} /> : <datalistOption option={option} selected={index === this.state.selectedIndex} select={this.select} />
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

        return this.state.supported ? (
            <datalist id={this.props.id} className="react-datalist">
                {options}
            </datalist>
        ) : (
            <div id={this.props.id} className="react-datalist" style={containerStyle}>
                {options}
            </div>
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
    select : function(option) {
        console.log('select called')
        this.state.input.value = option
        var evt = document.createEvent("HTMLEvents")
        evt.initEvent("change", false, true)
        this.state.input.dispatchEvent(evt)
        this.setState({
            filter        : option,
            selectedIndex : false
        })
    },
    componentDidMount : function() {
        if (this.state.supported) return
        var input = dom('input[list="'+this.props.id+'"]')
        if (input.length == 0) { console.log('Unable to find related input element'); return }
        var input = input[0]

        /** POSITION **/

        var pos = this.findPos(input)
        this.setState({
            origFilter : input.value,
            filter     : input.value,
            top        : pos[0] + input.offsetHeight,
            left       : pos[1],
            width      : input.offsetWidth,
            input      : input
        })

        /** BINDINGS **/

        // input.onkeyup = function(event) {
        //     switch(event.which) {
        //         case 40:
        //             // DOWN arrow
        //             var newSelectedIndex = this.state.selectedIndex === false ? 0 : this.state.selectedIndex + 1
        //             var availableOptions = filterOptions(this.props.options, this.state.filter)
        //             if (newSelectedIndex >= availableOptions.length) newSelectedIndex = availableOptions.length - 1
        //             this.setState({
        //                 selectedIndex : newSelectedIndex,
        //                 showOptions   : true
        //             })
        //             break
        //         case 38:
        //             // UP arrow
        //             var newSelectedIndex = this.state.selectedIndex > 0 ? this.state.selectedIndex - 1 : 0
        //             this.setState({selectedIndex : newSelectedIndex})
        //             break
        //         case 27:
        //             // ESC
        //             var post_esc_state = {
        //                 selectedIndex : false
        //             }
        //             if (this.state.hideOptions) {
        //                 input.value           = ""
        //                 post_esc_state.filter = ""
        //             }
        //             this.setState(post_esc_state)
        //             break
        //         case 13:
        //             // ENTER
        //             if (this.state.selectedIndex === false) return
        //             var selected_option = filterOptions(this.props.options, this.state.filter)[this.state.selectedIndex]
        //             this.select(selected_option)
        //             break
        //         default:
        //             if (event.target.value == this.state.filter) return
        //             this.setState({
        //                 filter        : event.target.value,
        //                 selectedIndex : false
        //             })
        //     }
        // }.bind(this)
        // input.onblur = function(event) {
        //     setTimeout(function() {
        //         this.setState({
        //             selectedIndex : false
        //         })
        //     }.bind(this),1000)
        // }.bind(this)
    },
    // componentWillUnmount: function() {
    //     window.removeEventListener("resize", this.updateDimensions);
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

module.exports = datalist