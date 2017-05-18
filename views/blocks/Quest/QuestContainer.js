import React from 'react';
import sender from './../Sender/Sender';
import Quest from './Quest';
import QuestSender from './QuestSender';
import messageStrings from '../../constants/messages';

const QuestWithSending = sender(Quest);

export default class QuestContainer extends React.Component {
    constructor(props) {
        super(props);

        const {user, existGeolocation} = this.props;
        const message = user.started && !existGeolocation ? messageStrings[1] : null;
        this.state = {
            user,
            showQuestInfo: !user.started || user.finished,
            mountQuestPhotos: user.started && !user.finished,
            mountQuestInfo: !user.started || user.finished,
            message,
            showFinishMessage: false
        };

        this.handleShowQuestInfo = this.handleShowQuestInfo.bind(this);
        this.hideFinishMessage = this.hideFinishMessage.bind(this);
        this.handleBeginPlay = this.handleBeginPlay.bind(this);
        this.handleShowError = this.handleShowError.bind(this);
        this.handleFinished = this.handleFinished.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    handleShowError(messageCode) {
        this.setState({message: messageStrings[messageCode]});

        setTimeout(function () {
            this.setState({message: ''});
        }.bind(this), 3000);
    }

    handleBeginPlay() {
        this.setState(prevState => {
            const user = Object.assign({}, prevState.user);
            user.started = true;

            return {
                showQuestInfo: false,
                mountQuestPhotos: true,
                user
            };
        });
    }

    handleFinished() {
        this.setState(prevState => {
            const user = Object.assign({}, prevState.user);
            user.finished = true;

            return {user, showFinishMessage: true};
        });
    }

    handleNext() {
        this.setState({
            showQuestInfo: false,
            mountQuestPhotos: true
        });
    }

    hideFinishMessage() {
        this.setState({showFinishMessage: false});
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
                existGeolocation={this.props.existGeolocation}
                getSendOptions={QuestSender.beginPlay}
                onSuccesfulEnd={this.handleBeginPlay}
                handleInfo={this.handleShowQuestInfo}
                handleShowError={this.handleShowError}
                handlePhotos={this.handleNext}
                handleFinished={this.handleFinished}
                hideFinishMessage={this.hideFinishMessage}
            />
        );
    }
}
