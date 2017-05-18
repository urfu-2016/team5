import React from 'react';
import './ImagesCountControl.css';
import './../Input.css';
import b from 'b_';
import {ImagesCountControlStrings} from './../../constants/strings';

function Item(props) {
    return (
        <div className={b('images-count-control', 'item')}>
            <span>{props.title}</span>
            <input value={props.value} name={props.name} type="number"
                min={props.min} max={props.max} required
                className={`input ${b('images-count-control', 'input')}`}>
            </input>
        </div>);
}

export default class ImagesCountControl extends React.Component {
    render() {
        const {value, name} = this.props;

        return (
            <div className={b('images-count-control')}>
                <Item
                    title={ImagesCountControlStrings.from}
                    value={value.from}
                    name={name.from}
                    min={value.min}
                    max={value.max}
                />
                <Item
                    title={ImagesCountControlStrings.to}
                    value={value.to}
                    name={name.to}
                    min={value.from}
                    max={value.max}
                />
            </div>);
    }
}
