import React from 'react';
import './Button.css';
import b from 'b_';

const button = b.lock('button');

export default class Button extends React.Component {
    render() {
        const {disabled, text, type, inProgress, onClick} = this.props;
        return (
            <button
                type={type}
                disabled={disabled}
                className={button({inProgress})}
                onClick={onClick}
            >
                {text}
            </button>
        );
    }
}
