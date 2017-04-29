import React from 'react';
import Emitter from './../Emitter.js';
import './CommentList.css';
import b from 'b_';
import CommentContainer from './../Comment/CommentContainer';
import {CommentListStrings} from './../../constants/strings';

const commentList = b.lock('comment-list');

export default class CommentList extends React.Component {
    componentDidMount() {
        Emitter.on('updateCommentList', this.props.onAction);
        this.props.onAction();
    }

    componentWillUnMount() {
        Emitter.off('updateCommentList');
    }

    render() {
        const {comments, isAuth} = this.props;

        return (
            <div className={commentList()}>
                {comments.length > 0 ? (
                    comments.map(comment =>
                        <CommentContainer {...comment} isAuth={isAuth} key={comment.id} />
                    )
                ) : (
                    <div className={commentList('message')}>
                        {CommentListStrings.message}
                    </div>
                )}
            </div>
        );
    }
}
