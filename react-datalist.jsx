/** @jsx React.DOM */
var React  = require('react')

var datalist = React.createClass({
    render : function() {
        var options = this.props.options.map(function(option) {
            return <option value={option} />
        })
        var nativedatalist = !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement);
        if (!nativedatalist) {

        }
        // if not native -> set up listeners?
        return (
            <datalist id={this.props.id}>
                {options}
            </datalist>
        )
    }
})

module.exports = datalist