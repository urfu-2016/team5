import React from 'react';
import Comments from './../comments/comments';
import QuestInfoContainer from '../QuestInfo/QuestInfoContainer';
import QuestPhotosContainer from '../QuestPhotos/QuestPhotosContainer';
import './Quest.css';

export default class Quest extends React.Component {
    constructor(props) {
        super(props);

        this.handleBeginPlay = this.handleBeginPlay.bind(this);
    }

    handleBeginPlay() {
        const {onAction, handleShowError, existGeolocation} = this.props;

        if (existGeolocation) {
            onAction();
        } else {
            handleShowError(1);
        }
    }

    render() {
        const {
            existGeolocation,
            mountQuestPhotos,
            handleShowError,
            mountQuestInfo,
            showQuestInfo,
            handlePhotos,
            handleInfo,
            onAction,
            message,
            sending,
            user
        } = this.props;

        return (
            <div>
                {message &&
                    <div className="message_error">
                        {message}
                    </div>
                }
                {mountQuestInfo &&
                    <div>
                        <QuestInfoContainer
                            user={user}
                            existGeolocation={existGeolocation}
                            showQuestInfo={showQuestInfo}
                            handleBeginPlay={onAction}
                            handlePhotos={handlePhotos}
                            beginPlayRequest={sending}
                        />
                        <Comments isAuth={user.isAuth} showComments={showQuestInfo}/>
                    </div>
                }
                {mountQuestPhotos &&
                    <QuestPhotosContainer
                        existGeolocation={existGeolocation}
                        showQuestPhoto={!showQuestInfo}
                        handleInfo={handleInfo}
                        handleShowError={handleShowError}
                    />
                }
            </div>
        );
    }
}
