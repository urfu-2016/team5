import React from 'react';
import './Photo.css';
import b from 'b_';

const photo = b.lock('photo');

function Status(props) {
    if (props.status === null) {
        return null;
    }

    return <i className={`fa ${props.status ? 'fa-check' : 'fa-times'}`} area-hidden="true"></i>;
}

export default class Photo extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.canSend(canSend => {
            if (canSend) {
                this.props.onAction();
            }
        });
    }

    render() {
        const {src, status, sending} = this.props;

        return (
            <div className={photo()}>
                <div className={['control', photo('checker')].join(' ')}>
                    <Status status={status} />
                </div>
                <button
                    className={['control', photo('button')].join(' ')}
                    disabled={sending}
                    onClick={this.handleClick}
                >
                    <i className={`fa fa-crosshairs ${sending ? 'fa-spin' : ''}`} aria-hidden="true"></i>
                </button>
                <img src={src}></img>
            </div>
        );
    }
}
