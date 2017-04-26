'use strict';

const httpStatus = require('http-status-codes');
const Comment = require('../models/comment');
const constants = require('../constants/controllers');
const errors = require('../libs/customErrors/errors');

async function getCommentObject(comment, currentUser) {
    const author = (await comment.populate('author')).author;
    const username = currentUser ? currentUser.username : undefined;
    const liked = await comment.likedBy(username);
    const isAuthor = await comment.createdBy(username);

    return {
        id: comment.id,
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
            let comment = await Comment.create(req.user, req.body.text);
            comment = await getCommentObject(comment, req.user);

            res.status(httpStatus.CREATED).send({data: comment});
        } catch (err) {
            next(new errors.BadRequestError(err.message));
        }
    },

    async getComments(req, res) {
        let comments = await Comment.getAll();
        comments = await Promise.all(
            comments.map(quest => getCommentObject(quest, req.user))
        );

        res.status(httpStatus.OK).send({data: comments});
    },

    async getCommentById(req, res, next) {
        let comment = await Comment.findById(req.params.id);
        comment = await getCommentObject(comment, req.user);

        if (comment === null) {
            return next(new errors.NotFoundError(constants.quest.questNotFoundErrorMessage));
        }

        res.status(httpStatus.OK).send({data: comment});
    },

    async removeComment(req, res, next) {
        const comment = await Comment.findById(req.params.id);
        if (!(await comment.createdBy(req.user.username))) {
            return next(new errors.BadRequestError(constants.auth.permissionDenied));
        }
        const result = await Comment.delete(req.params.id);
        if (result === null) {
            return next(new errors.NotFoundError(constants.comment.notFoundMessage));
        }

        res.status(httpStatus.OK).send();
    },

    async likeComment(req, res) {
        const comment = await Comment.findById(req.params.id);
        await comment.like(req.user);

        res.status(httpStatus.OK).send();
    }
};
