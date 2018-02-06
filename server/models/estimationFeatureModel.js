import mongoose from 'mongoose'
import AppError from '../AppError'
import {
    validate,
    estimationEstimatorAddFeatureStruct,
    estimationNegotiatorAddFeatureStruct,
    estimationEstimatorUpdateFeatureStruct
} from "../validation"
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
        name: {type: String},
        description: {type: String},
        estimatedHours: {type: Number},
        changeRequested: {type: Boolean, default: false},
        removalRequested: {type: Boolean, default: false},
        changedInThisIteration: {type: Boolean, default: false}
    },
    negotiator: {
        name: {type: String},
        description: {type: String},
        estimatedHours: {type: Number},
        changeRequested: {type: Boolean, default: false},
        changedInThisIteration: {type: Boolean, default: false},
        changeGranted: {type: Boolean, default: false},
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
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only add feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

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

estimationFeatureSchema.statics.addFeatureByNegotiator = async (featureInput, negotiator) => {
    validate(featureInput, estimationNegotiatorAddFeatureStruct)
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
    let estimation = await EstimationModel.findById(featureInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only add task into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

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
            createdBy: negotiator,
            technologies: featureInput.technologies,
            tags: featureInput.tags
        }, negotiator)

        featureInput.repo = {
            _id: repositoryFeature._id,
            addedFromThisEstimation: true
        }
    }

    // create negotiator section

    let negotiatorSection = {}
    let defaultEstimatedHoursForFeature = 0;
    /* Name/description would always match repository name description */

    negotiatorSection.name = repositoryFeature.name
    negotiatorSection.description = repositoryFeature.description
    negotiatorSection.estimatedHours = defaultEstimatedHoursForFeature

    featureInput.status = SC.STATUS_PENDING
    featureInput.addedInThisIteration = true
    featureInput.owner = SC.OWNER_NEGOTIATOR
    featureInput.initiallyEstimated = true
    featureInput.negotiator = negotiatorSection

    if (!_.isEmpty(featureInput.notes)) {
        featureInput.notes = featureInput.notes.map(n => {
            n.name = negotiator.fullName
            return n
        })
    }

    return await EstimationFeatureModel.create(featureInput)
}


estimationFeatureSchema.statics.updateFeatureByEstimator = async (featureInput, estimator) => {
    validate(featureInput, estimationEstimatorUpdateFeatureStruct)

    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let estimationFeature = await EstimationFeatureModel.findById(featureInput._id)
    if (!estimationFeature)
        throw new AppError('Estimation feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": estimationFeature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only update feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('You are not estimator of this estimation', EC.INVALID_USER, EC.HTTP_FORBIDDEN)

    /**
     * Check to see if this task is added by estimator or not
     */
    if (estimationFeature.owner == SC.OWNER_ESTIMATOR && !estimationFeature.addedInThisIteration && !estimationFeature.negotiator.changeRequested && !estimationFeature.negotiator.changeGranted) {
        // this means that estimator has added this feature in past iteration and negotiator has not given permission to edit this feature
        throw new AppError('Not allowed to update feature as Negotiator has not granted permission', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
    } else if (estimationFeature.owner == SC.OWNER_NEGOTIATOR && !estimationFeature.negotiator.changeRequested && !estimationFeature.negotiator.changeGranted) {
        // this means that negotiator is owner of this feature and has not given permission to edit this feature
        throw new AppError('Not allowed to update feature as Negotiator has not granted permission', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
    }


    estimationFeature.technologies = featureInput.technologies
    estimationFeature.tags = featureInput.tags

    if (!_.isEmpty(featureInput.notes)) {
        featureInput.notes = featureInput.notes.map(n => {
            n.name = estimator.fullName
            return n
        })
    }
    let mergeAllNotes = estimationFeature.notes
    if (!_.isEmpty(mergeAllNotes)) {
        featureInput.notes.map(n => {
            mergeAllNotes.push(n)
        })
    } else {
        mergeAllNotes = featureInput.notes
    }
    estimationFeature.notes = mergeAllNotes
    estimationFeature.estimator.name = featureInput.name
    if (!estimationFeature.addedInThisIteration || estimationFeature.owner != SC.OWNER_ESTIMATOR)
        estimationFeature.estimator.changedInThisIteration = true
    estimationFeature.estimator.description = featureInput.description
    estimationFeature.updated = Date.now()

    if (estimationFeature.repo && estimationFeature.repo._id) {
        await RepositoryModel.updateFeature({
            _id: estimationFeature.repo._id.toString(),
            estimation: {
                _id: estimationFeature.estimation._id.toString()
            },
            name: featureInput.name,
            description: featureInput.description,
            technologies: featureInput.technologies,
            tags: featureInput.tags
        }, estimator)
    }
    return await estimationFeature.save()
}

const EstimationFeatureModel = mongoose.model("EstimationFeature", estimationFeatureSchema)
export default EstimationFeatureModel