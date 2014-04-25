var React         = require('react')
var ReactDatalist = require('./react-datalist')

var box = React.createClass({
    render : function() {
        // console.log(this.props.options)
        var options = this.filterOptions(this.props.options, this.state.filter, this.state.support)
        // console.log(options)
        return (
            React.DOM.div
            ({
                className : "react-datalist-container"
            },[
                React.DOM.input
                ({
                    list      : this.props.list,
                    className : "react-datalist-input",
                    value     : this.state.filter,
                    onChange  : this.handleChange
                }),
                ReactDatalist
                ({
                    id      : this.props.list,
                    force   : this.props.force,
                    support : this.props.support,
                    hide    : this.props.hideOptions,
                    filter  : this.state.filter,
                    options : options
                })
            ])
        )
    },
    getInitialState : function() {
        var support = !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement)
        if (this.props.force) support = false
        return {
            filter  : this.props.filter,
            support : support
        }
    },
    componentWillReceiveProps : function(_new) {
        this.setState({
            filter  : _new.filter || this.state.filter,
        })
    },
    handleChange : function(event) {
        this.setState({ filter  : event.target.value })
        if (typeof this.props.onChange === 'function') this.props.onChange(event)
    },
    filterOptions : function(options, filter, support) {
        // console.log(options, filter, support)
        if (support)        return options
        if (filter == null) return options
        if (!options)       return []
        return options.filter(function(option) {
            return option.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        })
    }
})

module.exports = box

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