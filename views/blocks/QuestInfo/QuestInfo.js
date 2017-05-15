import React from 'react';
import Card from '../card/card';
import QuestSender from '../Quest/QuestSender';
import LikesContainer from './../Likes/LikesContainer';
import Button from './../Button/Button';
import './QuestInfo.css';
import b from 'b_';

const questInfo = b.lock('quest-info');

export default class QuestInfo extends React.Component {
    componentDidMount() {
        this.props.onAction();
    }

    render() {
        const {showQuestInfo, quest} = this.props;

        if (!(showQuestInfo && quest)) {
            return null;
        }

        const {user, handleBeginPlay, handlePhotos, sending, existGeolocation} = this.props;

        return (
            <div>
                <div className={'quest-info block block_gray'}>
                    <Card isCreator={user.isCreator} quest={quest} />
                    <div className={questInfo('controls')}>
                        {!user.isCreator &&
                            <div className={questInfo('button', {play: true})}>
                                <Button disabled={!user.isAuth && !existGeolocation}
                                    inProgress={sending}
                                    onClick={user.isPlaying ? (handlePhotos) : (handleBeginPlay)}
                                    text={user.isPlaying ? ('Продолжить прохождение') : ('Пройти квест')}
                                />
                            </div>
                        }
                        <div className={questInfo('button', {like: true})}>
                            <LikesContainer
                                getSendOptions={QuestSender.likeQuest}
                                liked={quest.liked}
                                likesCount={quest.likesCount}
                                disabledLike={!user.isAuth}
                            />
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
