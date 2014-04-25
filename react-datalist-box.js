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
                    onClick   : this.handleInputClick,
                    onChange  : this.handleInputChange,
                    onKeyDown : this.handleInputKeyDown
                }),
                ReactDatalist
                ({
                    id       : this.props.list,
                    force    : this.props.force,
                    support  : this.props.support,
                    hide     : this.state.hide,
                    filter   : this.state.filter,
                    selected : this.state.selected,
                    select   : this.selectOption,
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
    handleInputClick : function(event) {
        this.setState({ hide : false })
    },
    handleInputChange : function(event) {
        this.setState({ filter  : event.target.value })
        if (typeof this.props.onChange === 'function') this.props.onChange(event)
    },
    handleInputKeyDown : function(event) {
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
        // console.log('keydown event', event.type, event.which)
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
