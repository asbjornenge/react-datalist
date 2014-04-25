var React         = require('react')
var ReactDatalist = require('./react-datalist')

var box = React.createClass({
    render : function() {
        // console.log(this.props.options)
        var options = this.filterOptions(this.props.options, this.state.filter, this.state.support)
        // console.log('after',options)
        return (
            React.DOM.div
            ({
                className : "react-datalist-container"
            },[
                React.DOM.input
                ({
                    className : "react-datalist-input",
                    list      : this.props.list,
                    value     : this.state.filter,
                    onChange  : this.handleChange,
                    onKeyDown : this.handleKeyDown
                }),
                ReactDatalist
                ({
                    id       : this.props.list,
                    force    : this.props.force,
                    support  : this.props.support,
                    hide     : this.state.hide,
                    filter   : this.state.filter,
                    selected : this.state.selected,
                    options  : options
                })
            ])
        )
    },
    getInitialState : function() {
        var support = !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement)
        if (this.props.force) support = false
        return {
            filter   : this.props.filter,
            hide     : this.props.hideOptions,
            selected : false,
            support  : support
        }
    },
    componentWillReceiveProps : function(_new) {
        this.setState({
            filter   : (typeof _new.filter === 'string')         ? _new.filter      : this.state.filter,
            selected : (typeof _new.selected !== 'undefined')    ? _new.selected    : this.state.selected,
            hide     : (typeof _new.hideOptions !== 'undefined') ? _new.hideOptions : this.state.hideOptions,
        })
    },
    handleChange : function(event) {
        this.setState({ filter  : event.target.value })
        if (typeof this.props.onChange === 'function') this.props.onChange(event)
    },
    handleKeyDown : function(event) {
        switch(event.which) {
            case 40:
                // DOWN Arrow
                var newSelectedIndex  = this.state.selected === false ? 0 : this.state.selected + 1
                var availableOptions  = this.filterOptions(this.props.options, this.state.filter, this.state.support)
                if (newSelectedIndex >= availableOptions.length) newSelectedIndex = availableOptions.length - 1
                this.setState({
                    selected : newSelectedIndex
                })
                break
            case 38:
                // UP arrow
                var newSelectedIndex = this.state.selected > 0 ? this.state.selected - 1 : 0
                this.setState({selected : newSelectedIndex})
                break
            case 27:
                // ESC
                this.setState({
                    selected : false,
                    hide     : true,
                    filter   : this.state.hide ? "" : this.state.filter
                })
                break
            case 13:
                // ENTER
                if (this.state.selected === false) return
                this.selectOption(this.state.selected)
                break
        }
        console.log('keydown event', event.type, event.which)
    },
    filterOptions : function(options, filter, support) {
        // console.log('** passed', options, filter, support)
        if (support)        return options
        if (!filter)        return options
        if (filter === '')  return options
        if (!options)       return []
        return options.filter(function(option) {
            return option.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        })
    },
    selectOption : function(index) {
        var selected_option = this.filterOptions(this.props.options, this.state.filter, this.state.support)[index]
        if (typeof this.props.onOptionSelected === 'function') this.props.onOptionSelected(selected_option)
        this.setState({
            filter : selected_option
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