import React from 'react';
import b from 'b_';
import LikesContainer from './../Likes/LikesContainer';
import CommentsPoster from './../comments/CommentsPoster.js';
import './Comment.css';

const comment = b.lock('comment');

export default class Comment extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.getSendOptions = this.getSendOptions.bind(this);
    }

    handleClick() {
        this.props.onAction();
    }

    getSendOptions() {
        return CommentsPoster.likeComment(this.props.id);
    }

    render() {
        const {author, date, message, liked, likesCount, isAuth, isAuthor = false, sending} = this.props;

        return (
            <div className={comment()}>
                <div className={comment('author')}>
                    {author}
                </div>
                <div className={comment('date')}>
                    {date}
                </div>
                <div className={comment('text')}>
                    {message}
                </div>
                <div className={comment('button', {like: true})}>
                    <LikesContainer
                        liked={liked}
                        likesCount={likesCount}
                        disabledLike={!isAuth}
                        getSendOptions={this.getSendOptions}
                    />
                </div>
                {isAuth && isAuthor &&
                    <button onClick={this.handleClick} disabled={sending}
                        className={[comment('button', {delete: true}), 'button_icon'].join(' ')}>
                        <i className={'fa fa-times'} aria-hidden={true}></i>
                    </button>
                }
            </div>
        );
    }
}
