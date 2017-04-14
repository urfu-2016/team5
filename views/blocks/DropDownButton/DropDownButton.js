/* global React:true */

import './DropDownButton.css';
import './../Input.css';

export default class DropDownButton extends React.Component {
    render() {
        const {options, name, value} = this.props;
        var keys = Object.keys(options);

        return (
            <select className="input drop-down-input" value={value} name={name}>
                {keys.map(key =>
                    <option key={key} value={key}>{options[key]}</option>
                )}
            </select>);
    }
}
