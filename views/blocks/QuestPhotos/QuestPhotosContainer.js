import React from 'react';
import QuestPhotos from './QuestPhotos';
import sender from './../Sender/Sender';
import PhotoSender from './PhotoSender';

const QuestPhotosWithSending = sender(QuestPhotos);

export default class QuestPhotosContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            photos: []
        };

        this.handlePhotosChange = this.handlePhotosChange.bind(this);
        this.handleAnswered = this.handleAnswered.bind(this);
    }

    handlePhotosChange(data) {
        this.setState({
            photos: data
        });
    }

    handleAnswered({position, rightAnswered}) {
        this.setState(prevState => {
            const photos = Object.assign(prevState.photos);
            photos[position].rightAnswered = rightAnswered;
            photos[position].answered = true;

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
            />
        );
    }
}
