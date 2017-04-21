import React from 'react';
import b from 'b_';
import './DropDownButton.css';
import './../Input.css';

export default class DropDownButton extends React.Component {
    render() {
        const {options, name, value} = this.props;
        var keys = Object.keys(options);

        return (
            <select className={b('input', {type: 'drop-down'})} value={value} name={name}>
                {keys.map(key =>
                    <option key={options[key]} value={options[key]}>{key}</option>
                )}
            </select>);
    }
}
