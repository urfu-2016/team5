import React from 'react';
import './CommentForm.css';
import CommentForm from './CommentForm';
import sender from './../Sender/Sender';
import Emitter from './../Emitter.js';
import CommentsPoster from './../comments/CommentsPoster.js';

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

    render() {
        return (
            <CommentFormWithSending
                {...this.state}
                data={this.state.text}
                onChangeText={this.handleTextChange}
                handleAction={CommentsPoster.sendComment}
                onSuccesfulEnd={this.handleSuccesfulEnd}
                onFailedSend={this.handleFailedSend}
            />
        );
    }
}
