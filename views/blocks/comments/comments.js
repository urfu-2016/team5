import React from 'react';
import CommentFormContainer from './../CommentForm/CommentFormContainer';
import CommentListContainer from './../CommentList/CommentListContainer';
import {CommentsStrings} from './../../constants/strings';
import CommentsPoster from './CommentsPoster.js';
import './comments.css';
import b from 'b_';

const comments = b.lock('comments');

function FormBlock(props) {
    if (props.isAuth) {
        return <CommentFormContainer getSendOptions={CommentsPoster.sendComment} />;
    }

    return (
        <div className={comments('message')}>
            {CommentsStrings.message}
        </div>
    );
}

export default class Comments extends React.Component {
    render() {
        const {showComments, isAuth} = this.props;

        if (!showComments) {
            return null;
        }

        return (
            <div className={comments()}>
                <div className={[b('block', {gray: true}), comments('form')].join(' ')}>
                    <FormBlock isAuth={isAuth} />
                </div>
                <div className={[comments('list'), b('block', {gray: true})].join(' ')}>
                    <CommentListContainer
                        isAuth={isAuth}
                        getSendOptions={CommentsPoster.getComments}
                    />
                </div>
            </div>
        );
    }
}
