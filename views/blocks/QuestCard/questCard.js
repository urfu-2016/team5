import React from 'react';
import './questCard.css';
import {QuestCardStrings} from './../../constants/strings';
import b from 'b_';
const questCard = b.with('mini-quest-card');
const stat = b.with('statistics');

class Card extends React.Component {
    render() {
        const {card} = this.props;

        return (
            <article className={questCard()}>
                <div className={`${questCard('title-image')} ${b('title-image')}`}>
                    <img className={b('title-image', 'img')} src={card.images[0].src}></img>
                    <div className={b('title-image', 'caption')}>
                        <h3 className={questCard('title')}>{card.title}</h3>
                    </div>
                </div>
                <p className={questCard('city')}>
                    <span>{QuestCardStrings.city} {card.city}</span>
                </p>
                <p className={questCard('author')}>
                    <span>{QuestCardStrings.author} {card.author}</span>
                </p>
                <p className={questCard('tags')}>
                    {card.tags.map(tag =>
                        <span key={tag} className={b('tag', 'link')}>{tag}</span>)}
                </p>
                <div className={`${questCard('statistics')} ${stat()}`}>
                    <span className={stat('count', {images: true})}>{card.commentsCount} {card.images.length}</span>
                    <span className={stat('count', {likes: true})}>{card.likes.length}</span>
                    <span className={stat('count', {comments: true})}>&#128173; 0</span>
                </div>
                <a className={questCard('link', {yellow: true})} href={`/quests/${card.slug}`}>Посмотреть</a>
            </article>
        );
    }
}

export default Card;
