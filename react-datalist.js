var React = require('react')

/** OPTION **/

var ReactDatalistOption = React.createClass({
    render : function() {
        var classes = this.props.selected ? ['react-datalist-option', 'react-datalist-option-selected'] : ['react-datalist-option']
        return this.props.useNative ? (
            React.DOM.option
            ({ 
                value : this.props.option 
            })
        ) : (
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

/** DATALIST **/

var ReactDatalist = React.createClass({
    render : function() {
        var options = this.props.options.map(function(option, index) {
            return ReactDatalistOption({
                option    : option, 
                index     : index,
                useNative : this.props.useNative,
                selected  : (this.props.selected === index),
                select    : this.props.select
            })
        }.bind(this))
        var containerStyle = {}
        if (!this.props.useNative) {
            if (this.props.hide) containerStyle.display = 'none'
            else if (this.props.options.length == 0) containerStyle.display = 'none'
            else containerStyle.display = 'block'
        }
        return this.props.useNative ? (
            React.DOM.datalist
            ({
                id        : this.props.id,
                className : "react-datalist"
            }, options)
        ) : (
            React.DOM.div({
                id        : this.props.id,
                className : "react-datalist",
                style     : containerStyle
            }, options)
        )
    }
})

/** STATEHOLDER **/

var container = React.createClass({
    render : function() {
        var options = this.filterOptions(this.props.options, this.state.filter, this.useNative())
        return (
            React.DOM.div
            ({
                className : "react-datalist-container"
            },[
                React.DOM.input
                ({
                    ref         : "theInput",
                    className   : "react-datalist-input",
                    list        : this.props.list,
                    placeholder : this.props.placeholder,
                    value       : this.state.filter,
                    onBlur      : this.handleInputBlur,
                    onClick     : this.handleInputClick,
                    onChange    : this.handleInputChange,
                    onKeyDown   : this.handleInputKeyDown,
                    onKeyUp     : this.handleInputKeyUp,
                    onInput     : this.handleInputInput
                }),
                ReactDatalist
                ({
                    ref       : "theDatalist",
                    id        : this.props.list,
                    hide      : this.state.hide,
                    filter    : this.state.filter,
                    selected  : this.state.selected,
                    select    : this.selectFilteredOption,
                    useNative : this.useNative(),
                    options   : options
                })
            ])
        )
    },
    getInitialState : function() {
        return {
            filter   : this.props.initialFilter || '',
            hide     : true,
            selected : false,
            support  : !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement)
        }
    },
    handleInputBlur : function(event) {
        setTimeout(function() {
            this.setState({ hide : true })
        }.bind(this),100)
        if (typeof this.props.onInputBlur === 'function') this.props.onInputBlur(event)
    },
    handleInputClick : function(event) {
        this.setState({ hide : false })
    },
    handleInputChange : function(event) {
        this.setState({ 
            filter   : event.target.value,
            selected : false,
            hide     : false
        })
        if (typeof this.props.onInputChange === 'function') this.props.onInputChange(event)
    },
    handleInputKeyDown : function(event) {
        switch(event.which) {
            case 40:
                // DOWN Arrow
                var newSelectedIndex  = this.state.selected === false ? 0 : this.state.selected + 1
                var availableOptions  = this.filterOptions(this.props.options, this.state.filter, this.useNative())
                if (newSelectedIndex >= availableOptions.length) newSelectedIndex = availableOptions.length - 1
                this.setState({
                    selected : newSelectedIndex,
                    hide     : false
                })
                break
            case 38:
                // UP arrow
                var newSelectedIndex = this.state.selected > 0 ? this.state.selected - 1 : 0
                this.setState({selected : newSelectedIndex})
                break
            case 13:
                // ENTER
                if (typeof this.state.selected === 'number') { this.selectFilteredOption(this.state.selected) }
                else { this.selectOption(event.target.value) }
                break
        }
    },
    handleInputKeyUp : function(event) {
        switch(event.which) {
            case 27:
                // ESC
                this.setState({
                    selected : false,
                    hide     : true,
                    filter   : this.state.hide ? "" : this.state.filter
                })
                break
        }
    },
    filterOptions : function(options, filter, support) {
        if (support)        return options
        if (!filter)        return options
        if (filter === '')  return options
        if (!options)       return []
        return options.filter(function(option) {
            return option.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        })
    },
    selectFilteredOption : function(index) {
        this.selectOption(this.filterOptions(this.props.options, this.state.filter, this.useNative())[index])
    },
    selectOption : function(value) {
        var selected_option;
        this.props.options.forEach(function(option, index) { if(option.toLowerCase() === value.toLowerCase()) selected_option = option })
        if (typeof selected_option === 'undefined') return
        if (typeof this.props.onOptionSelected === 'function') this.props.onOptionSelected(selected_option)
        this.setState({
            filter   : selected_option,
            selected : false,
            hide     : true
        })
    },
    useNative : function() {
        var _native = this.state.support
        if (this.props.forcePoly) _native = false
        return _native
    },
    componentDidMount : function() {
        if (this.useNative()) return
        if (this.props.autoPosition === false) return

        /** POSITION **/

        setTimeout(function() {
            if (this.refs.theInput == undefined) return // <- Tests are too fast!
            var _input    = this.refs.theInput.getDOMNode()
            var _datalist = this.refs.theDatalist.getDOMNode()
            var pos       = this.findPos(_input)

            _datalist.style.position = 'absolute'
            _datalist.style.top      = pos[0] + _input.offsetHeight
            _datalist.style.left     = pos[1]
            _datalist.style.width    = (_input.offsetWidth - 2) + 'px'            
        }.bind(this),50)

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

module.exports = container
