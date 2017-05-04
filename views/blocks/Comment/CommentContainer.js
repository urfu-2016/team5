import React from 'react';
import sender from './../Sender/Sender';
import CommentsPoster from './../comments/CommentsPoster.js';
import Comment from './Comment';

const CommentWithSending = sender(Comment);

export default class CommentContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deleted: false
        };

        this.handleSuccesfulEnd = this.handleSuccesfulEnd.bind(this);
    }

    handleSuccesfulEnd() {
        this.setState({
            deleted: true
        });
        this.props.onDelete();
    }

    render() {
        if (this.state.deleted) {
            return null;
        }
        return (
            <CommentWithSending
                data={this.props.id} {...this.props}
                handleAction={CommentsPoster.removeComment}
                onSuccesfulEnd={this.handleSuccesfulEnd}>
            </CommentWithSending>
        );
    }
}

