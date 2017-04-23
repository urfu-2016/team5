import React from 'react';
import CommentFormContainer from './../CommentForm/CommentFormContainer';
import CommentListContainer from './../CommentList/CommentListContainer';
import './comments.css';
import b from 'b_';

function FormBlock(props) {
    if (props.isAuth) {
        return <CommentFormContainer />;
    }

    return (
        <div className={[b('comments', 'message'), b('block', {yellow: true})].join(' ')}>
            Чтобы оставить комментарии, пожалуйста, войдите в аккаунт или зарегистрируйтесь.
        </div>);
}

export default class Comments extends React.Component {
    render() {
        return (
            <div className={b('comments')}>
                <div className={[b('comments', 'form'), b('block', {yellow: true})].join(' ')}>
                    <FormBlock {...this.props} />
                </div>
                <div className={[b('comments', 'list'), b('block', {yellow: true})].join(' ')}>
                    <CommentListContainer />
                </div>
            </div>
        );
    }
}
