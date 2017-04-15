import React from 'react';
import './ImagesCountControl.css';
import './../Input.css';
import b from 'b_';
const From = 'От:';
const To = 'До:';

function item(title, value, name) {
    return (
        <div className={b('imagesCountControl', 'item')}>
            <span>{title}</span>
            <input className={`input ${b('imagesCountControl', 'input')}`} type="number"
                value={value} name={name}>
            </input>
        </div>);
}

export default class ImagesCountControl extends React.Component {
    render() {
        const {value, name} = this.props;

        return (
            <div className={b('imagesCountControl')}>
                {item(From, value.from, name.from)}
                {item(To, value.to, name.to)}
            </div>);
    }
}
