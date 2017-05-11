import React from 'react';
import QuestSender from '../Quest/QuestSender';
import QuestInfo from './QuestInfo';
import sender from './../Sender/Sender';

const QuestInfoWithSending = sender(QuestInfo);

export default class QuestInfoContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quest: null
        };

        this.onSuccesfulEnd = this.onSuccesfulEnd.bind(this);
    }

    onSuccesfulEnd(data) {
        this.setState(data);
    }

    render() {
        return (
            <QuestInfoWithSending
                quest={this.state.quest} {...this.props}
                onSuccesfulEnd={this.onSuccesfulEnd}
                getSendOptions={QuestSender.getQuestInfo}
            />
        );
    }
}
