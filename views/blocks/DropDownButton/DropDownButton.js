/* global React:true */

class DropDownBtn extends React.Component {
    render() {
        var keys = Object.keys(this.props.options);

        return (
            <select value={this.props.value} name={this.props.name}>
                {keys.map(option => <option value={option}>{this.props.options[option]}</option>)}
            </select>);
    }
}

export default DropDownBtn;
