import React          from 'react'
import ReactDOM       from 'react-dom'
import DataList       from './components/DataList'
import DataListOption from './components/DataListOption'
import layout         from './styles/react-datalist.styl'

export default class ReactDataList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filter   : props.initialFilter || props.defaultValue || '',
            hide     : true,
            selected : false,
            support  : !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement)
        }
    }
    render() {
        var options      = this.filterOptions(this.props.options, this.state.filter, this.useNative())
        var extraClasses = this.props.className? ' ' + this.props.className: '';
        var layoutstyle  = (this.props.includeLayoutStyle) ? <style>{layout}</style> : null
        return (
            <div className="react-datalist-container">
                {layoutstyle}
                <input ref="theInput"
                        list={this.props.list}
                        value={this.state.filter}
                        className={"react-datalist-input"+extraClasses}
                        placeholder={this.props.placeholder}
                        onBlur={this.handleInputBlur.bind(this)}
                        onKeyUp={this.handleInputKeyUp.bind(this)}
                        onClick={this.handleInputClick.bind(this)}
                        onChange={this.handleInputChange.bind(this)}
                        onKeyDown={this.handleInputKeyDown.bind(this)}
                />
                <DataList ref="theDatalist"
                    id={this.props.list}
                    hide={this.state.hide}
                    filter={this.state.filter}
                    select={this.selectFilteredOption.bind(this)}
                    options={options}
                    selected={this.state.selected}
                    useNative={this.useNative()}
                />
            </div>
        )
    }
    handleInputBlur(event) {
        if (this.props.hideOptionsOnBlur) {
            setTimeout(function() {
                this.setState({ hide : true })
            }.bind(this),this.props.blurTimeout)
        }
        if (typeof this.props.onInputBlur === 'function') this.props.onInputBlur(event)
    }
    handleInputClick(event) {
        this.setState({ hide : false })
    }
    handleInputChange(event) {
        this.setState({ 
            filter   : event.target.value,
            selected : false,
            hide     : false
        })
        if (typeof this.props.onInputChange === 'function') this.props.onInputChange(event)
    }
    handleInputKeyDown(event) {
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
    }
    handleInputKeyUp(event) {
        if (!this.props.hideOptionsOnEsc) return
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
    }
    filterOptions(options, filter, support) {
        if (support)        return options
        if (!filter)        return options
        if (filter === '')  return options
        if (!options)       return []
        return options.filter(function(option) {
            return option.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        })
    }
    selectFilteredOption(index) {
        this.selectOption(this.filterOptions(this.props.options, this.state.filter, this.useNative())[index])
    }
    selectOption(value) {
        var selected_option;
        this.props.options.forEach(function(option, index) { if(option.toLowerCase() === value.toLowerCase()) selected_option = option })
        if (typeof selected_option === 'undefined') return
        if (typeof this.props.onOptionSelected === 'function') this.props.onOptionSelected(selected_option)
        this.setState({
            filter   : selected_option,
            selected : false,
            hide     : true
        })
    }
    useNative() {
        var _native = this.state.support
        if (this.props.forcePoly) _native = false
        return _native
    }
    componentWillMount() {
        if (typeof this.props.getController === 'function') {
            this.props.getController({
                setFilter     : function(value,callback) { this.setState({filter : value}, callback) }.bind(this),
                toggleOptions : function(callback)       { var hide = !this.state.hide; this.setState({filter : '', hide : hide}, function() { if (typeof callback === 'function') callback(!hide) }) }.bind(this),
                getState      : function()               { return {
                    hide     : this.state.hide,
                    filter   : this.state.filter,
                    selected : this.state.selected,
                    options  : this.filterOptions(this.props.options, this.state.filter, this.useNative())
                }}.bind(this),
                setState      : function(state,callback) { this.setState(state, callback) }.bind(this)
            })
        }
    }
    componentDidMount() {
        if (this.useNative()) return
        if (this.props.autoPosition === false) return

        /** POSITION **/

        setTimeout(function() {
            if (this.refs.theInput == undefined) return // <- Tests are too fast!
            if (this.refs.theDatalist == undefined) return // <- Tests are too fast!
            var _input    = ReactDOM.findDOMNode(this.refs.theInput)
            var _datalist = ReactDOM.findDOMNode(this.refs.theDatalist)
            var pos       = this.findPos(_input)

            _datalist.style.position = 'absolute'
            _datalist.style.top      = pos[0] + _input.offsetHeight
            _datalist.style.left     = pos[1]
            _datalist.style.width    = (_input.offsetWidth - 2) + 'px'            
        }.bind(this),50)

    }
    findPos(element) {
      if (element) {
        var parentPos = this.findPos(element.offsetParent);
        return [ parentPos[0] + element.offsetTop, parentPos[1] + element.offsetLeft]
      } else {
        return [0,0];
      }
    }
}
ReactDataList.defaultProps = {
    blurTimeout        : 200,
    includeLayoutStyle : true, 
    hideOptionsOnBlur  : true,
    hideOptionsOnEsc   : true
}

