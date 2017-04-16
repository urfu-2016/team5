import React from 'react';
import './ImagesCountControl.css';
import './../Input.css';
import b from 'b_';
import {ImagesCountControlStrings} from './../../constants/strings';

function item(title, value, name) {
    return (
        <div className={b('images-count-control', 'item')}>
            <span>{title}</span>
            <input className={`input ${b('images-count-control', 'input')}`} type="number"
                value={value} name={name}>
            </input>
        </div>);
}

export default class ImagesCountControl extends React.Component {
    render() {
        const {value, name} = this.props;

        return (
            <div className={b('images-count-control')}>
                {item(ImagesCountControlStrings.from, value.from, name.from)}
                {item(ImagesCountControlStrings.to, value.to, name.to)}
            </div>);
    }
}
