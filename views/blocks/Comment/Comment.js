import React from 'react';
import b from 'b_';

export default class Comment extends React.Component {
    render() {
        const {author, date, text} = this.props;

        return (
            <div className={b('comment')}>
                <div className={b('comment', 'author')}>
                    {author}
                </div>
                <div className={b('comment', 'date')}>
                    {date}
                </div>
                <div className={b('comment', 'text')}>
                    {text}
                </div>
            </div>
        );
    }
}
