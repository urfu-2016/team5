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

    handlePhotosChange({data}) {
        this.setState({
            photos: data
        });
    }

    handleAnswered(position, data) {
        this.setState(prevState => {
            const photos = prevState.photos.slice();
            photos[position] = Object.assign({}, photos[position]);
            photos[position].status = data.status;
            photos[position].title = data.title;
            photos[position].description = data.description;

            return {photos};
        });

        if (data.finised) {
            this.props.handleFinished();
        }
    }

    render() {
        return (
           <QuestPhotosWithSending
                {...this.state} {...this.props}
                getSendOptions={PhotoSender.getPhotos}
                onSuccesfulEnd={this.handlePhotosChange}
                handleAnswered={this.handleAnswered}
            />
        );
    }
}
