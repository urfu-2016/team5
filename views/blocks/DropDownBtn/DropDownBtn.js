/* global React:true */

class DropDownBtn extends React.Component {
    render() {
        var keys = Object.keys(this.props.options);
        return (
        <select value={this.props.value} name={this.props.name}>
            {keys.map(opt =>
                <option value={opt}>
                    {this.props.options[opt]}
                </option>)}
        </select>);
    }
}

export default DropDownBtn;
