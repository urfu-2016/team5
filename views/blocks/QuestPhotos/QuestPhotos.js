import React from 'react';
import b from 'b_';
import './QuestPhotos.css';
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

        const {handleAnswered, handleInfo, existGeolocation, handleShowError} = this.props;

        return (
            <div className={questPhotos()}>
                <div className={questPhotos('button')}>
                    <button className="button" onClick={handleInfo}>Описание квеста</button>
                </div>
                <div className={questPhotos('photos')}>
                    {photos.map((photo, index) =>
                        <PhotoContainer id={index}
                            key={photo.src} {...photo}
                            handleAnswered={handleAnswered}
                            existGeolocation={existGeolocation}
                            onShowError={handleShowError}
                        />
                    )}
                </div>
            </div>
        );
    }
}
