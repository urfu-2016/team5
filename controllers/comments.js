'use strict';

const httpStatus = require('http-status-codes');
const Quest = require('../models/quest');
const Comment = require('../models/comment');
const constants = require('../constants/controllers');
const errors = require('../libs/customErrors/errors');

async function getCommentObject(comment, currentUser) {
    const author = (await comment.populate('author')).author;
    const username = currentUser ? currentUser.username : undefined;
    const liked = await comment.likedBy(username);
    const isAuthor = currentUser && author.equals(currentUser._id);

    return {
        id: comment.shortid,
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

    async getCommentById(req, res, next) {
        const quest = await Quest.getBySlug(req.params.slug);
        const commentId = quest.comments.find(comment => comment === req.params.id);
        if (!commentId) {
            return next(new errors.NotFoundError(constants.quest.questNotFoundErrorMessage));
        }
        const comment = await Comment.findOne({shortid: commentId});
        const data = await getCommentObject(comment, req.user);

        res.status(httpStatus.OK).send({data});
    },

    async removeComment(req, res, next) {
        const quest = await Quest.getBySlug(req.params.slug);
        const commentId = quest.comments.find(comment => comment === req.params.id);
        if (!commentId) {
            return next(new errors.NotFoundError(constants.comment.notFoundMessage));
        }
        const comment = await Comment.findOne({shortid: commentId});
        if (!(await comment.createdBy(req.user.username))) {
            return next(new errors.BadRequestError(constants.auth.permissionDenied));
        }
        await quest.removeComment(commentId);

        res.status(httpStatus.OK).send();
    },

    async likeComment(req, res, next) {
        const quest = await Quest.getBySlug(req.params.slug);
        const commentId = quest.comments.find(comment => comment === req.params.id);
        if (!commentId) {
            return next(new errors.NotFoundError(constants.comment.notFoundMessage));
        }
        const comment = await Comment.findOne({shortid: commentId});
        await comment.like(req.user);

        res.status(httpStatus.OK).send();
    }
};
