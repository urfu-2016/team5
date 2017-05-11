import React from 'react';
import sender from './../Sender/Sender';
import Comment from './Comment';
import CommentsPoster from './../comments/CommentsPoster.js';

const CommentWithSending = sender(Comment);

export default class CommentContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deleted: false
        };

        this.handleSuccesfulEnd = this.handleSuccesfulEnd.bind(this);
        this.getSendOptions = this.getSendOptions.bind(this);
    }

    handleSuccesfulEnd() {
        this.setState({
            deleted: true
        });
        this.props.onDelete();
    }

    getSendOptions() {
        return CommentsPoster.removeComment(this.props.id);
    }

    render() {
        if (this.state.deleted) {
            return null;
        }

        return (
            <CommentWithSending {...this.props}
                getSendOptions={this.getSendOptions}
                onSuccesfulEnd={this.handleSuccesfulEnd}>
            </CommentWithSending>
        );
    }
}

