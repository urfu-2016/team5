import React from 'react';
import Comments from './../comments/comments';
import QuestInfoContainer from '../QuestInfo/QuestInfoContainer';
import QuestPhotosContainer from '../QuestPhotos/QuestPhotosContainer';

import b from 'b_';
import './Quest.css';

const quest = b.lock('quest');

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
            hideFinishMessage,
            existGeolocation,
            mountQuestPhotos,
            showFinishMessage,
            handleShowError,
            handleFinished,
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
            <div className={quest()}>
                {message &&
                    <div className={b('message', {error: true})}>
                        <span>{message}</span>
                    </div>
                }
                {showFinishMessage &&
                    <div className={quest('message')}>
                        <div className={b('message', {finished: true})}>
                            <span>Поздравляем!</span>
                            <br></br>
                            <span>Вы прошли квест!</span>
                             <button className={b('message', 'button')}
                                onClick={hideFinishMessage}>
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                }
                {mountQuestInfo &&
                    <div className={quest('quest-info')}>
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
                    <div className={quest('quest-photos')}>
                        <QuestPhotosContainer
                            userIsCreator={user.isCreator}
                            existGeolocation={existGeolocation}
                            showQuestPhoto={!showQuestInfo}
                            handleInfo={handleInfo}
                            handleShowError={handleShowError}
                            handleFinished={handleFinished}
                        />
                    </div>
                }
            </div>
        );
    }
}
