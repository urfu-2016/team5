import React from 'react';
import './CommentForm.css';
import b from 'b_';
import './../Input.css';
import {CommentFormStrings} from './../../constants/strings';
import {CommentFormConstants} from './../../constants/constants';

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
        const {sending, noConnection, showError, text, rows} = this.props;
        const readyToSend = text.length !== 0 && !sending;

        return (
            <div className={commentForm()}>
                <form
                    onSubmit={this.handleSubmit}
                    autoComplete="off"
                    className={commentForm('input-group')}
                    method="post">
                    <textarea
                        onChange={this.handleTextChange}
                        className={['input', commentForm('text-field', {sending})].join(' ')}
                        disabled={sending}
                        maxLength={CommentFormConstants.maxLength}
                        placeholder={CommentFormStrings.placeholder}
                        name="comment"
                        value={text}
                        rows={rows}>
                    </textarea>
                    <button type="submit"
                        disabled={!readyToSend}
                        className={commentForm('button', {readyToSend, sending})}>
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
