import React from 'react';
import QuestPhotos from './QuestPhotos';
import sender from './../Sender/Sender';
import PhotoSender from './PhotoSender';

const QuestPhotosWithSending = sender(QuestPhotos);

export default class QuestPhotosContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            photos: [],
            geolocationError: null
        };

        this.handlePhotosChange = this.handlePhotosChange.bind(this);
        this.handleGeolocationError = this.handleGeolocationError.bind(this);
        this.handleAnswered = this.handleAnswered.bind(this);
    }

    handlePhotosChange({data}) {
        this.setState({
            photos: data
        });
    }

    handleGeolocationError(error) {
        this.setState({
            geolocationError: error
        });
    }

    handleAnswered(position, data) {
        this.setState(prevState => {
            const photos = prevState.photos.slice();
            photos[position] = Object.assign({}, photos[position]);
            photos[position].status = data.status;

            return {photos};
        });
    }

    render() {
        const {showQuestPhoto, handleInfo} = this.props;

        return (
           <QuestPhotosWithSending
                {...this.state}
                handleInfo={handleInfo}
                getSendOptions={PhotoSender.getPhotos}
                onSuccesfulEnd={this.handlePhotosChange}
                showQuestPhoto={showQuestPhoto}
                handleAnswered={this.handleAnswered}
                handleGeolocationError={this.handleGeolocationError}
            />
        );
    }
}
