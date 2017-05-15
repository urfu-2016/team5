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
            if (error) {
                this.props.onShowError(10 + error.code);
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
        this.props.onShowError(20 + (isNoConnection ? 1 : 0));
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
                onFailedSend={this.handleFailedSend}
                canSend={this.canSend}
            />
        );
    }
}
