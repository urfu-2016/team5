/* global React:true */

import './questCard.css';

class Card extends React.Component {
    render() {
        return (
            <article className="mini-quest-card">
                <div className="mini-quest-card__title-image title-image">
                    <img className="title-image__img" src={this.props.card.images[0].src}></img>
                    <div className="title-image__caption">
                        <h3 className="mini-quest-card__title">{this.props.card.title}</h3>
                    </div>
                </div>
                <p className="mini-quest-card__city">
                    {this.props.card.city}
                </p>
                <p className="mini-quest-card__author">
                    {this.props.card.author}
                </p>
                <div className="mini-quest-card__tags">
                    {this.props.card.tags.map(tag => <span className="tag tag_link">{tag}</span>)
                    }
                </div>
                <div className="mini-quest-card__statistics statistics">
                    <span className="statistics__count statistics__count_images">&#128173; {this.props.card.imagesCount}</span>
                    <span className="statistics__count statistics__count_likes">{this.props.card.likesCount}</span>
                    <span className="statistics__count statistics__count_comments">{this.props.card.commentsCount}</span>
                </div>
                <a className="mini-quest-card__link mini-quest-card__link_yellow" href={`/quests/${this.props.card.slug}`}></a>
            </article>
        );
    }
}

export default Card;
