import React from 'react';
import Photo from './Photo';
import sender from './../Sender/Sender';
import {getGeolocation} from './PhotoGeolocation';
import PhotoSender from '../QuestPhotos/PhotoSender.js';

const PhotoWithSending = sender(Photo);

export default class PhotoContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleFailedSend = this.handleFailedSend.bind(this);
        this.getSendOptions = this.getSendOptions.bind(this);
        this.handleAnswered = this.handleAnswered.bind(this);
        this.canSend = this.canSend.bind(this);
    }

    canSend(callback) {
        getGeolocation((error, position) => {
            var message;
            if (error) {
                switch (error.code) {
                    case 1:
                        message = 'wert';
                        break;
                    case 2:
                        message = 'qjasfhafhlawert';
                        break;
                    default:
                        message = 'dfdf';
                }

                this.props.onShowError(message);
                return callback(false);
            }

            this.position = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            callback(true);
        });
    }

    handleFailedSend(isNoConnection) {
        this.props.onShowError(isNoConnection ? 'sfdsf' : 'dfdfsdsdf');
    }

    getSendOptions() {
        return PhotoSender.sendPosition(this.props.id, this.position);
    }

    handleAnswered(data) {
        this.props.handleAnswered(this.props.id, data);
    }

    render() {
        return (
            <PhotoWithSending
                {...this.props}
                getSendOptions={this.getSendOptions}
                onSuccesfulEnd={this.handleAnswered}
                handleFailedSend={this.handleFailedSend}
                canSend={this.canSend}
            />
        );
    }
}
