require('./quests-id.css');
import './../../styles/block/block.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Comments from '../../blocks/comments/comments';
import CommentsPoster from '../../blocks/comments/CommentsPoster.js';

const commentsRoot = document.getElementById('comments-root');

CommentsPoster.setSlug(commentsRoot.dataset.slug);

ReactDOM.render(
    <Comments isAuth={commentsRoot.dataset.isAuth}/>,
    document.getElementById('comments-root')
);
