import React from 'react';
import './CommentForm.css';
import b from 'b_';
import './../Input.css';
import {CommentFormStrings} from './../../constants/strings';

const commentForm = b.lock('comment-form');

export default class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onAction();
    }

    handleTextChange(e) {
        this.props.onChangeText(e.target.value);
    }

    render() {
        const {sending, noConnection, showError} = this.props;
        return (
            <div className={commentForm()}>
                <form
                    onSubmit={this.handleSubmit}
                    autoComplete="off"
                    className={commentForm('input-group', {sending})}
                    method="post">
                    <textarea
                        onChange={this.handleTextChange}
                        className={['input', commentForm('text-field', {sending})].join(' ')}
                        maxLength={300}
                        placeholder={CommentFormStrings.placeholder}
                        name="comment"
                        value={this.props.text}
                        rows={this.props.rows}>
                    </textarea>
                    <button type="submit" disabled={sending} className={commentForm('button', {submit: true})}>
                        {CommentFormStrings.sendComment}
                    </button>
                </form>
                <div className={commentForm('message', {visibale: showError})}>
                    {noConnection ? CommentFormStrings.noConnection : CommentFormStrings.dispatchFailed}
                </div>
            </div>
        );
    }
}
