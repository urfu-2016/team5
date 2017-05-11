import './quests-id.css';
import './../../styles/block/block.css';

import React from 'react';
import ReactDOM from 'react-dom';
import QuestContainer from '../../blocks/Quest/QuestContainer';

import CommentsPoster from '../../blocks/comments/CommentsPoster';
import PhotoSender from '../../blocks/QuestPhotos/PhotoSender';
import QuestSender from '../../blocks/Quest/QuestSender';

const contentRoot = document.getElementById('content-root');
const slug = contentRoot.dataset.slug;

CommentsPoster.setSlug(slug);
PhotoSender.setSlug(slug);
QuestSender.setSlug(slug);

const isAuth = Boolean(Number(contentRoot.dataset.isAuth));
const isCreator = isAuth && Boolean(Number(contentRoot.dataset.isCreator));
const isPlaying = isAuth && Boolean(Number(contentRoot.dataset.isPlaying));

const user = {isAuth, isCreator, isPlaying};

ReactDOM.render(
    <QuestContainer user={user} />,
    contentRoot
);
