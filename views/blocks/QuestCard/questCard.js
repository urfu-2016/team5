import React from 'react';
import './questCard.css';
import b from 'b_';
const cardS = b.with('mini-quest-card');
const stat = b.with('statistics');

class Card extends React.Component {
    render() {
        const {card} = this.props;

        return (
            <article className={cardS()}>
                <div className={`${cardS('title-image')} ${b('title-image')}`}>
                    <img className={b('title-image', 'img')} src={card.images[0].src}></img>
                    <div className={b('title-image', 'caption')}>
                        <h3 className={cardS('title')}>{card.title}</h3>
                    </div>
                </div>
                <p className={cardS('city')}>
                    <span>Город: {card.city}</span>
                </p>
                <p className={cardS('author')}>
                    <span>Автор: {card.author}</span>
                </p>
                <p className={cardS('tags')}>
                    {card.tags.map(tag =>
                        <span key={tag} className={b('tag', 'link')}>{tag}</span>)}
                </p>
                <div className={`${cardS('statistics')} ${stat()}`}>
                    <span className={stat('count', {images: true})}>{card.commentsCount} {card.images.length}</span>
                    <span className={stat('count', {likes: true})}>{card.likes.length}</span>
                    <span className={stat('count', {comments: true})}>&#128173; 0</span>
                </div>
                <a className={cardS('link', {yellow: true})} href={`/quests/${card.slug}`}>Посмотреть</a>
            </article>
        );
    }
}

export default Card;
