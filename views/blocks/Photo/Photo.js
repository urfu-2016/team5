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
            <i className={`fa ${props.status ? 'fa-check' : 'fa-times'}`} area-hidden="true"></i>
        </div>
    );
}

function Button(props) {
    if (props.userIsCreator || props.status) {
        return null;
    }

    return (
        <button
            className={['control', photo('button')].join(' ')}
            disabled={!props.existGeolocation || props.sending}
            onClick={props.handleClick}>
            <i className={`fa fa-crosshairs ${props.sending ? 'fa-spin' : ''}`} aria-hidden="true"></i>
        </button>
    );
}

function ShowDescriptionButton(props) {
    if (!(props.userIsCreator || props.status) || !props.description) {
        return null;
    }

    return (
        <button
            className={['control', photo('button')].join(' ')}
            onClick={props.handleShowDescription}>
            <i className="fa fa-info" aria-hidden="true"></i>
        </button>
    );
}

export default class Photo extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleShowDescription = this.handleShowDescription.bind(this);

        this.state = {
            showDescription: false
        };
    }

    handleShowDescription() {
        this.setState(prevState => ({showDescription: !prevState.showDescription}));
    }

    handleClick() {
        this.props.canSend(canSend => {
            if (canSend) {
                this.props.onAction();
            }
        });
    }

    render() {
        const {
            existGeolocation,
            userIsCreator,
            description,
            sending,
            status,
            title,
            src
        } = this.props;

        return (
            <div className={photo()}>
                <div className={photo('img', {hidden: this.state.showDescription})}>
                    <Status status={status} userIsCreator={userIsCreator}/>
                    <Button status={status} existGeolocation={existGeolocation}
                        userIsCreator={userIsCreator} sending={sending}
                        handleClick={this.handleClick}
                    />
                    <ShowDescriptionButton status={status}
                        handleShowDescription={this.handleShowDescription}
                        userIsCreator={userIsCreator}
                        description={description}
                    />
                    <img src={src}></img>
                    {(userIsCreator || status) && title &&
                        <p className={photo('title')}>
                            {title}
                        </p>
                    }
                </div>
                {(userIsCreator || status) && description &&
                    <div className={photo('description', {show: this.state.showDescription})}>
                        <p>{description}</p>
                        <button
                            className={['control', photo('button', {back: true})].join(' ')}
                            onClick={this.handleShowDescription}>
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </button>
                    </div>
                }
            </div>
        );
    }
}
