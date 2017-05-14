import React from 'react';
import sender from './../Sender/Sender';
import Quest from './Quest';
import QuestSender from './QuestSender';

const QuestWithSending = sender(Quest);

export default class QuestContainer extends React.Component {
    constructor(props) {
        super(props);

        const {user} = this.props;

        this.state = {
            user,
            showQuestInfo: !user.isPlaying,
            mountQuestPhotos: user.isPlaying,
            mountQuestInfo: !user.isPlaying
        };

        this.handleBeginPlay = this.handleBeginPlay.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleShowQuestInfo = this.handleShowQuestInfo.bind(this);
    }

    handleBeginPlay() {
        this.setState(prevState => {
            const user = Object.assign(prevState.user);
            user.isPlaying = true;

            return {
                showQuestInfo: false,
                mountQuestPhotos: true,
                user: user
            };
        });
    }

    handleNext() {
        this.setState({
            showQuestInfo: false,
            mountQuestPhotos: true
        });
    }

    handleShowQuestInfo() {
        this.setState({
            mountQuestInfo: true,
            showQuestInfo: true
        });
    }

    render() {
        return (
            <QuestWithSending
                {...this.state}
                getSendOptions={QuestSender.beginPlay}
                onSuccesfulEnd={this.handleBeginPlay}
                handlePhotos={this.handleNext}
                handleInfo={this.handleShowQuestInfo}
            />
        );
    }
}
