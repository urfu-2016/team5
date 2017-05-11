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

        const {handleAnswered, handleInfo} = this.props;

        return (
            <div className={questPhotos()}>
                <div>
                    <button onClick={handleInfo}>Описание квеста</button>
                </div>
                <div>
                    {photos.map(photo =>
                        <PhotoContainer
                            key={photo.id} {...photo}
                            handleAnswered={handleAnswered}
                        />
                    )}
                </div>
            </div>
        );
    }
}
