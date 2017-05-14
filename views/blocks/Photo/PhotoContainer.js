import React from 'react';
import Photo from './Photo';
import sender from './../Sender/Sender';
import {getGeolocation} from './PhotoGeolocation';
import PhotoSender from '../QuestPhotos/PhotoSender.js';

const PhotoWithSending = sender(Photo);

export default class PhotoContainer extends React.Component {
    constructor(props) {
        super(props);

        this.getSendOptions = this.getSendOptions.bind(this);
        this.handleAnswered = this.handleAnswered.bind(this);
        this.canSend = this.canSend.bind(this);
    }

    canSend(callback) {
        getGeolocation((error, position) => {
            if (error) {
                this.props.onGeolocationError(error);
                callback(false);
            }

            this.position = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            callback(true);
        });
    }

    getSendOptions() {
        return PhotoSender.sendPosition(this.props.slug, this.position);
    }

    handleAnswered(data) {
        this.props.handleAnswered(this.props.slug, data);
    }

    render() {
        return (
            <PhotoWithSending
                {...this.props}
                getSendOptions={this.getSendOptions}
                onSuccesfulEnd={this.handleAnswered}
                canSend={this.canSend}
            />
        );
    }
}
