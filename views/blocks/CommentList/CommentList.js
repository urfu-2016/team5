import React from 'react';
import Comment from './../Comment/Comment';
import Emitter from './../Emitter.js';
import './CommentList.css';
import b from 'b_';

const commentItems = comments => comments.map(comment =>
    <div key={comment.id} className={b('comment-list', 'item')}>
        <Comment {...comment} key={comment.id} />
    </div>);

export default class CommentList extends React.Component {
    componentDidMount() {
        Emitter.on('updateCommentList', this.props.onSubmit);
        this.timerID = setInterval(() => this.props.onSubmit(), 100000);
        this.props.onAction();
    }

    componentWillUnMount() {
        Emitter.off('updateCommentList');
        clearInterval(this.timerID);
    }

    render() {
        const {comments} = this.props;

        return (
            <div className={b('comment-list')}>
                {comments.length > 0 && commentItems(comments)}
                {comments.length === 0 &&
                    <div className={b('comment-list', 'message')}>
                        Здесь пока нет коментариев)
                    </div>
                }
            </div>
        );
    }
}
