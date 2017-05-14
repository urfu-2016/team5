import React from 'react';
import Comments from './../comments/comments';
import QuestInfoContainer from '../QuestInfo/QuestInfoContainer';
import QuestPhotosContainer from '../QuestPhotos/QuestPhotosContainer';

function existNav() {
    return navigator.geolocation !== undefined;
}

export default class Quest extends React.Component {
    constructor(props) {
        super(props);

        this.handleBeginPlay = this.handleBeginPlay.bind(this);
    }

    handleBeginPlay() {
        if (existNav()) {
            this.props.onAction();
        } else {
            // Alert('К сожалению, в вашем браузере не подреживается навигация');
        }
    }

    render() {
        const {
            mountQuestPhotos,
            mountQuestInfo,
            showQuestInfo,
            handlePhotos,
            handleInfo,
            sending,
            user
        } = this.props;

        return (
            <div>
                {mountQuestInfo &&
                    <div>
                        <QuestInfoContainer
                            user={user}
                            showQuestInfo={showQuestInfo}
                            handleBeginPlay={this.handleBeginPlay}
                            handlePhotos={handlePhotos}
                            beginPlayRequest={sending}
                        />
                        <Comments isAuth={user.isAuth} showComments={showQuestInfo}/>
                    </div>
                }
                {mountQuestPhotos &&
                    <QuestPhotosContainer
                        showQuestPhoto={!showQuestInfo}
                        handleInfo={handleInfo}
                    />
                }
            </div>
        );
    }
}
