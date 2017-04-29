import React from 'react';
import b from 'b_';
import './Likes.css';

const likeCounter = b.lock('like-counter');

export default class Likes extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onLike();
        this.props.onAction();
    }

    render() {
        const {liked, likesCount, disabledLike} = this.props;
        return (
            <div className={likeCounter()}>
                <button className={[likeCounter('button', {liked: !disabledLike && liked}), 'button_icon'].join(' ')}
                    disabled={disabledLike} onClick={this.handleClick}>
                        <i className={'fa fa-heart'} aria-hidden={true}></i>
                        <span className={likeCounter('value')}>{likesCount}</span>
                </button>
            </div>);
    }
}
