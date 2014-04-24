var React         = require('react')
var ReactDatalist = require('./react-datalist')

var box = React.createClass({
    render : function() {
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
                    options : this.state.options,
                    force   : this.props.force,
                    filter  : this.state.filter
                })
            ])
        )
    },
    getInitialState : function() {
        return {
            filter  : this.props.filter,
            options : this.props.options
        }
    },
    componentWillReceiveProps : function(newprops) {
        // TODO: Should this not be more restrictive? Only allow options and filter to change?
        this.setState(newprops)
    },
    handleChange : function(event) {
        this.setState({filter : event.target.value})
        if (typeof this.props.onChange === 'function') this.props.onChange(event)
    }
})

module.exports = box
    // select : function(option) {
    //     console.log('select called')
    //     this.state.input.value = option
    //     var evt = document.createEvent("HTMLEvents")
    //     evt.initEvent("change", false, true)
    //     this.state.input.dispatchEvent(evt)
    //     this.setState({
    //         filter        : option,
    //         selectedIndex : false
    //     })
    // },

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