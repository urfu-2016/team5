import React from 'react';
import './CommentForm.css';
import CommentForm from './CommentForm';
import sender from './../Sender/Sender';
import Emitter from './../Emitter.js';

const CommentFormWithSending = sender(CommentForm);

export default class CommentFormContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            rows: 4,
            showError: false,
            noConnection: false
        };

        this.handleSuccesfulEnd = this.handleSuccesfulEnd.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleFailedSend = this.handleFailedSend.bind(this);
        this.getSendOptions = this.getSendOptions.bind(this);
    }

    handleTextChange(text) {
        this.setState({text});
    }

    handleSuccesfulEnd() {
        this.handleTextChange('');
        Emitter.emit('updateCommentList');
    }

    handleFailedSend(isNoConection) {
        this.setState({
            showError: true,
            noConnection: isNoConection
        });

        setTimeout(function () {
            this.setState({
                showError: false
            });
        }.bind(this), 3000);
    }

    getSendOptions() {
        return this.props.getSendOptions(this.state.text);
    }

    render() {
        return (
            <CommentFormWithSending
                {...this.state}
                getSendOptions={this.getSendOptions}
                onChangeText={this.handleTextChange}
                onFailedSend={this.handleFailedSend}
                onSuccesfulEnd={this.handleSuccesfulEnd}
            />
        );
    }
}
