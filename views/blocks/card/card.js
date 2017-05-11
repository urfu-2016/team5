import React from 'react';
import './card.css';
import b from 'b_';

const card = b.lock('quest-card');

export default class Card extends React.Component {
    render() {
        const {isCreator, quest} = this.props;

        const date = new Date(quest.createdAt).toDateString();

        return (
            <article className={'quest-card'}>
                <div>
                    <div>
                        <h3 className={card('title')}>{quest.title}</h3>
                        {isCreator &&
                            <a className={card('change-quest')} href="/">Изменить</a>
                        }
                    </div>
                    <div className={card('info')}>
                        <span className={card('author')}>
                            {quest.author}
                        </span> / <span className={card('date')}>
                            {date}
                        </span>
                    </div>
                </div>
                <div className={card('group')}>
                    <div>
                        <p className={card('description')}>
                            {quest.description}
                        </p>
                        <div>
                            {quest.city}
                        </div>
                    </div>
                </div>
            </article>
        );
    }
}
