import React from 'react';
import CommentList from './CommentList';
import sender from './../Sender/Sender';
import CommentsPoster from './../comments/CommentsPoster.js';

const CommentListWithSending = sender(CommentList);

export default class CommentListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: []
        };

        this.handleCommentsChange = this.handleCommentsChange.bind(this);
    }

    handleCommentsChange(data) {
        this.setState({
            comments: data.comments
        });
    }

    render() {
        return (
           <CommentListWithSending
                comments={this.state.comments}
                handleAction={CommentsPoster.getComments}
                onSuccesfulEnd={this.handleCommentsChange}
                isAuth={this.props.isAuth}
            />
        );
    }
}
