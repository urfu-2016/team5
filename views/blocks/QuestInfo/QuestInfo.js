import React from 'react';
import Card from '../card/card';
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

        const {user, handleBeginPlay, handlePhotos, sending} = this.props;

        return (
            <div className={'quest-info block block_gray'}>
                <Card user={user} quest={quest} />
                {!user.isCreator &&
                    <div className={questInfo('button', {play: true})}>
                        <Button disabled={!user.isAuth}
                            inProgress={sending}
                            onClick={user.isPlaying ? (handlePhotos) : (handleBeginPlay)}
                            text={user.isPlaying ? ('Продолжить прохождение') : ('Пройти квест')}
                        />
                    </div>
                }
            </div>
        );
    }
}
