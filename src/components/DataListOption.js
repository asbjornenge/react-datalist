import React from 'react'

export default class DatalistOption extends React.Component {
    render() {
        var classes = 'react-datalist-option'
        if (this.props.selected) classes += ' react-datalist-option-selected'
        if (this.props.useNative) return (
            <option value={this.props.option} />
        )
        return (
            <div className={classes} onClick={this.handleClick.bind(this)}>{this.props.option}</div>
        )
    }
    handleClick(e) {
        this.props.select(this.props.index)
    }
}
