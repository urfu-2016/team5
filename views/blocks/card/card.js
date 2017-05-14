import React from 'react';
import './card.css';
import b from 'b_';

const card = b.lock('quest-card');

export default class Card extends React.Component {
    render() {
        const {isCreator, quest} = this.props;

        const date = new Date(quest.createdAt).toDateString();

        return (
            <article className={card()}>
                <div className={card('header')}>
                    <div>
                        <h3 className={card('title')}>{quest.title}</h3>
                        {isCreator &&
                            <a className={card('change-quest')} href="/">Изменить</a>
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
                        <table className={card('additional-info')} cellSpacing={'10'}>
                            <tr>
                                <td>Город:</td>
                                <td>{quest.city}</td>
                            </tr>
                            <tr>
                                <td>Картинок:</td>
                                <td>{quest.imagesCount}</td>
                            </tr>
                            <tr>
                                <td>Протяженность:</td>
                                 <td>{'56км'}</td>
                            </tr>
                        </table>
                </div>
            </article>
        );
    }
}
