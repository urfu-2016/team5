import React from 'react';
import b from 'b_';
import PhotoContainer from './../Photo/PhotoContainer';

const questPhotos = b.lock('quest-photos');

export default class QuestPhotos extends React.Component {
    componentDidMount() {
        this.props.onAction();
    }

    render() {
        const {showQuestPhoto, photos} = this.props;

        if (!(showQuestPhoto && photos)) {
            return null;
        }

        const {handleAnswered, handleInfo, handleGeolocationError, geolocationError} = this.props;

        return (
            <div className={questPhotos()}>
                <div>
                    <button onClick={handleInfo}>Описание квеста</button>
                </div>
                {geolocationError &&
                    <div>
                        {geolocationError.message}
                    </div>
                }
                <div>
                    {photos.map((photo, index) =>
                        <PhotoContainer id={index}
                            key={photo.src} {...photo}
                            handleAnswered={handleAnswered}
                            onGeolocationError={handleGeolocationError}
                        />
                    )}
                </div>
            </div>
        );
    }
}
