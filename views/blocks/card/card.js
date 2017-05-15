import React from 'react';
import './card.css';
import b from 'b_';
import LikesContainer from './../Likes/LikesContainer';
import QuestSender from '../Quest/QuestSender';
import '../../styles/card/__tags/card__tags.css';

const card = b.lock('quest-card');

export default class Card extends React.Component {
    render() {
        const {user, quest} = this.props;

        const date = new Date(quest.createdAt).toDateString();

        return (
            <article className={card()}>
                <div className={card('header')}>
                    <div>
                        <h3 className={card('title')}>{quest.title}</h3>
                        {user.isCreator &&
                            <a className={card('link')} href={`./${quest.slug}/edit`}>Изменить</a>
                        }
                    </div>
                    <div className={card('creating')}>
                        <span className={card('author')}>
                            {quest.author}
                        </span> / <span className={card('date')}>
                            {date}
                        </span>
                    </div>
                </div>
                <div className={card('data')}>
                    <p className={card('description')}>
                        {quest.description}
                    </p>
                    <div className={card('additional-info')}>
                        <p>
                            Город: {quest.city}
                        </p>
                        <p>
                            Картинок: {quest.imagesCount}
                        </p>
                    </div>
                </div>
                <div className={card('controls')}>
                    <ul className={[card('tags'), 'card__tags'].join(' ')}>
                        {quest.tags.map(tag => (
                            <a key={tag} href={`./?type=tag&tag=${tag}`}>{tag}</a>
                        ))}
                    </ul>
                    <div className={card('button', {like: true})}>
                        <LikesContainer
                            getSendOptions={QuestSender.likeQuest}
                            liked={quest.liked}
                            likesCount={quest.likesCount}
                            disabledLike={!user.isAuth}
                        />
                    </div>
                </div>
            </article>
        );
    }
}
