import React from 'react';
import Comments from './../comments/comments';
import QuestInfoContainer from '../QuestInfo/QuestInfoContainer';
import QuestPhotosContainer from '../QuestPhotos/QuestPhotosContainer';
import './Quest.css';

export default class Quest extends React.Component {
    render() {
        const {
            existGeolocation,
            mountQuestPhotos,
            handleShowError,
            mountQuestInfo,
            showQuestInfo,
            handlePhotos,
            errorMessage,
            handleInfo,
            onAction,
            sending,
            user
        } = this.props;

        return (
            <div>
                {errorMessage &&
                    <div className="message_error">
                        {errorMessage}
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
