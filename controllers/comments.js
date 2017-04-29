'use strict';

const httpStatus = require('http-status-codes');
const Quest = require('../models/quest');
const constants = require('../constants/controllers');
const errors = require('../libs/customErrors/errors');

async function getCommentObject(comment, currentUser) {
    const author = (await comment.populate('author')).author;
    const username = currentUser ? currentUser.username : undefined;
    const liked = await comment.likedBy(username);
    const isAuthor = author.equals(currentUser._id);

    return {
        message: comment.message,
        author: author.username,
        date: comment.formattedDate,
        likesCount: comment.likesCount,
        liked, isAuthor
    };
}

module.exports = {
    async createComment(req, res, next) {
        try {
            const quest = await Quest.getBySlug(req.params.slug);
            let comment = await quest.addComment(req.user, req.body.text);
            comment = await getCommentObject(comment, req.user);

            res.status(httpStatus.CREATED).send({data: comment});
        } catch (err) {
            next(new errors.BadRequestError(err.message));
        }
    },

    async getComments(req, res, next) {
        const quest = await Quest.getBySlug(req.params.slug);
        if (quest === null) {
            return next(new errors.NotFoundError(constants.quest.questNotFoundErrorMessage));
        }
        let comments = await quest.getComments();
        comments = await Promise.all(
            comments.map(quest => getCommentObject(quest, req.user))
        );

        res.status(httpStatus.OK).send({data: comments});
    },

    async getCommentByPosition(req, res, next) {
        const position = Number(req.params.position);
        const quest = await Quest.getBySlug(req.params.slug);
        const comments = await quest.getComments();
        if (position >= comments.length) {
            return next(new errors.NotFoundError(constants.quest.questNotFoundErrorMessage));
        }
        const data = await getCommentObject(comments[position], req.user);

        res.status(httpStatus.OK).send({data});
    },

    async removeComment(req, res, next) {
        const position = Number(req.params.position);
        const quest = await Quest.getBySlug(req.params.slug);
        const comments = await quest.getComments();
        if (position >= comments.length) {
            return next(new errors.NotFoundError(constants.quest.questNotFoundErrorMessage));
        }
        const comment = comments[req.params.position];
        if (!(await comment.createdBy(req.user.username))) {
            return next(new errors.BadRequestError(constants.auth.permissionDenied));
        }
        await quest.removeComment(position);

        res.status(httpStatus.OK).send();
    },

    async likeComment(req, res, next) {
        const position = Number(req.params.position);
        const quest = await Quest.getBySlug(req.params.slug);
        const comments = await quest.getComments();
        if (position >= comments.length) {
            return next(new errors.NotFoundError(constants.quest.questNotFoundErrorMessage));
        }
        await comments[position].like(req.user);

        res.status(httpStatus.OK).send();
    }
};
