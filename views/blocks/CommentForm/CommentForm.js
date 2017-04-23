import React from 'react';
import './CommentForm.css';
import b from 'b_';

export default class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onAction(this.props.text);
    }

    render() {
        return (
            <div className={b('comment-form')}>
                <form onSubmit={this.handleSubmit}
                    acceptCharset="utf-8"
                    action="#"
                    autoComplete="off"
                    method="post">
                    <textarea
                        onChange={this.props.onChangeText}
                        className={b('comment-form', 'textField')}
                        form=""
                        maxLength={300}
                        placeholder="Напишите комментарий :)"
                        name="comment"
                        value={this.props.text}>
                    </textarea>
                    <input type="reset" value="Очистить"></input>
                    <button type="submit">Отправить</button>
                </form>
                {this.props.noConnection &&
                    <div className={b('comment-form', 'message', {noConnection: true})}>
                        Коменнтарий не был отправлен, проверьте состояние сети.
                    </div>
                }
            </div>
        );
    }
}
