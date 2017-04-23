require('./quests-id.css');
import React from 'react';
import ReactDOM from 'react-dom';
import Comments from '../../blocks/comments/comments';
import CommentsPoster from '../../blocks/CommentsPoster.js';

const commentsRoot = document.getElementById('comments-root');

CommentsPoster.setSlug(commentsRoot.dataset.slug);

ReactDOM.render(
    <Comments isAuth={true}/>,
    document.getElementById('comments-root')
);
