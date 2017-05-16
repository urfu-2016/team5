import React from 'react';
import Card from '../card/card';
import Button from './../Button/Button';
import './QuestInfo.css';
import b from 'b_';

const questInfo = b.lock('quest-info');
const continueString = 'Продолжить прохождение';
const beginString = 'Пройти квест';
const showImagesString = 'Показать картинки';

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

        var text;
        if (user.isPlaying) {
            text = continueString;
        } else {
            text = (user.isCreator || user.isFinished) ? showImagesString : beginString;
        }

        const handleClick = (!user.isCreator && user.notStarted) ? handleBeginPlay : handlePhotos;

        return (
            <div className={'quest-info block block_gray'}>
                <Card user={user} quest={quest} />
                <div className={questInfo('button', {play: true})}>
                    <Button disabled={!user.isAuth}
                        inProgress={sending}
                        onClick={handleClick}
                        text={text}
                    />
                </div>
            </div>
        );
    }
}
