import React from 'react';
import './CommentForm.css';
import CommentForm from './CommentForm';
import sender from './../Sender/Sender';
import Emitter from './../Emitter.js';
import CommentsPoster from './../CommentsPoster.js';

const CommentFormWithSending = sender(CommentForm);

export default class CommentFormContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ''
        };

        this.handleSuccesfulEnd = this.handleSuccesfulEnd.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    handleTextChange(e) {
        this.setState({
            text: e.target.value
        });
    }

    handleSuccesfulEnd() {
        this.setState({
            text: ''
        });

        Emitter.emit('updateCommentList');
    }

    render() {
        return (
            <CommentFormWithSending
                text={this.state.text}
                onChangeText={this.handleTextChange}
                handleAction={CommentsPoster.sendComment}
                onSuccesfulEnd={this.handleSuccesfulEnd}
            />
        );
    }
}
