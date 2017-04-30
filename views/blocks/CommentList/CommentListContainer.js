import React from 'react';
import CommentList from './CommentList';
import sender from './../Sender/Sender';
import CommentsPoster from './../comments/CommentsPoster.js';

const CommentListWithSending = sender(CommentList);

export default class CommentListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: [],
            commentsLength: 0
        };

        this.handleCommentsChange = this.handleCommentsChange.bind(this);
        this.updateCommentsLength = this.updateCommentsLength.bind(this);
    }

    updateCommentsLength() {
        this.setState(prevState => {
            return {
                commentsLength: prevState.commentsLength - 1
            };
        });
    }

    handleCommentsChange({data}) {
        this.setState({
            comments: data,
            commentsLength: data.length
        });
    }

    render() {
        return (
           <CommentListWithSending
                commentsLength={this.state.commentsLength}
                updateCommentsLength={this.updateCommentsLength}
                comments={this.state.comments}
                handleAction={CommentsPoster.getComments}
                onSuccesfulEnd={this.handleCommentsChange}
                isAuth={this.props.isAuth}
            />
        );
    }
}
