import React          from 'react'
import DataListOption from './DataListOption'

export default class DataList extends React.Component {
    render() {
        let options = this.props.options.map((option, index) => {
            return <DataListOption 
                        key={option+index}
                        option={option} 
                        index={index} 
                        useNative={this.props.useNative} 
                        selected={this.props.selected == index} 
                        select={this.props.select} />
        })
        var containerStyle = {}
        if (!this.props.useNative) {
            if (this.props.hide) containerStyle.display = 'none'
            else if (this.props.options.length == 0) containerStyle.display = 'none'
            else containerStyle.display = 'block'
        }
        if (this.props.useNative) return (
            <datalist id={this.props.id} className={"react-datalist"}>{options}</datalist>
        )
        return (
            <div id={this.props.id} className="react-datalist" style={containerStyle}>{options}</div>
        )
    }
}
