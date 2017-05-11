import React from 'react';
import Comments from './../comments/comments';
import Card from './../card/Card';
import QuestSender from '../Quest/QuestSender';
import LikesContainer from './../Likes/LikesContainer';

function Button(props) {
    return (
        <button className={'btn btn_gray'} disabled={!props.isAuth}
            onClick={props.handleClick}>{props.text}</button>
    );
}

export default class QuestInfo extends React.Component {
    componentDidMount() {
        this.props.onAction();
    }

    render() {
        const {showQuestInfo, quest} = this.props;

        if (!(showQuestInfo && quest)) {
            return null;
        }

        const {user, handleBeginPlay, handlePhotos} = this.props;

        return (
            <div>
                <div className={'block block_gray'}>
                    <Card isCreator={user.isCreator} quest={quest} />
                    <LikesContainer
                        getSendOptions={QuestSender.likeQuest}
                        liked={quest.liked}
                        likesCount={quest.likesCount}
                        disabledLike={!user.isAuth}
                    />
                    {!user.isCreator &&
                        <Button isAuth={user.isAuth}
                            handleClick={user.isPlaying ? (handlePhotos) : (handleBeginPlay)}
                            text={user.isPlaying ? ('Продолжить прохождение') : ('Пройти квест')}
                        />
                    }
                </div>
                <Comments isAuth={user.isAuth} />
            </div>
        );
    }
}
