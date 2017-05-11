import React from 'react';
import sender from './../Sender/Sender';
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
        this.setState(prevState => ({
            likesCount: prevState.likesCount + (prevState.liked ? -1 : 1),
            liked: !prevState.liked
        }));
    }

    handleFailedSend() {
        setTimeout(this.handleLikesChange, 500);
    }

    render() {
        return (
            <LikesWithSending
                {...this.props} {...this.state}
                onLike={this.handleLikesChange}
                onFailedSend={this.handleFailedSend}
            >
            </LikesWithSending>);
    }
}
