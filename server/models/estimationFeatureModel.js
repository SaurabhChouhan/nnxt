import mongoose from 'mongoose'
import AppError from '../AppError'
import * as V from "../validation"
import * as SC from "../serverconstants"
import {userHasRole} from "../utils"
import * as MDL from "./"
import * as EC from "../errorcodes"
import _ from 'lodash'

mongoose.Promise = global.Promise

let estimationFeatureSchema = mongoose.Schema({
    status: {type: String, enum: [SC.STATUS_APPROVED, SC.STATUS_PENDING], required: true, default: SC.STATUS_PENDING},
    owner: {type: String, enum: [SC.OWNER_ESTIMATOR, SC.OWNER_NEGOTIATOR], required: true},
    addedInThisIteration: {type: Boolean, required: true},
    canApprove: {type: Boolean, default: false},
    hasError: {type: Boolean, default: true},
    initiallyEstimated: {type: Boolean, required: true},
    isDeleted: {type: Boolean, default: false},
    created: Date,
    updated: Date,
    estimation: {
        _id: {type: mongoose.Schema.ObjectId, required: true}
    },
    repo: {
        _id: mongoose.Schema.ObjectId,
        addedFromThisEstimation: {type: Boolean, required: false}
    },
    estimator: {
        name: {type: String},
        description: {type: String},
        estimatedHours: {type: Number, default: 0},
        changeRequested: {type: Boolean, default: false},
        changedKeyInformation: {type: Boolean, default: false},
        removalRequested: {type: Boolean, default: false},
        changedInThisIteration: {type: Boolean, default: false},
        requestedInThisIteration: {type: Boolean, default: false}
    },
    negotiator: {
        name: {type: String},
        description: {type: String},
        estimatedHours: {type: Number, default: 0},
        changeSuggested: {type: Boolean, default: false},
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


estimationFeatureSchema.statics.getById = async (featureID) => {
    return await EstimationFeatureModel.findById(featureID)
}


// add feature
estimationFeatureSchema.statics.addFeature = async (featureInput, user, schemaRequested) => {
    if (!featureInput || !featureInput.estimation || !featureInput.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    let role = await MDL.EstimationModel.getUserRoleInEstimation(featureInput.estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        if (schemaRequested)
            return V.generateSchema(V.estimationEstimatorAddFeatureStruct)
        return await addFeatureByEstimator(featureInput, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        if (schemaRequested)
            return V.generateSchema(V.estimationNegotiatorAddFeatureStruct)
        return await addFeatureByNegotiator(featureInput, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}


// add feature by estimator
const addFeatureByEstimator = async (featureInput, estimator) => {
    V.validate(featureInput, V.estimationEstimatorAddFeatureStruct)
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
    let estimation = await MDL.EstimationModel.findById(featureInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only add feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let estimationFeature = new EstimationFeatureModel()
    estimationFeature.estimator.name = featureInput.name
    estimationFeature.estimator.description = featureInput.description
    estimationFeature.estimator.estimatedHours = featureInput.estimatedHours
    estimationFeature.negotiator.estimatedHours = 0
    estimationFeature.status = SC.STATUS_PENDING
    estimationFeature.addedInThisIteration = true
    estimationFeature.canApprove = false
    estimationFeature.owner = SC.OWNER_ESTIMATOR
    estimationFeature.initiallyEstimated = true
    estimationFeature.estimation = featureInput.estimation
    estimationFeature.technologies = estimation.technologies
    // Add repository reference and also note that this task was added into repository from this estimation
    estimationFeature.repo = {}
    //estimationFeature.repo._id = repositoryFeature._id
    estimationFeature.repo.addedFromThisEstimation = true
    if ((!estimationFeature.estimator.estimatedHours || estimationFeature.estimator.estimatedHours == 0)
        || _.isEmpty(estimationFeature.estimator.name)
        || _.isEmpty(estimationFeature.estimator.description)) {
        estimationFeature.hasError = true
    } else estimationFeature.hasError = false
    if (!_.isEmpty(featureInput.notes)) {
        estimationFeature.notes = featureInput.notes.map(n => {
            n.name = estimator.fullName
            return n
        })
    }

    return await estimationFeature.save()
}


// add feature by negotiator
const addFeatureByNegotiator = async (featureInput, negotiator) => {
    V.validate(featureInput, V.estimationNegotiatorAddFeatureStruct)
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
    let estimation = await MDL.EstimationModel.findById(featureInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only add feature into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let estimationFeature = new EstimationFeatureModel()
    estimationFeature.negotiator.name = featureInput.name
    estimationFeature.negotiator.description = featureInput.description
    // add feature name/description to estimator section as well as name/description of feature is just for grouping purpose and would not become actual requirement
    estimationFeature.estimator.name = featureInput.name
    estimationFeature.estimator.description = featureInput.description

    estimationFeature.negotiator.estimatedHours = featureInput.estimatedHours
    estimationFeature.estimator.estimatedHours = 0
    estimationFeature.negotiator.changeSuggested = true
    estimationFeature.status = SC.STATUS_PENDING
    estimationFeature.addedInThisIteration = true
    estimationFeature.canApprove = false
    estimationFeature.owner = SC.OWNER_NEGOTIATOR
    estimationFeature.initiallyEstimated = true
    estimationFeature.estimation = featureInput.estimation
    estimationFeature.technologies = estimation.technologies
    // Add repository reference and also note that this task was added into repository from this estimation
    estimationFeature.repo = {}
    //estimationFeature.repo._id = repositoryFeature._id
    estimationFeature.repo.addedFromThisEstimation = true
    // Add name/description into estimator section as well, estimator can review and add estimated hours against this task
    //estimationFeature.estimator.name = featureInput.name
    //estimationFeature.estimator.description = featureInput.description
    if (!_.isEmpty(featureInput.notes)) {
        estimationFeature.notes = featureInput.notes.map(n => {
            n.name = negotiator.fullName
            return n
        })
    }

    await estimationFeature.save()
    estimationFeature = estimationFeature.toObject()
    if (estimation && estimation.canApprove) {
        estimationFeature.isEstimationCanApprove = true
    }
    return estimationFeature
}

// update feature
estimationFeatureSchema.statics.updateFeature = async (featureInput, user, schemaRequested) => {
    if (!featureInput || !featureInput.estimation || !featureInput.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    let role = await MDL.EstimationModel.getUserRoleInEstimation(featureInput.estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        if (schemaRequested)
            return V.generateSchema(V.estimationEstimatorAddFeatureStruct)
        return await updateFeatureByEstimator(featureInput, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        if (schemaRequested)
            return V.generateSchema(V.estimationNegotiatorAddFeatureStruct)
        return await updateFeatureByNegotiator(featureInput, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

// update feature by estimator
const updateFeatureByEstimator = async (featureInput, estimator) => {
    V.validate(featureInput, V.estimationEstimatorUpdateFeatureStruct)

    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let estimationFeature = await EstimationFeatureModel.findById(featureInput._id)
    if (!estimationFeature)
        throw new AppError('Estimation feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": estimationFeature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only update feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('You are not estimator of this estimation', EC.INVALID_USER, EC.HTTP_FORBIDDEN)

    if (featureInput.repo && !featureInput.repo.addedFromThisEstimation)
        throw new AppError('Feature is From Repository ', EC.FEATURE_FROM_REPOSITORY_ERROR)

    /**
     * Check to see if this task is added by estimator or not
     */
    if (estimationFeature.status != SC.STATUS_PENDING) {
        if (estimationFeature.owner == SC.OWNER_ESTIMATOR && !estimationFeature.addedInThisIteration && !estimationFeature.negotiator.changeSuggested && !estimationFeature.negotiator.changeGranted) {
            // this means that estimator has added this feature in past iteration and negotiator has not given permission to edit this feature
            throw new AppError('Not allowed to update feature as Negotiator has not granted permission', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
        } else if (estimationFeature.owner == SC.OWNER_NEGOTIATOR && !estimationFeature.negotiator.changeSuggested && !estimationFeature.negotiator.changeGranted) {
            // this means that negotiator is owner of this feature and has not given permission to edit this feature
            throw new AppError('Not allowed to update feature as Negotiator has not granted permission', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
        }

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
    if (!estimationFeature.addedInThisIteration || estimationFeature.owner != SC.OWNER_ESTIMATOR) {
        estimationFeature.estimator.changedInThisIteration = true
        estimationFeature.estimator.changedKeyInformation = true
    }
    estimationFeature.estimator.description = featureInput.description

    // As estimator has peformed edit, reset changeRequested and grant edit flags
    estimationFeature.estimator.changeRequested = false
    estimationFeature.negotiator.changeGranted = false
    estimationFeature.canApprove = false
    if ((!estimationFeature.estimator.estimatedHours || estimationFeature.estimator.estimatedHours == 0)
        || _.isEmpty(featureInput.name)
        || _.isEmpty(featureInput.description)
        || await MDL.EstimationTaskModel.count({
            "feature._id": estimationFeature._id,
            "estimation._id": estimation._id,
            "isDeleted": false,
            "hasError": true
        }) > 0) {
    } else {
        estimationFeature.hasError = false
    }

    estimationFeature.updated = Date.now()
    return await estimationFeature.save()
}


// update feature by negotiator
const updateFeatureByNegotiator = async (featureInput, negotiator) => {
    V.validate(featureInput, V.estimationNegotiatorUpdateFeatureStruct)

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let estimationFeature = await EstimationFeatureModel.findById(featureInput._id)
    if (!estimationFeature)
        throw new AppError('Estimation feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": estimationFeature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only add feature into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.negotiator._id == negotiator._id)
        throw new AppError('You are not negotiator of this estimation', EC.INVALID_USER, EC.HTTP_FORBIDDEN)

    if (featureInput.repo && !featureInput.repo.addedFromThisEstimation)
        throw new AppError('Feature is From Repository ', EC.FEATURE_FROM_REPOSITORY_ERROR)

    estimationFeature.technologies = featureInput.technologies
    estimationFeature.tags = featureInput.tags

    if (!_.isEmpty(featureInput.notes)) {
        featureInput.notes = featureInput.notes.map(n => {
            n.name = negotiator.fullName
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
    estimationFeature.negotiator.name = featureInput.name
    if (!estimationFeature.addedInThisIteration || estimationFeature.owner != SC.OWNER_NEGOTIATOR)
        estimationFeature.negotiator.changedInThisIteration = true
    estimationFeature.canApprove = false
    estimationFeature.negotiator.description = featureInput.description
    estimationFeature.negotiator.changeSuggested = true // This will allow estimator to see updated changes as suggestions
    estimationFeature.updated = Date.now()
    /*if ((!estimationFeature.estimator.estimatedHours || estimationFeature.estimator.estimatedHours == 0)
        || _.isEmpty(featureInput.name)
        || _.isEmpty(featureInput.description)
        || await MDL.EstimationTaskModel.count({
            "feature._id": estimationFeature._id,
            "estimation._id": estimation._id,
            "isDeleted": false,
            "hasError": true
        }) > 0) {
    } else {
        estimationFeature.hasError = false
    }*/

    if (estimationFeature.repo && estimationFeature.repo._id) {
        await MDL.RepositoryModel.updateFeature({
            _id: estimationFeature.repo._id.toString(),
            estimation: {
                _id: estimationFeature.estimation._id.toString()
            },
            name: featureInput.name,
            description: featureInput.description,
            technologies: featureInput.technologies,
            tags: featureInput.tags
        }, negotiator)
    }
    await estimationFeature.save()
    estimationFeature = estimationFeature.toObject()
    if (estimation && estimation.canApprove) {
        estimationFeature.isEstimationCanApprove = true
    }
    return estimationFeature
}


// approve feature
estimationFeatureSchema.statics.approveFeature = async (featureID, user) => {

    let feature = await EstimationFeatureModel.findById(featureID)
    if (!feature)
        throw new AppError('Estimation feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!feature || !feature.estimation || !feature.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": feature.estimation._id})

    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can approve feature", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await approveFeatureByNegotiator(feature, estimation, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}


// approve feature by negotiator
const approveFeatureByNegotiator = async (feature, estimation, negotiator) => {

    if (!_.includes([SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only approve feature into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.negotiator._id == negotiator._id)
        throw new AppError('You are not negotiator of this estimation', EC.INVALID_USER, EC.HTTP_FORBIDDEN)

    if (!(feature.canApprove))
        throw new AppError('Cannot approve feature as either name/description is not not there or there are pending requests from Estimator', EC.FEATURE_APPROVAL_ERROR, EC.HTTP_FORBIDDEN)

    if (feature.estimator.changeRequested
        || (!feature.estimator.estimatedHours || feature.estimator.estimatedHours == 0)
        || _.isEmpty(feature.estimator.name)
        || _.isEmpty(feature.estimator.description)) {
        throw new AppError('Feature Details are not available at estimator end, cannot approve', EC.FEATURE_APPROVAL_ERROR, EC.HTTP_FORBIDDEN)
    }

    let taskCountOfFeature = await MDL.EstimationTaskModel.count({
        "estimation._id": feature.estimation._id,
        "feature._id": feature._id,
        "isDeleted": false
    })

    if (taskCountOfFeature == 0)
        throw new AppError('There are no tasks in this feature, cannot approve', EC.TASK_APPROVAL_ERROR, EC.HTTP_FORBIDDEN)


    if (!feature.estimator.estimatedHours && !feature.estimator.estimatedHours > 0) {
        throw new AppError('Feature Estimated Hours should be greter than zero', EC.TASK_APPROVAL_ERROR, EC.HTTP_BAD_REQUEST)

    }
    let pendingTaskCountOfFeature = await MDL.EstimationTaskModel.count({
        "estimation._id": feature.estimation._id,
        "feature._id": feature._id,
        "isDeleted": false,
        status: {$in: [SC.STATUS_PENDING]}
    })

    if (pendingTaskCountOfFeature != 0)
        throw new AppError('There are non-approved tasks in this feature, cannot approve', EC.TASK_APPROVAL_ERROR, EC.HTTP_FORBIDDEN)

    if (feature.negotiator.estimatedHours == 0) {
        if (estimation && estimation._id) {
            await MDL.EstimationModel.updateOne({"_id": estimation._id}, {
                $inc: {
                    "suggestedHours": feature.estimator.estimatedHours
                }
            })
        }
    }


    //feature.negotiator.name = feature.estimator.name
    //feature.negotiator.description = feature.estimator.description
    //feature.negotiator.estimatedHours = feature.estimator.estimatedHours


    feature.negotiator.changeSuggested = false
    feature.negotiator.changeGranted = false
    feature.negotiator.changedInThisIteration = false

    feature.estimator.changeRequested = false
    feature.estimator.changedKeyInformation = false
    feature.estimator.removalRequested = false
    feature.estimator.changedInThisIteration = false
    feature.estimator.requestedInThisIteration = false
    feature.canApprove = false
    feature.status = SC.STATUS_APPROVED
    feature.updated = Date.now()
    return await feature.save()
}


//can approve feature
estimationFeatureSchema.statics.canApproveFeature = async (featureID, user) => {

    let feature = await EstimationFeatureModel.findById(featureID)
    if (!feature)
        throw new AppError('Estimation feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!feature || !feature.estimation || !feature.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": feature.estimation._id})

    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can check can-approve feature", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await canApproveFeatureByNegotiator(feature, estimation, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

const canApproveFeatureByNegotiator = async (feature, estimation, negotiator) => {

    if (!_.includes([SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only approve feature into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.negotiator._id == negotiator._id)
        throw new AppError('You are not negotiator of this estimation', EC.INVALID_USER, EC.HTTP_FORBIDDEN)

    let taskCountOfFeature = await MDL.EstimationTaskModel.count({
        "estimation._id": feature.estimation._id,
        "feature._id": feature._id,
        "isDeleted": false
    })

    if (taskCountOfFeature == 0)
        throw new AppError('There are no tasks in this feature, cannot approve', EC.NO_TASKS_ERROR, EC.HTTP_FORBIDDEN)


    if (!feature.estimator.estimatedHours && !feature.estimator.estimatedHours > 0) {
        throw new AppError('Feature Estimated Hours should be greater than zero', EC.NO_ESTIMATED_HOUR_ERROR, EC.HTTP_BAD_REQUEST)
    }

    let pendingTaskCountOfFeature = await MDL.EstimationTaskModel.count({
        "estimation._id": feature.estimation._id,
        "feature._id": feature._id,
        "isDeleted": false,
        status: {$in: [SC.STATUS_PENDING]}
    })

    if (pendingTaskCountOfFeature != 0)
        throw new AppError('There are non-approved tasks in this feature, cannot approve', EC.STILL_PENDING_TASKS_ERROR, EC.HTTP_FORBIDDEN)

    if (feature.estimator.changeRequested
        || (!feature.estimator.estimatedHours || feature.estimator.estimatedHours == 0)
        || _.isEmpty(feature.estimator.name)
        || _.isEmpty(feature.estimator.description)) {
        throw new AppError('Feature Details are not available at estimator end or any flag is open, cannot approve', EC.FEATURE_DETAIL_ERROR, EC.HTTP_FORBIDDEN)
    }


    feature.canApprove = true
    feature.updated = Date.now()
    return await feature.save()
}

//can Not approve feature
estimationFeatureSchema.statics.canNotApproveFeature = async (featureID, isGranted, user) => {

    let feature = await EstimationFeatureModel.findById(featureID)
    if (!feature)
        throw new AppError('Estimation feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!feature || !feature.estimation || !feature.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await  MDL.EstimationModel.findOne({"_id": feature.estimation._id})

    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can change to  can-not-approve feature", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await canNotApproveFeatureByNegotiator(feature, estimation, isGranted, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

const canNotApproveFeatureByNegotiator = async (feature, estimation, isGranted, negotiator) => {

    if (!_.includes([SC.STATUS_REVIEW_REQUESTED, SC.STATUS_INITIATED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only approve task into those estimations where status is in [" + SC.STATUS_REVIEW_REQUESTED + ',' + SC.STATUS_INITIATED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (isGranted) {
        feature.status = SC.STATUS_PENDING
    }
    feature.canApprove = false
    feature.updated = Date.now()
    return await feature.save()
}

estimationFeatureSchema.statics.deleteFeature = async (estimationID, featureID, user) => {

    let feature = await EstimationFeatureModel.findById(featureID)
    if (!feature)
        throw new AppError('Estimation feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!feature || !feature.estimation || !feature.estimation._id || !estimationID)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": estimationID})

    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        return await deleteFeatureByEstimator(estimation, feature, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await deleteFeatureByNegotiator(estimation, feature, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

const deleteFeatureByEstimator = async (estimation, feature, estimator) => {

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only delete feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.estimator._id != estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)


    if (!feature.addedInThisIteration)
        throw new AppError('You are not allowed to delete this feature', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)


    if (estimation && estimation._id) {
        // As task is removed we have to subtract hours ($inc with minus) of this feature from overall estimated hours and suggested hours of estimation

        if (feature.negotiator.estimatedHours && feature.estimator.estimatedHours) {
            await MDL.EstimationModel.updateOne({_id: estimation._id}, {
                $inc: {
                    "estimatedHours": -feature.estimator.estimatedHours,
                    "suggestedHours": -feature.negotiator.estimatedHours
                },
                "canApprove": false
            })

        } else if (feature.estimator.estimatedHours) {
            await MDL.EstimationModel.updateOne({_id: estimation._id}, {
                $inc: {"estimatedHours": -feature.estimator.estimatedHours},
                "canApprove": false
            })
        } else if (feature.negotiator.estimatedHours) {
            await MDL.EstimationModel.updateOne({_id: feature._id}, {
                $inc: {"suggestedHours": -feature.negotiator.estimatedHours},
                "canApprove": false
            })
        }
    }

    await MDL.EstimationTaskModel.update(
        {"feature._id": feature._id},
        {$set: {"status": SC.STATUS_PENDING, "isDeleted": true}},
        {multi: true}).exec()

    feature.isDeleted = true
    feature.estimator.changedInThisIteration = true
    feature.updated = Date.now()
    return await feature.save()
}


const deleteFeatureByNegotiator = async (estimation, feature, negotiator) => {


    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only delete feature into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id != negotiator._id)
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (estimation && estimation._id) {
        // As task is removed we have to subtract hours ($inc with minus) of this feature from overall estimated hours and suggested hours of estimation

        if (feature.negotiator.estimatedHours && feature.estimator.estimatedHours) {
            await MDL.EstimationModel.updateOne({_id: estimation._id}, {
                $inc: {
                    "estimatedHours": -feature.estimator.estimatedHours,
                    "suggestedHours": -feature.negotiator.estimatedHours
                },
                "canApprove": false
            })

        } else if (feature.estimator.estimatedHours) {
            await MDL.EstimationModel.updateOne({_id: estimation._id}, {
                $inc: {"estimatedHours": -feature.estimator.estimatedHours},
                "canApprove": false
            })
        } else if (feature.negotiator.estimatedHours) {
            await MDL.EstimationModel.updateOne({_id: estimation._id}, {
                $inc: {"suggestedHours": -feature.negotiator.estimatedHours},
                "canApprove": false
            })
        }
    }

    await MDL.EstimationTaskModel.update(
        {"feature._id": feature._id},
        {$set: {"status": SC.STATUS_PENDING, "isDeleted": true}},
        {multi: true}).exec()

    feature.isDeleted = true
    feature.negotiator.changedInThisIteration = true
    feature.updated = Date.now()
    return await feature.save()
}

// add feature from repository
estimationFeatureSchema.statics.addFeatureFromRepository = async (estimationID, repoFeatureID, user) => {


    if (!estimationID)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let role = await  MDL.EstimationModel.getUserRoleInEstimation(estimationID, user)
    if (role === SC.ROLE_ESTIMATOR) {
        return await addFeatureFromRepositoryByEstimator(estimationID, repoFeatureID, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await addFeatureFromRepositoryByNegotiator(estimationID, repoFeatureID, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

// add feature from repository by estimator
const addFeatureFromRepositoryByEstimator = async (estimationID, repositoryFeatureID, estimator) => {
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repositoryFeature = await MDL.RepositoryModel.getFeature(repositoryFeatureID)
    if (!repositoryFeature)
        throw new AppError('Feature not found in Repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!repositoryFeature.isFeature)
        throw new AppError('This is not a feature but a task', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    /**
     * TODO: Uncomment this code when feature approve functionality if available in repository
     if (!_.includes([SC.STATUS_APPROVED], repositoryFeature.status))
     throw new AppError('Repository not ready to usable (Not approved)', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
     **/

    if (!Array.isArray(repositoryFeature.tasks) || repositoryFeature.tasks.length === 0) {
        throw new AppError('This feature has no tasks so there is no point adding this feature to estimation')
    }

    let estimation = await MDL.EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only add feature from repository into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let existingFeatureCount = await EstimationFeatureModel.count({
        "repo._id": repositoryFeature._id,
        "isDeleted": false,
        "estimation._id": estimation._id
    })


    if (existingFeatureCount > 0)
        throw new AppError('This feature already added from repository', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    let estimationFeature = new EstimationFeatureModel()

    estimationFeature.status = SC.STATUS_PENDING
    estimationFeature.addedInThisIteration = true
    estimationFeature.canApprove = false
    estimationFeature.owner = SC.OWNER_ESTIMATOR
    estimationFeature.initiallyEstimated = true

    estimationFeature.estimator.name = repositoryFeature.name
    estimationFeature.estimator.description = repositoryFeature.description
    estimationFeature.estimator.estimatedHours = repositoryFeature.estimatedHours ? estimatedHours : 0

    estimationFeature.negotiator.name = repositoryFeature.name
    estimationFeature.negotiator.description = repositoryFeature.description
    estimationFeature.negotiator.estimatedHours = repositoryFeature.estimatedHours ? estimatedHours : 0

    estimationFeature.estimation = estimation
    estimationFeature.repo = {}
    estimationFeature.repo._id = repositoryFeature._id
    estimationFeature.repo.addedFromThisEstimation = false
    estimationFeature.technologies = repositoryFeature.technologies

    let errorTasks = repositoryFeature.tasks.filter(t => {
        if (
            !t.name
            || t.name == undefined
            || t.name == ''
            || !t.description
            || t.description == undefined
            || t.description == ''
            || !t.estimatedHours
            || t.estimatedHours == 0
            || t.estimatedHours == undefined
        ) return true
        else return false
    })
    if (
        errorTasks.length ||
        (repositoryFeature.estimatedHours == 0)
        || _.isEmpty(repositoryFeature.name)
        || _.isEmpty(repositoryFeature.description)) {

        estimationFeature.hasError = true
    } else {

        estimationFeature.hasError = false
    }


    // Iterate on tasks and add all the tasks into estimation

    let estimationTaskPromises = repositoryFeature.tasks.map(async repositoryTask => {
        let estimationTask = new MDL.EstimationTaskModel()
        // As task is added from repository its information can directly be copied into estimator section (even if it is being added by negotiator)
        estimationTask.estimator.name = repositoryTask.name
        estimationTask.estimator.description = repositoryTask.description
        estimationTask.estimator.estimatedHours = repositoryTask.estimatedHours ? repositoryTask.estimatedHours : 0

        estimationTask.negotiator.name = repositoryTask.name
        estimationTask.negotiator.description = repositoryTask.description
        estimationTask.negotiator.estimatedHours = repositoryTask.estimatedHours ? repositoryTask.estimatedHours : 0

        estimationTask.status = SC.STATUS_PENDING
        estimationTask.addedInThisIteration = true
        estimationTask.owner = SC.OWNER_ESTIMATOR
        estimationTask.initiallyEstimated = true
        estimationTask.estimation = estimation
        estimationTask.technologies = estimation.technologies
        estimationTask.canApprove = false
        estimationTask.repo = {}
        estimationTask.repo._id = repositoryTask._id
        estimationTask.repo.addedFromThisEstimation = false
        estimationTask.feature._id = estimationFeature._id
        if ((repositoryTask.estimatedHours == 0)
            || repositoryTask.estimatedHours == undefined
            || _.isEmpty(repositoryTask.name)
            || _.isEmpty(repositoryTask.description)) {
            estimationTask.hasError = true
        } else estimationTask.hasError = false
        return estimationTask.save()
    })

    let estimationTasks = await Promise.all(estimationTaskPromises)

    estimationFeature.created = Date.now()
    estimationFeature.updated = Date.now()
    await estimationFeature.save()
    estimationFeature = estimationFeature.toObject()
    estimationFeature.tasks = estimationTasks
    if (estimation && estimation.canApprove) {
        estimationFeature.isEstimationCanApprove = true
    }
    return estimationFeature

    // In case repository feature has tasks as well we would be


    //return await EstimationFeatureModel.create(estimationFeature)
}


// add feature from repository by negotiator
const addFeatureFromRepositoryByNegotiator = async (estimationID, repositoryFeatureID, negotiator) => {
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repositoryFeature = await MDL.RepositoryModel.getFeature(repositoryFeatureID)
    if (!repositoryFeature)
        throw new AppError('Feature not found in Repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!repositoryFeature.isFeature)
        throw new AppError('This is not a feature but a task', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    /**
     * TODO: Uncomment this code when feature approve functionality if available in repository
     if (!_.includes([SC.STATUS_APPROVED], repositoryFeature.status))
     throw new AppError('Repository not ready to usable (Not approved)', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
     **/

    if (!Array.isArray(repositoryFeature.tasks) || repositoryFeature.tasks.length === 0) {
        throw new AppError('This feature has no tasks so there is no point adding this feature to estimation')
    }

    let estimation = await MDL.EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only add feature from repository into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let existingFeatureCount = await EstimationFeatureModel.count({
        "repo._id": repositoryFeature._id,
        "isDeleted": false,
        "estimation._id": estimation._id
    })


    if (existingFeatureCount > 0)
        throw new AppError('This feature already added from repository', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    let estimationFeature = new EstimationFeatureModel()

    estimationFeature.status = SC.STATUS_PENDING
    estimationFeature.addedInThisIteration = true
    estimationFeature.owner = SC.OWNER_NEGOTIATOR
    estimationFeature.initiallyEstimated = true
    estimationFeature.canApprove = false
    estimationFeature.changedKeyInformation = true

    estimationFeature.negotiator.name = repositoryFeature.name
    estimationFeature.negotiator.description = repositoryFeature.description
    estimationFeature.negotiator.estimatedHours = repositoryFeature.estimatedHours ? repositoryFeature.estimatedHours : 0


    estimationFeature.estimator.name = repositoryFeature.name
    estimationFeature.estimator.description = repositoryFeature.description
    estimationFeature.estimator.estimatedHours = repositoryFeature.estimatedHours ? repositoryFeature.estimatedHours : 0
    estimationFeature.estimation = estimation
    estimationFeature.repo = {}
    estimationFeature.repo._id = repositoryFeature._id
    estimationFeature.repo.addedFromThisEstimation = false
    estimationFeature.technologies = repositoryFeature.technologies
    estimationFeature.tags = repositoryFeature.tags
    let errorTasks = repositoryFeature.tasks.filter(t => {
        if (
            !t.name
            || t.name == undefined
            || t.name == ''
            || !t.description
            || t.description == undefined
            || t.description == ''
            || !t.estimatedHours
            || t.estimatedHours == 0
            || t.estimatedHours == undefined
        ) return true
        else return false
    })
    if (
        errorTasks.length
        || repositoryFeature.estimatedHours == 0
        || _.isEmpty(repositoryFeature.name)
        || _.isEmpty(repositoryFeature.description)) {
        estimationFeature.hasError = true
    } else {
        estimationFeature.hasError = false
    }

    if (repositoryFeature.estimatedHours)
        estimationFeature.negotiator.estimatedHours = repositoryFeature.estimatedHours
    else
        estimationFeature.negotiator.estimatedHours = 0

    // Iterate on tasks and add all the tasks into estimation

    let estimationTaskPromises = repositoryFeature.tasks.map(async repositoryTask => {
        let estimationTask = new MDL.EstimationTaskModel()
        // As task is added from repository its information can directly be copied into estimator section (even if it is being added by negotiator)
        estimationTask.estimator.name = repositoryTask.name
        estimationTask.estimator.description = repositoryTask.description
        estimationTask.estimator.estimatedHours = repositoryTask.estimatedHours ? repositoryTask.estimatedHours : 0

        estimationTask.negotiator.name = repositoryTask.name
        estimationTask.negotiator.description = repositoryTask.description
        estimationTask.negotiator.estimatedHours = repositoryTask.estimatedHours ? repositoryTask.estimatedHours : 0
        estimationTask.status = SC.STATUS_PENDING
        estimationTask.addedInThisIteration = true
        estimationTask.owner = SC.OWNER_NEGOTIATOR
        estimationTask.initiallyEstimated = true
        estimationTask.estimation = estimation
        estimationTask.technologies = estimation.technologies
        estimationTask.repo = {}
        estimationTask.repo._id = repositoryTask._id
        estimationTask.repo.addedFromThisEstimation = false
        estimationTask.feature._id = estimationFeature._id
        return estimationTask.save()
    })

    let estimationTasks = await Promise.all(estimationTaskPromises)

    estimationFeature.created = Date.now()
    estimationFeature.updated = Date.now()
    await estimationFeature.save()
    estimationFeature = estimationFeature.toObject()
    estimationFeature.tasks = estimationTasks
    if (estimation && estimation.canApprove) {
        estimationFeature.isEstimationCanApprove = true
    }
    return estimationFeature

    // In case repository feature has tasks as well we would be


    //return await EstimationFeatureModel.create(estimationFeature)
}


// copy feature from repository
estimationFeatureSchema.statics.copyFeatureFromRepository = async (estimationID, repoFeatureID, user) => {


    if (!estimationID)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimationID, user)
    if (role === SC.ROLE_ESTIMATOR) {
        return await copyFeatureFromRepositoryByEstimator(estimationID, repoFeatureID, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await copyFeatureFromRepositoryByNegotiator(estimationID, repoFeatureID, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}


// copy feature from repo by estimator
const copyFeatureFromRepositoryByEstimator = async (estimationID, repositoryFeatureID, estimator) => {
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repositoryFeature = await MDL.RepositoryModel.getFeature(repositoryFeatureID)
    if (!repositoryFeature)
        throw new AppError('Feature not found in Repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!repositoryFeature.isFeature)
        throw new AppError('This is not a feature but a task', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    /**
     * TODO: Uncomment this code when feature approve functionality if available in repository
     if (!_.includes([SC.STATUS_APPROVED], repositoryFeature.status))
     throw new AppError('Repository not ready to usable (Not approved)', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
     **/

    if (!Array.isArray(repositoryFeature.tasks) || repositoryFeature.tasks.length === 0) {
        throw new AppError('This feature has no tasks so there is no point adding this feature to estimation')
    }

    let estimation = await MDL.EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only add feature from repository into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let estimationFeature = new EstimationFeatureModel()

    estimationFeature.status = SC.STATUS_PENDING
    estimationFeature.addedInThisIteration = true
    estimationFeature.canApprove = false
    estimationFeature.owner = SC.OWNER_ESTIMATOR
    estimationFeature.initiallyEstimated = true

    estimationFeature.estimator.name = repositoryFeature.name
    estimationFeature.estimator.description = repositoryFeature.description
    estimationFeature.estimator.estimatedHours = repositoryFeature.estimatedHours ? repositoryFeature.estimatedHours : 0
    estimationFeature.estimation = estimation
    estimationFeature.repo = {}
    estimationFeature.repo.addedFromThisEstimation = true
    estimationFeature.technologies = repositoryFeature.technologies
    let errorTasks = repositoryFeature.tasks.filter(t => {
        if (
            !t.name
            || t.name == undefined
            || t.name == ''
            || !t.description
            || t.description == undefined
            || t.description == ''

            || t.estimatedHours == 0
            || t.estimatedHours == undefined
        ) return true
        else return false
    })
    if (
        errorTasks.length
        || repositoryFeature.estimatedHours == 0
        || _.isEmpty(repositoryFeature.name)
        || _.isEmpty(repositoryFeature.description)) {
        estimationFeature.hasError = true
    } else {
        estimationFeature.hasError = false
    }


    // Iterate on tasks and add all the tasks into estimation

    let estimationTaskPromises = repositoryFeature.tasks.map(async repositoryTask => {
        let estimationTask = new MDL.EstimationTaskModel()
        // As task is added from repository its information can directly be copied into estimator section (even if it is being added by negotiator)
        estimationTask.estimator.name = repositoryTask.name
        estimationTask.estimator.estimatedHours = repositoryTask.estimatedHours
        estimationTask.estimator.description = repositoryTask.description
        estimationTask.status = SC.STATUS_PENDING
        estimationTask.addedInThisIteration = true
        estimationTask.owner = SC.OWNER_ESTIMATOR
        estimationTask.initiallyEstimated = true
        estimationTask.estimation = estimation
        estimationTask.technologies = estimation.technologies
        estimationTask.canApprove = false
        estimationTask.repo = {}
        //estimationTask.repo._id = repositoryTask._id
        estimationTask.repo.addedFromThisEstimation = true
        estimationTask.feature._id = estimationFeature._id
        if (repositoryTask.estimatedHours == 0
            || repositoryTask.estimatedHours == undefined
            || _.isEmpty(repositoryTask.name)
            || _.isEmpty(repositoryTask.description)) {
            estimationTask.hasError = true
        } else estimationTask.hasError = false
        return estimationTask.save()
    })

    let estimationTasks = await Promise.all(estimationTaskPromises)

    estimationFeature.created = Date.now()
    estimationFeature.updated = Date.now()
    await estimationFeature.save()
    estimationFeature = estimationFeature.toObject()
    estimationFeature.tasks = estimationTasks
    if (estimation && estimation.canApprove) {
        estimationFeature.isEstimationCanApprove = true
    }
    return estimationFeature
}


// copy feature from repo by negotiator
const copyFeatureFromRepositoryByNegotiator = async (estimationID, repositoryFeatureID, negotiator) => {
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repositoryFeature = await MDL.RepositoryModel.getFeature(repositoryFeatureID)
    if (!repositoryFeature)
        throw new AppError('Feature not found in Repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!repositoryFeature.isFeature)
        throw new AppError('This is not a feature but a task', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    /**
     * TODO: Uncomment this code when feature approve functionality if available in repository
     if (!_.includes([SC.STATUS_APPROVED], repositoryFeature.status))
     throw new AppError('Repository not ready to usable (Not approved)', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
     **/

    if (!Array.isArray(repositoryFeature.tasks) || repositoryFeature.tasks.length === 0) {
        throw new AppError('This feature has no tasks so there is no point adding this feature to estimation')
    }

    let estimation = await MDL.EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only add feature from repository into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)
    /*
     let existingFeatureCount = await EstimationFeatureModel.count({
         "repo._id": repositoryFeature._id,
            "estimation._id": estimation._id
        })
    if (existingFeatureCount > 0)
            throw new AppError('This feature already added from repository', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    */
    let estimationFeature = new EstimationFeatureModel()

    estimationFeature.status = SC.STATUS_PENDING
    estimationFeature.addedInThisIteration = true
    estimationFeature.owner = SC.OWNER_NEGOTIATOR
    estimationFeature.initiallyEstimated = true
    estimationFeature.changedKeyInformation = true
    estimationFeature.canApprove = false

    estimationFeature.negotiator.name = repositoryFeature.name
    estimationFeature.negotiator.description = repositoryFeature.description
    estimationFeature.estimation = estimation
    estimationFeature.repo = {}
    estimationFeature.repo._id = repositoryFeature._id
    estimationFeature.repo.addedFromThisEstimation = true
    estimationFeature.technologies = repositoryFeature.technologies
    estimationFeature.tags = repositoryFeature.tags
    let errorTasks = repositoryFeature.tasks.filter(t => {
        if (
            !t.name
            || t.name == undefined
            || t.name == ''
            || !t.description
            || t.description == undefined
            || t.description == ''
            || t.estimatedHours == 0
            || t.estimatedHours == undefined
        ) return true
        else return false
    })
    if (
        errorTasks.length ||
        (!estimationFeature.estimator.estimatedHours || estimationFeature.estimator.estimatedHours == 0)
        || _.isEmpty(estimationFeature.estimator.name)
        || _.isEmpty(estimationFeature.estimator.description)) {

        estimationFeature.hasError = true
    } else {

        estimationFeature.hasError = false
    }

    if (repositoryFeature.estimatedHours)
        estimationFeature.negotiator.estimatedHours = repositoryFeature.estimatedHours
    else
        estimationFeature.negotiator.estimatedHours = 0

    // Iterate on tasks and add all the tasks into estimation

    let estimationTaskPromises = repositoryFeature.tasks.map(async repositoryTask => {
        let estimationTask = new MDL.EstimationTaskModel()
        // As task is added from repository its information can directly be copied into estimator section (even if it is being added by negotiator)
        estimationTask.negotiator.name = repositoryTask.name
        estimationTask.negotiator.description = repositoryTask.description
        estimationTask.status = SC.STATUS_PENDING
        estimationTask.addedInThisIteration = true
        estimationTask.owner = SC.OWNER_NEGOTIATOR
        estimationTask.initiallyEstimated = true
        estimationTask.estimation = estimation
        estimationTask.canApprove = false
        estimationTask.technologies = estimation.technologies
        estimationTask.repo = {}
        //estimationTask.repo._id = repositoryTask._id
        estimationTask.repo.addedFromThisEstimation = true
        estimationTask.feature._id = estimationFeature._id

        if (repositoryTask.estimatedHours == 0
            || repositoryTask.estimatedHours == undefined
            || _.isEmpty(repositoryTask.name)
            || _.isEmpty(repositoryTask.description)) {
            estimationTask.hasError = true
        } else estimationTask.hasError = false

        return estimationTask.save()
    })

    let estimationTasks = await Promise.all(estimationTaskPromises)

    estimationFeature.created = Date.now()
    estimationFeature.updated = Date.now()
    await estimationFeature.save()
    estimationFeature = estimationFeature.toObject()
    estimationFeature.tasks = estimationTasks
    if (estimation && estimation.canApprove) {
        estimationFeature.isEstimationCanApprove = true
    }
    return estimationFeature

    // In case repository feature has tasks as well we would be

    //return await EstimationFeatureModel.create(estimationFeature)
}


// request re open permission of feature
estimationFeatureSchema.statics.requestReOpenPermissionOfFeature = async (featureID, user,) => {
    let feature = await EstimationFeatureModel.findById(featureID)
    if (!feature)
        throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": feature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        return await requestReOpenPermissionOfFeatureByEstimator(feature, estimation, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "] can request edit permission task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

const requestReOpenPermissionOfFeatureByEstimator = async (feature, estimation, estimator) => {
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)


    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only request edit feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    feature.estimator.changeRequested = !feature.estimator.changeRequested
    feature.estimator.requestedInThisIteration = true
    feature.canApprove = false
    return await feature.save()
}


estimationFeatureSchema.statics.grantReOpenPermissionOfFeature = async (featureID, user,) => {
    let feature = await EstimationFeatureModel.findById(featureID)
    if (!feature)
        throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": feature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        throw new AppError("Only users with role [" + SC.ROLE_NEGOTIATOR + "] can grant re-open permission of task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)

    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await grantEditPermissionOfFeatureByNegotiator(feature, estimation, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}


const grantEditPermissionOfFeatureByNegotiator = async (feature, estimation, negotiator) => {


    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only given grant edit permission to feature into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.negotiator._id == negotiator._id)
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!feature.addedInThisIteration || feature.owner != SC.OWNER_NEGOTIATOR)
        feature.negotiator.changedInThisIteration = true


    if ((
            await MDL.EstimationTaskModel.count({
                "feature._id": feature._id,
                "isDeleted": false,
                "estimator.removalRequested": true
            })
            + await MDL.EstimationTaskModel.count({
                "feature._id": feature._id,
                "isDeleted": false,
                "estimator.changeRequested": true
            })
            +
            await EstimationFeatureModel.count({
                "_id": feature._id,
                "isDeleted": false,
                "estimator.removalRequested": true
            }) +
            await EstimationFeatureModel.count({
                "feature._id": feature._id,
                "isDeleted": false,
                "estimator.changeRequested": true
            })) <= 1) {

        let a = await EstimationFeatureModel.updateOne({_id: feature._id}, {
            $set: {"estimator.requestedInThisIteration": false}

        })


    }


    feature.negotiator.changeGranted = !feature.negotiator.changeGranted
    feature.canApprove = false
    feature.status = SC.STATUS_PENDING
    feature.updated = Date.now()
    await feature.save()
    feature = feature.toObject()
    if (estimation && estimation.canApprove) {
        feature.isEstimationCanApprove = true
    }
    return feature
}

//request removal feature
estimationFeatureSchema.statics.requestRemovalFeature = async (featureID, user) => {

    let feature = await EstimationFeatureModel.findById(featureID)
    if (!feature)
        throw new AppError('Estimation feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!feature || !feature.estimation || !feature.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": feature.estimation._id})

    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        return await requestRemovalFeatureByEstimator(feature, estimation, user)

    } else if (role === SC.ROLE_NEGOTIATOR) {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "] can request removal task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

//request removal feature by estimator
const requestRemovalFeatureByEstimator = async (feature, estimation, estimator) => {

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only update removal task flag into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    feature.estimator.removalRequested = !feature.estimator.removalRequested
    feature.estimator.requestedInThisIteration = true
    feature.canApprove = true

    return await feature.save()
}


//reopen feature
estimationFeatureSchema.statics.reOpenFeature = async (featureID, user) => {

    let feature = await EstimationFeatureModel.findById(featureID)
    if (!feature)
        throw new AppError('Estimation feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!feature || !feature.estimation || !feature.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": feature.estimation._id})

    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {

        throw new AppError("Only users with role [" + SC.ROLE_NEGOTIATOR + "] can directly reOpen Feature into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    } else if (role === SC.ROLE_NEGOTIATOR) {

        return await reOpenFeatureByNegotiator(feature, estimation, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

// reopen feature by negotiator
const reOpenFeatureByNegotiator = async (feature, estimation, negotiator) => {
    if (!feature)
        throw new AppError('feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Negotiator has status as [" + estimation.status + "]. Negotiator can only ReOpen Feature into those estimations where status is in [" + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    feature.status = SC.STATUS_PENDING
    feature.canApprove = true
    await feature.save()
    feature = feature.toObject()
    if (estimation && estimation.canApprove) {
        feature.isEstimationCanApprove = true
    }
    return feature
}


const EstimationFeatureModel = mongoose.model("EstimationFeature", estimationFeatureSchema)
export default EstimationFeatureModel