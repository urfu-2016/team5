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
const isCreator = Boolean(Number(contentRoot.dataset.isCreator));
const started = Boolean(Number(contentRoot.dataset.isPlaying));
const finished = Boolean(Number(contentRoot.dataset.isFinished));

const user = {
    isAuth,
    isCreator: isAuth && isCreator,
    started: isAuth && started,
    finished: isAuth && finished
};

const existGeolocation = navigator.geolocation !== undefined;

ReactDOM.render(
    <QuestContainer user={user} existGeolocation={existGeolocation}/>,
    contentRoot
);
