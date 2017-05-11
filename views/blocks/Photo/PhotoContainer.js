import React from 'react';
import Photo from './Photo';
import sender from './../Sender/Sender';
import PhotoSender from '../QuestPhotos/PhotoSender.js';

const PhotoWithSending = sender(Photo);

export default class PhotoContainer extends React.Component {
    constructor(props) {
        super(props);

        this.getSendOptions = this.getSendOptions.bind(this);
    }

    getSendOptions() {
        var position = {
            x: 0,
            y: 4
        };

        return PhotoSender.sendPosition(this.props.id, position);
    }

    render() {
        return (
            <PhotoWithSending
                {...this.props}
                getSendOptions={this.getSendOptions}
                onSuccesfulEnd={this.props.handleAnswered}
            />
        );
    }
}
