import mongoose from 'mongoose'
import AppError from '../AppError'
import {
    estimationEstimatorAddFeatureStruct,
    estimationEstimatorUpdateFeatureStruct,
    estimationNegotiatorAddFeatureStruct,
    estimationNegotiatorUpdateFeatureStruct,
    validate,
} from "../validation"
import * as SC from "../serverconstants"
import {userHasRole} from "../utils"
import {EstimationModel, EstimationTaskModel, RepositoryModel} from "./"
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
        addedFromThisEstimation: {type: Boolean, required: false}
    },
    estimator: {
        name: {type: String},
        description: {type: String},
        estimatedHours: {type: Number, default: 0},
        changeRequested: {type: Boolean, default: false},
        changedKeyInformation: {type: Boolean, default: false},
        removalRequested: {type: Boolean, default: false},
        changedInThisIteration: {type: Boolean, default: false}
    },
    negotiator: {
        name: {type: String},
        description: {type: String},
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


estimationFeatureSchema.statics.addFeatureByEstimator = async (featureInput, estimator) => {
    validate(featureInput, estimationEstimatorAddFeatureStruct)
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
    let estimation = await EstimationModel.findById(featureInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only add feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    //let repositoryFeature = undefined

    /**
     * As no repo id is sent, this means that this is a new feature, hence save this feature into repository
     * @type {{addedFromThisEstimation: boolean}}
     */

    /*repositoryFeature = await RepositoryModel.addFeature({
        name: featureInput.name,
        description: featureInput.description,
        estimation: {
            _id: estimation._id.toString()
        },
        createdBy: estimator,
        technologies: estimation.technologies,
        tags: featureInput.tags
    }, estimator)*/

    let estimationFeature = new EstimationFeatureModel()
    estimationFeature.estimator.name = featureInput.name
    estimationFeature.estimator.description = featureInput.description
    estimationFeature.estimator.estimatedHours = featureInput.estimatedHours
    estimationFeature.status = SC.STATUS_PENDING
    estimationFeature.addedInThisIteration = true
    estimationFeature.owner = SC.OWNER_ESTIMATOR
    estimationFeature.initiallyEstimated = true
    estimationFeature.estimation = featureInput.estimation
    estimationFeature.technologies = estimation.technologies
    // Add repository reference and also note that this task was added into repository from this estimation
    //estimationFeature.repo._id = repositoryFeature._id
    estimationFeature.repo.addedFromThisEstimation = true

    if (!_.isEmpty(featureInput.notes)) {
        estimationFeature.notes = featureInput.notes.map(n => {
            n.name = estimator.fullName
            return n
        })
    }

    return await estimationFeature.save()
}

estimationFeatureSchema.statics.addFeatureByNegotiator = async (featureInput, negotiator) => {
    validate(featureInput, estimationNegotiatorAddFeatureStruct)
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
    let estimation = await EstimationModel.findById(featureInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only add feature into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    /* let repositoryFeature = await RepositoryModel.addFeature({
         name: featureInput.name,
         description: featureInput.description,
         estimation: {
             _id: estimation._id.toString()
         },
         createdBy: negotiator,
         technologies: estimation.technologies,
         tags: featureInput.tags
     }, negotiator)

     featureInput.repo = {
         _id: repositoryFeature._id,
         addedFromThisEstimation: true
     } */


    let estimationFeature = new EstimationFeatureModel()
    estimationFeature.negotiator.name = featureInput.name
    estimationFeature.negotiator.description = featureInput.description
    estimationFeature.negotiator.estimatedHours = featureInput.estimatedHours
    estimationFeature.negotiator.changeSuggested = true
    estimationFeature.status = SC.STATUS_PENDING
    estimationFeature.addedInThisIteration = true
    estimationFeature.owner = SC.OWNER_NEGOTIATOR
    estimationFeature.initiallyEstimated = true
    estimationFeature.estimation = featureInput.estimation
    estimationFeature.technologies = estimation.technologies
    // Add repository reference and also note that this task was added into repository from this estimation
    //estimationFeature.repo._id = repositoryFeature._id
    //estimationFeature.repo.addedFromThisEstimation = true
    // Add name/description into estimator section as well, estimator can review and add estimated hours against this task
    estimationFeature.estimator.name = featureInput.name
    estimationFeature.estimator.description = featureInput.description
    if (!_.isEmpty(featureInput.notes)) {
        estimationFeature.notes = featureInput.notes.map(n => {
            n.name = negotiator.fullName
            return n
        })
    }

    return await estimationFeature.save()
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

    if (featureInput.repo && !featureInput.repo.addedFromThisEstimation)
        throw new AppError('Feature is From Repository ', EC.FEATURE_FROM_REPOSITORY_ERROR)

    /**
     * Check to see if this task is added by estimator or not
     */
    if (estimationFeature.owner == SC.OWNER_ESTIMATOR && !estimationFeature.addedInThisIteration && !estimationFeature.negotiator.changeSuggested && !estimationFeature.negotiator.changeGranted) {
        // this means that estimator has added this feature in past iteration and negotiator has not given permission to edit this feature
        throw new AppError('Not allowed to update feature as Negotiator has not granted permission', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
    } else if (estimationFeature.owner == SC.OWNER_NEGOTIATOR && !estimationFeature.negotiator.changeSuggested && !estimationFeature.negotiator.changeGranted) {
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
    if (!estimationFeature.addedInThisIteration || estimationFeature.owner != SC.OWNER_ESTIMATOR) {
        estimationFeature.estimator.changedInThisIteration = true
        estimationFeature.estimator.changedKeyInformation = true
    }
    estimationFeature.estimator.description = featureInput.description

    // As estimator has peformed edit, reset changeRequested and grant edit flags
    estimationFeature.estimator.changeRequested = false
    estimationFeature.negotiator.changeGranted = false

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

estimationFeatureSchema.statics.updateFeatureByNegotiator = async (featureInput, negotiator) => {
    validate(featureInput, estimationNegotiatorUpdateFeatureStruct)

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let estimationFeature = await EstimationFeatureModel.findById(featureInput._id)
    if (!estimationFeature)
        throw new AppError('Estimation feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": estimationFeature.estimation._id})
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
    estimationFeature.negotiator.description = featureInput.description
    estimationFeature.negotiator.changeSuggested = true // This will allow estimator to see updated changes as suggestions
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
        }, negotiator)
    }
    return await estimationFeature.save()
}

estimationFeatureSchema.statics.approveFeatureByNegotiator = async (featureID, negotiator) => {

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let feature = await EstimationFeatureModel.findById(featureID)
    if (!feature)
        throw new AppError('Estimation feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": feature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only approve feature into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.negotiator._id == negotiator._id)
        throw new AppError('You are not negotiator of this estimation', EC.INVALID_USER, EC.HTTP_FORBIDDEN)

    if (feature.estimator.changeRequested || feature.estimator.removalRequested || _.isEmpty(feature.estimator.name) || _.isEmpty(feature.estimator.description))
        throw new AppError('Cannot approve feature as either name/description is not not there or there are pending requests from Estimator', EC.FEATURE_APPROVAL_ERROR, EC.HTTP_FORBIDDEN)

    let taskCountOfFeature = await EstimationTaskModel.count({
        "estimation._id": feature.estimation._id,
        "feature._id": feature._id

    })

    if (taskCountOfFeature == 0)
        throw new AppError('There are no tasks in this feature, cannot approve', EC.TASK_APPROVAL_ERROR, EC.HTTP_FORBIDDEN)


    if(!feature.estimator.estimatedHours && !feature.estimator.estimatedHours>0){
        throw new AppError('Feature Estimated Hours should be greter than zero', EC.TASK_APPROVAL_ERROR, EC.HTTP_BAD_REQUEST)

    }
    let pendingTaskCountOfFeature = await EstimationTaskModel.count({
        "estimation._id": feature.estimation._id,
        "feature._id": feature._id,
        status: {$in: [SC.STATUS_PENDING]}
    })

    if (pendingTaskCountOfFeature != 0)
        throw new AppError('There are non-approved tasks in this feature, cannot approve', EC.TASK_APPROVAL_ERROR, EC.HTTP_FORBIDDEN)


    feature.status = SC.STATUS_APPROVED
    feature.updated = Date.now()
    return await feature.save()
}


estimationFeatureSchema.statics.deleteFeatureByEstimator = async (paramsInput, estimator) => {
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let feature = await EstimationFeatureModel.findById(paramsInput.featureID)
    if (!feature)
        throw new AppError('feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": paramsInput.estimationID})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only delete feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.estimator._id != estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (feature.owner != SC.OWNER_ESTIMATOR)
        throw new AppError('You are not owner of this feature', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)

    if (!feature.addedInThisIteration)
        throw new AppError('You are not allowed to delete this feature', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)

    feature.isDeleted = true
    feature.estimator.changedInThisIteration = true
    feature.updated = Date.now()
    return await feature.save()
}

estimationFeatureSchema.statics.deleteFeatureByNegotiator = async (paramsInput, negotiator) => {

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let feature = await EstimationFeatureModel.findById(paramsInput.featureID)
    if (!feature)
        throw new AppError('feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": paramsInput.estimationID})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only delete feature into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id != negotiator._id)
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!feature.estimator.removalRequested) {
        if (feature.owner != SC.OWNER_NEGOTIATOR)
            throw new AppError('You are not owner of this feature', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)

        /*if (!feature.addedInThisIteration)
            throw new AppError('You are not allowed to delete this feature', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)*/
    }

    /*if (feature.owner != SC.OWNER_NEGOTIATOR)
        throw new AppError('You are not owner of this feature', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)

    if (!feature.addedInThisIteration)
        throw new AppError('You are not allowed to delete this feature', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)*/

    feature.isDeleted = true
    feature.negotiator.changedInThisIteration = true
    feature.updated = Date.now()
    return await feature.save()
}

estimationFeatureSchema.statics.addFeatureFromRepositoryByEstimator = async (estimationID, repositoryFeatureID, estimator) => {
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repositoryFeature = await RepositoryModel.getFeature(repositoryFeatureID)
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

    let estimation = await EstimationModel.findById(estimationID)
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
    estimationFeature.owner = SC.OWNER_ESTIMATOR
    estimationFeature.initiallyEstimated = true

    estimationFeature.estimator.name = repositoryFeature.name
    estimationFeature.estimator.description = repositoryFeature.description
    estimationFeature.estimation = estimation
    estimationFeature.repo._id = repositoryFeature._id
    estimationFeature.repo.addedFromThisEstimation = false
    estimationFeature.technologies = repositoryFeature.technologies

    // Iterate on tasks and add all the tasks into estimation

    let estimationTaskPromises = repositoryFeature.tasks.map(async repositoryTask => {
        console.log("inside ", repositoryTask._id)
        let estimationTask = new EstimationTaskModel()
        // As task is added from repository its information can directly be copied into estimator section (even if it is being added by negotiator)
        estimationTask.estimator.name = repositoryTask.name
        estimationTask.estimator.description = repositoryTask.description
        estimationTask.status = SC.STATUS_PENDING
        estimationTask.addedInThisIteration = true
        estimationTask.owner = SC.OWNER_ESTIMATOR
        estimationTask.initiallyEstimated = true
        estimationTask.estimation = estimation
        estimationTask.technologies = estimation.technologies
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
    return estimationFeature

    // In case repository feature has tasks as well we would be


    //return await EstimationFeatureModel.create(estimationFeature)
}

estimationFeatureSchema.statics.copyFeatureFromRepositoryByEstimator = async (estimationID, repositoryFeatureID, estimator) => {
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repositoryFeature = await RepositoryModel.getFeature(repositoryFeatureID)
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

    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only add feature from repository into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let existingFeatureCount = await EstimationFeatureModel.count({
        "repo._id": repositoryFeature._id,
        "estimation._id": estimation._id
    })


    if (existingFeatureCount > 0)
        throw new AppError('This feature already added from repository', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    let estimationFeature = new EstimationFeatureModel()

    estimationFeature.status = SC.STATUS_PENDING
    estimationFeature.addedInThisIteration = true
    estimationFeature.owner = SC.OWNER_ESTIMATOR
    estimationFeature.initiallyEstimated = true

    estimationFeature.estimator.name = repositoryFeature.name
    estimationFeature.estimator.description = repositoryFeature.description
    estimationFeature.estimation = estimation
    //estimationFeature.repo._id = repositoryFeature._id
    estimationFeature.repo.addedFromThisEstimation = true
    estimationFeature.technologies = repositoryFeature.technologies

    // Iterate on tasks and add all the tasks into estimation

    let estimationTaskPromises = repositoryFeature.tasks.map(async repositoryTask => {
        console.log("inside ", repositoryTask._id)
        let estimationTask = new EstimationTaskModel()
        // As task is added from repository its information can directly be copied into estimator section (even if it is being added by negotiator)
        estimationTask.estimator.name = repositoryTask.name
        estimationTask.estimator.description = repositoryTask.description
        estimationTask.status = SC.STATUS_PENDING
        estimationTask.addedInThisIteration = true
        estimationTask.owner = SC.OWNER_ESTIMATOR
        estimationTask.initiallyEstimated = true
        estimationTask.estimation = estimation
        estimationTask.technologies = estimation.technologies
        //estimationTask.repo._id = repositoryTask._id
        estimationTask.repo.addedFromThisEstimation = true
        estimationTask.feature._id = estimationFeature._id
        return estimationTask.save()
    })

    let estimationTasks = await Promise.all(estimationTaskPromises)

    estimationFeature.created = Date.now()
    estimationFeature.updated = Date.now()
    await estimationFeature.save()
    estimationFeature = estimationFeature.toObject()
    estimationFeature.tasks = estimationTasks
    return estimationFeature

    // In case repository feature has tasks as well we would be


    //return await EstimationFeatureModel.create(estimationFeature)
}

estimationFeatureSchema.statics.requestEditPermissionOfFeatureByEstimator = async (featureID, estimator) => {
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let feature = await EstimationFeatureModel.findById(featureID)
    if (!feature)
        throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": feature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only request edit feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (feature.repo && !feature.repo.addedFromThisEstimation)
        throw new AppError('Feature is From Repository ', EC.FEATURE_FROM_REPOSITORY_ERROR)

    feature.estimator.changeRequested = !feature.estimator.changeRequested
    feature.estimator.changedInThisIteration = true
    return await feature.save()
}

estimationFeatureSchema.statics.grantEditPermissionOfFeatureByNegotiator = async (featureID, negotiator) => {

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let feature = await EstimationFeatureModel.findById(featureID)
    if (!feature)
        throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": feature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only given grant edit permission to feature into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.negotiator._id == negotiator._id)
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!feature.addedInThisIteration || feature.owner != SC.OWNER_NEGOTIATOR)
        feature.negotiator.changedInThisIteration = true

    if (feature.repo && !feature.repo.addedFromThisEstimation)
        throw new AppError('Feature is From Repository ', EC.FEATURE_FROM_REPOSITORY_ERROR)



    feature.negotiator.changeGranted = !feature.negotiator.changeGranted
    feature.updated = Date.now()
    return await feature.save()
}


estimationFeatureSchema.statics.addFeatureFromRepositoryByNegotiator = async (estimationID, repositoryID, negotiator) => {
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repo = await RepositoryModel.findById(repositoryID)
    if (!repo)
        throw new AppError('Repository not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!repo.isFeature)
        throw new AppError('This feature not into repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_APPROVED], repo.status))
        throw new AppError('Repository not ready to usable (Not approved)', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only add feature from repository into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!repo.tasks && !repo.tasks.length > 0)
        throw new AppError('This repository do not have any tasks', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let thisFeatureAlreadyAddedFromRepo = await EstimationFeatureModel.findOne({
        "repo._id": repo._id,
        "isDeleted": false,
        "repo.addedFromThisEstimation": false,
        "estimation._id": estimation._id
    })

    if (thisFeatureAlreadyAddedFromRepo)
        throw new AppError('This feature already added from repository', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    let newFeature = new EstimationFeatureModel()

    newFeature.status = SC.STATUS_PENDING
    newFeature.addedInThisIteration = true
    newFeature.changedKeyInformation = true
    newFeature.owner = SC.OWNER_NEGOTIATOR
    newFeature.initiallyEstimated = true

    newFeature.negotiator.name = repo.name
    newFeature.negotiator.description = repo.description
    if (repo.estimatedHours)
        newFeature.negotiator.estimatedHours = repo.estimatedHours
    else
        newFeature.negotiator.estimatedHours = 0

    newFeature.estimation = estimation
    newFeature.repo._id = repo._id
    newFeature.repo.addedFromThisEstimation = false

    newFeature.technologies = repo.technologies
    newFeature.tags = repo.tags
    newFeature.tasks = repo.tasks

    newFeature.created = Date.now()
    newFeature.updated = Date.now()

    return await EstimationFeatureModel.create(newFeature)
}
estimationFeatureSchema.statics.copyFeatureFromRepositoryByNegotiator = async (estimationID, repositoryID, negotiator) => {
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repo = await RepositoryModel.findById(repositoryID)
    if (!repo)
        throw new AppError('Repository not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!repo.isFeature)
        throw new AppError('This feature not into repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_APPROVED], repo.status))
        throw new AppError('Repository not ready to usable (Not approved)', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only add feature from repository into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!repo.tasks && !repo.tasks.length > 0)
        throw new AppError('This repository do not have any tasks', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let thisFeatureAlreadyAddedFromRepo = await EstimationFeatureModel.findOne({
        "repo._id": repo._id,
        "repo.addedFromThisEstimation": false,
        "estimation._id": estimation._id
    })

    if (thisFeatureAlreadyAddedFromRepo)
        throw new AppError('This feature already added from repository', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    let newFeature = new EstimationFeatureModel()

    newFeature.status = SC.STATUS_PENDING
    newFeature.addedInThisIteration = true
    newFeature.changedKeyInformation = true
    newFeature.owner = SC.OWNER_NEGOTIATOR
    newFeature.initiallyEstimated = true

    newFeature.negotiator.name = repo.name
    newFeature.negotiator.description = repo.description
    if (repo.estimatedHours)
        newFeature.negotiator.estimatedHours = repo.estimatedHours
    else
        newFeature.negotiator.estimatedHours = 0

    newFeature.estimation = estimation
    //newFeature.repo._id = repo._id
    newFeature.repo.addedFromThisEstimation = true

    newFeature.technologies = repo.technologies
    newFeature.tags = repo.tags
    newFeature.tasks = repo.tasks

    newFeature.created = Date.now()
    newFeature.updated = Date.now()

    return await EstimationFeatureModel.create(newFeature)
}
estimationFeatureSchema.statics.requestRemovalFeatureByEstimator = async (featureID, estimator) => {


    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let feature = await EstimationFeatureModel.findById(featureID)

    if (!feature)
        throw new AppError('feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": feature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only update removal task flag into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    feature.estimator.removalRequested = !feature.estimator.removalRequested
    feature.estimator.changedInThisIteration = true

    return await feature.save()


}
const EstimationFeatureModel = mongoose.model("EstimationFeature", estimationFeatureSchema)
export default EstimationFeatureModel