import React from 'react';
import CommentList from './CommentList';
import sender from './../Sender/Sender';

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
        this.setState(prevState => ({
            commentsLength: prevState.commentsLength - 1
        }));
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
                {...this.state}
                getSendOptions={this.props.getSendOptions}
                updateCommentsLength={this.updateCommentsLength}
                onSuccesfulEnd={this.handleCommentsChange}
                isAuth={this.props.isAuth}
            />
        );
    }
}
