import React from 'react';
import './Photo.css';
import b from 'b_';

const photo = b.lock('photo');

function Status(props) {
    if (props.userIsCreator || props.status === null) {
        return null;
    }

    return (
        <div className={['control', photo('checker')].join(' ')}>
            <i className={`fa ${props.status ? 'fa-check' : 'fa-times'}`} area-hidden="true"></i>;
        </div>
    );
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
        const {src, status, sending, existGeolocation, userIsCreator} = this.props;

        return (
            <div className={photo()}>
                <Status status={status} userIsCreator={userIsCreator}/>
                {!(userIsCreator || status) &&
                    <button
                        className={['control', photo('button')].join(' ')}
                        disabled={!existGeolocation || sending}
                        onClick={this.handleClick}
                    >
                        <i className={`fa fa-crosshairs ${sending ? 'fa-spin' : ''}`} aria-hidden="true"></i>
                    </button>
                }
                <img src={src}></img>
            </div>
        );
    }
}
