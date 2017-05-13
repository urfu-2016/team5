import React from 'react';
require('../../styles/card/card');

export default class Card extends React.Component {
    render() {
        const {card} = this.props;

        return (
            <div className="card">
                <div className="card__image">
                    <img src={card.images[0].src} className="img-fluid" alt=""></img>
                    <a href={`/quests/${card.slug}`}>
                        <div className="mask"></div>
                    </a>
                </div>
                <div className="card__content">
                    <h4 className="card__title">{card.title}</h4>
                </div>
                <div className="card__data">
                    <ul>
                        <li className="float_left"><i className="fa fa-clock-o"></i>{card.dateOfCreation}</li>
                        <li className="float_right"><i className="fa fa-comments-o"></i>{card.commentsCount}</li>
                        <li className="float_right"><i className="fa fa-heart like"></i>{card.likesCount}</li>
                    </ul>
                </div>
            </div>
        );
    }
}
