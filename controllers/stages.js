'use strict';

const httpStatus = require('http-status-codes');
const Quest = require('../models/quest');
const Stage = require('../models/stage');
const config = require('config');
const constants = require('../constants/controllers');
const {NotFoundError, BadRequestError} = require('../libs/customErrors/errors');
const cloudinary = require('../libs/cloudinary');

function getStageData(req, cloudinaryFile) {
    return {
        src: config.mode === 'production' ? cloudinaryFile.secure_url : cloudinaryFile.url,
        cloudinaryId: cloudinaryFile.public_id,
        title: req.body.title,
        description: req.body.description || '',
        location: req.body.location || ''
    };
}

function getStageObject(stage) {
    stage = stage.toObject();
    delete stage._id;

    return stage;
}

module.exports = {
    async add(req, res) {
        const quest = await Quest.getBySlug(req.params.slug);
        const file = req.file;

        if (!quest) {
            throw new NotFoundError(constants.quest.questNotFoundErrorMessage);
        }

        if (file) {
            const cloudinaryFile = await cloudinary.upload(file);
            const stageData = getStageData(req, cloudinaryFile);
            try {
                const stage = await quest.addStage(stageData);

                return res.status(httpStatus.OK).send({data: stage});
            } catch (err) {
                await cloudinary.remove(cloudinaryFile.public_id);

                throw new BadRequestError(err.message);
            }
        }

        throw new BadRequestError(constants.file.notFoundMessage);
    },

    async getAllByQuest(req, res) {
        try {
            const quest = await Quest.getBySlug(req.params.slug);
            const stages = (await quest.getStages()).map(getStageObject);

            res.status(httpStatus.OK).send({data: stages});
        } catch (err) {
            throw new NotFoundError(constants.quest.questNotFoundErrorMessage);
        }
    },

    async update(req, res) {
        const stageId = req.params.stageId;
        let stage = await Stage.getByShortId(stageId);
        const file = req.file;
        const stageData = {
            title: req.body.title,
            description: req.body.description,
            location: req.body.location
        };

        if (!stage) {
            throw new NotFoundError(constants.stage.notFoundMessage);
        }

        if (file) {
            if (stage.cloudinaryId) {
                await cloudinary.remove(stage.cloudinaryId);
            }
            const cloudinaryFile = await cloudinary.upload(file);
            stageData.src = cloudinaryFile.url;
            stageData.cloudinaryId = cloudinaryFile.public_id;
        }

        try {
            stage = await Stage.update(stageId, stageData);

            res.status(httpStatus.OK).send({data: stage});
        } catch (err) {
            throw new BadRequestError(err.message);
        }
    },

    async remove(req, res) {
        const quest = await Quest.getBySlug(req.params.slug);
        const stageId = req.params.stageId;
        const cloudinaryId = await Stage.getByShortId(stageId);
        const stage = await quest.removeStage(stageId);

        if (!stage) {
            throw new NotFoundError(constants.stage.notFoundMessage);
        }

        cloudinary.remove(cloudinaryId);

        res.status(httpStatus.OK).send();
    },

    async getById(req, res) {
        const stageId = req.params.stageId;
        const stage = await Stage.getByShortId(stageId);
        if (!stage) {
            throw new NotFoundError(constants.stage.notFoundMessage);
        }

        res.status(httpStatus.OK).send({data: stage});
    }
};
