import mongoose from 'mongoose'
import AppError from '../AppError'
import {validate, estimationEstimatorAddFeatureStruct} from "../validation"
import * as SC from "../serverconstants"
import {userHasRole} from "../utils"
import {EstimationModel, RepositoryModel} from "./"
import * as EC from "../errorcodes"
import _ from 'lodash'

mongoose.Promise = global.Promise

let estimationFeatureSchema = mongoose.Schema({
    status: {type: String, enum: [SC.STATUS_APPROVED, SC.STATUS_PENDING], required: true, default: SC.STATUS_PENDING},
    owner: {type: String, enum: [SC.OWNER_ESTIMATOR, SC.OWNER_NEGOTIATOR], required: true},
    addedInThisIteration: {type: Boolean, required: true},
    initiallyEstimated: {type: Boolean, required: true},
    isDeleted: {type: Boolean, default: false},
    created: Date,
    updated: Date,
    estimation: {
        _id: {type: mongoose.Schema.ObjectId, required: true}
    },
    repo: {
        _id: mongoose.Schema.ObjectId,
        addedFromThisEstimation: {type: Boolean, required: true}
    },
    estimator: {
        name: {type: String, required: true},
        description: {type: String, required: true},
        estimatedHours: {type: Number, required: true},
        changeRequested: {type: Boolean, default: false},
        removalRequested: {type: Boolean, default: false},
        isChangedInThisIteration: {type: Boolean, default: false}
    },
    negotiator: {
        name: {type: String},
        description: {type: String},
        estimatedHours: {type: Number},
        changeRequested: {type: Boolean, default: false},
        removalRequested: {type: Boolean, default: false},
        isChangedInThisIteration: {type: Boolean, default: false}
    },
    technologies: [String],
    tags: [String],
    notes: [{
        name: {type: String, required: true},
        note: {type: String, required: true},
        date: {type: Date, default: Date.now()}
    }]
})


estimationFeatureSchema.statics.addFeatureByEstimator = async (featureInput, estimator) => {
    validate(featureInput, estimationEstimatorAddFeatureStruct)
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
    let estimation = await EstimationModel.findById(featureInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as ["+estimation.status+"]. Estimator can only add feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let repositoryFeature = undefined

    if (featureInput.repo && featureInput.repo._id) {
        // Feature is added from repository
        // find if Feature actually exists there
        repositoryFeature = await RepositoryModel.findById(featureInput.repo._id)
        if (!repositoryFeature)
            throw new AppError('Feature not part of repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        // as this feature was found in repository, this means that this is already part of repository
        featureInput.repo = {
            addedFromThisEstimation: false,
            _id: repositoryFeature._id
        }
    } else {
        /**
         * As no repo id is sent, this means that this is a new feature, hence save this feature into repository
         * @type {{addedFromThisEstimation: boolean}}
         */

        repositoryFeature = await RepositoryModel.addFeature({
            name: featureInput.name,
            description: featureInput.description,
            estimation: {
                _id: estimation._id.toString()
            },
            createdBy: estimator,
            technologies: featureInput.technologies,
            tags: featureInput.tags
        }, estimator)

        featureInput.repo = {
            _id: repositoryFeature._id,
            addedFromThisEstimation: true
        }
    }

    // create estimator section

    let estimatorSection = {}
    let defaultEstimatedHoursForFeature = 0;
    /* Name/description would always match repository name description */

    estimatorSection.name = repositoryFeature.name
    estimatorSection.description = repositoryFeature.description
    estimatorSection.estimatedHours = defaultEstimatedHoursForFeature

    featureInput.status = SC.STATUS_PENDING
    featureInput.addedInThisIteration = true
    featureInput.owner = SC.OWNER_ESTIMATOR
    featureInput.initiallyEstimated = true
    featureInput.estimator = estimatorSection

    if (!_.isEmpty(featureInput.notes)) {
        featureInput.notes = featureInput.notes.map(n => {
            n.name = estimator.fullName
            return n
        })
    }

    return await EstimationFeatureModel.create(featureInput)

}


const EstimationFeatureModel = mongoose.model("EstimationFeature", estimationFeatureSchema)
export default EstimationFeatureModel