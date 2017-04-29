import React from 'react';
import sender from './../Sender/Sender';
import CommentsPoster from './../comments/CommentsPoster.js';
import Likes from './Likes';

const LikesWithSending = sender(Likes);

export default class LikesContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            likesCount: this.props.likesCount,
            liked: this.props.liked
        };

        this.handleLikesChange = this.handleLikesChange.bind(this);
        this.handleFailedSend = this.handleFailedSend.bind(this);
    }

    handleLikesChange() {
        this.setState(prevState => {
            const dl = prevState.liked ? -1 : 1;

            return {
                likesCount: prevState.likesCount + dl,
                liked: !prevState.liked
            };
        });
    }

    handleFailedSend() {
        setTimeout(this.handleLikesChange, 500);
    }

    render() {
        return (
            <LikesWithSending {...this.state}
                data={this.props.id}
                handleAction={CommentsPoster.likeComment}
                onLike={this.handleLikesChange}
                onFailedSend={this.handleFailedSend}
                disabledLike={this.props.disabledLike}>
            </LikesWithSending>);
    }
}
