import React from 'react';
import sender from './../Sender/Sender';
import Quest from './Quest';
import QuestSender from './QuestSender';

const QuestWithSending = sender(Quest);
const mess = 'К сожалению, в вашем браузере не подреживается навигация';

export default class QuestContainer extends React.Component {
    constructor(props) {
        super(props);

        const {user, existGeolocation} = this.props;

        this.state = {
            user,
            showQuestInfo: !user.isPlaying,
            mountQuestPhotos: user.isPlaying,
            mountQuestInfo: !user.isPlaying,
            errorMessage: existGeolocation ? null : mess
        };

        this.handleShowQuestInfo = this.handleShowQuestInfo.bind(this);
        this.handleBeginPlay = this.handleBeginPlay.bind(this);
        this.handleShowError = this.handleShowError.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    handleShowError(errorMessage) {
        this.setState({errorMessage});

        setTimeout(function () {
            this.setState({errorMessage: ''});
        }.bind(this), 2000);
    }

    handleBeginPlay() {
        this.setState(prevState => {
            const user = Object.assign({}, prevState.user);
            user.isPlaying = true;

            return {
                showQuestInfo: false,
                mountQuestPhotos: true,
                user
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
                existGeolocation={this.props.existGeolocation}
                getSendOptions={QuestSender.beginPlay}
                onSuccesfulEnd={this.handleBeginPlay}
                handleInfo={this.handleShowQuestInfo}
                handleShowError={this.handleShowError}
                handlePhotos={this.handleNext}
            />
        );
    }
}
