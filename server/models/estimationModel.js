import mongoose from 'mongoose'
import AppError from '../AppError'
import * as MDL from './index'
import * as SC from '../serverconstants'
import * as EC from '../errorcodes'
import {userHasRole} from '../utils'
import * as V from '../validation'
import _ from 'lodash'
import logger from '../logger'

mongoose.Promise = global.Promise

let estimationSchema = mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: [SC.STATUS_INITIATED, SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_REVIEW_REQUESTED, SC.STATUS_CHANGE_REQUESTED, SC.STATUS_APPROVED, SC.STATUS_REOPENED, SC.STATUS_PROJECT_AWARDED]
    },
    technologies: [String],
    estimatedHours: {type: Number},
    suggestedHours: {type: Number},
    description: String,
    canApprove: {type: Boolean, default: false},
    hasError: {type: Boolean, default: true},
    created: Date,
    updated: Date,
    estimator: {
        _id: mongoose.Schema.ObjectId,
        firstName: String,
        lastName: String
    },
    negotiator: {
        _id: mongoose.Schema.ObjectId,
        firstName: String,
        lastName: String
    },
    client: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    project: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    release: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    // Contains statistics associated with each task type
    stats: [{
        type: {type: String, enum: [SC.TYPE_REVIEW, SC.TYPE_TESTING, SC.TYPE_MANAGEMENT, SC.TYPE_DEVELOPMENT]},
        estimatedHours: {type: Number, default: 0}
    }],
    notes: [{
        name: {type: String, required: true},
        note: {type: String, required: true},
        date: {type: Date, default: Date.now()}
    }],
    statusHistory: [{
        name: String,
        status: String,
        date: {type: Date, default: Date.now()}
    }],
    isDeleted: {type: Boolean, default: false},
    isArchived: {type: Boolean, default: false},
    canHardDelete: {type: Boolean, default: true}
}, {
    usePushEach: true
})


estimationSchema.statics.getUserRoleInEstimation = async (estimationID, user) => {
    let estimation = await EstimationModel.findById(estimationID, {estimator: 1, negotiator: 1})

    if (estimation) {
        // check to see role of logged in user in this estimation
        if (estimation.estimator._id.toString() == user._id.toString())
            return SC.ROLE_ESTIMATOR
        else if (estimation.negotiator._id.toString() == user._id.toString())
            return SC.ROLE_NEGOTIATOR
    }
    return undefined
}


estimationSchema.statics.getAllActive = async (projectID, status, user) => {

    let estimations = []
    if (userHasRole(user, SC.ROLE_ESTIMATOR)) {
        // Estimator would only see those estimations that don't have initiated status and this user is estimator
        let estimatorEstimations = await EstimationModel.find({
            isArchived: false,
            isDeleted: false,
            'estimator._id': mongoose.Types.ObjectId(user._id),
            status: {$ne: SC.STATUS_INITIATED}
        }, {
            description: 1,
            project: 1,
            client: 1,
            technologies: 1,
            estimator: 1,
            negotiator: 1,
            status: 1,
            estimatedHours: 1,
            suggestedHours: 1
        })


        estimations = [...estimatorEstimations]

    }

    if (userHasRole(user, SC.ROLE_NEGOTIATOR)) {
        // Negotiator would only see all estimations where he is negotiator
        let negotiatorEstimations = await EstimationModel.find({
            isArchived: false,
            isDeleted: false,
            'negotiator._id': mongoose.Types.ObjectId(user._id)
        }, {
            description: 1,
            project: 1,
            client: 1,
            technologies: 1,
            estimator: 1,
            negotiator: 1,
            status: 1,
            estimatedHours: 1,
            suggestedHours: 1
        })
        estimations = [...estimations, ...negotiatorEstimations]
    }
    if (status == SC.ALL && projectID == SC.ALL) {

        return estimations

    } else if (status == SC.ALL) {

        return estimations.filter(estimation => estimation.project._id == projectID)

    } else if (projectID == SC.ALL) {

        return estimations.filter(estimation => estimation.status == status)

    } else return estimations.filter(estimation => estimation.status == status && estimation.project._id == projectID)

}

estimationSchema.statics.getById = async estimationID => {

    //return await EstimationModel.findById(estimationID)
    // this API would return more details about selected estimation
    let estimations = await EstimationModel.aggregate({
        $match: {
            _id: mongoose.Types.ObjectId(estimationID)
        },
    }, {
        $lookup: {
            from: 'estimationtasks',
            let: {estimationID: '$_id'},
            pipeline: [{
                $match: {
                    $expr: {
                        $and: [
                            {$eq: ['$estimation._id', '$$estimationID']},
                            {$eq: [{$ifNull: ['$feature._id', true]}, true]}
                        ]
                    }
                }
            }],
            as: 'tasks'
        }
    }, {
        $lookup: {
            from: 'estimationfeatures',
            let: {estimationID: '$_id'},
            pipeline: [{
                $match: {
                    $expr: {
                        $and: [
                            {$eq: ['$estimation._id', '$$estimationID']}
                        ]
                    }
                }

            }, {
                $lookup: {
                    from: 'estimationtasks',
                    localField: '_id',
                    foreignField: 'feature._id',
                    as: 'tasks'
                }
            }],
            as: 'features'
        }
    }).exec()

    if (Array.isArray(estimations) && estimations.length > 0) {
        return estimations[0]
    }

}

/**
 * Estimation is initiated by Negotiator
 * @param estimationInput
 */
estimationSchema.statics.initiate = async (estimationInput, negotiator) => {

    // validate input
    V.validate(estimationInput, V.estimationInitiationStruct)

    // enhance estimation input as per requirement
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let project = await MDL.ProjectModel.findById(estimationInput.project._id)
    if (!project)
        throw new AppError('Project not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimator = await MDL.UserModel.findById(estimationInput.estimator._id)

    if (!estimator)
        throw new AppError('Estimator not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (negotiator._id.toString() === estimator._id.toString())
        throw new AppError('Estimator and negotiator can not be same ', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    estimationInput.status = SC.STATUS_INITIATED
    estimationInput.estimatedHours = 0
    estimationInput.suggestedHours = 0
    estimationInput.project = project
    estimationInput.client = project.client
    estimationInput.estimator = estimator
    estimationInput.negotiator = negotiator
    estimationInput.statusHistory = [{
        name: negotiator.firstName,
        status: SC.STATUS_INITIATED

    }]

    let estimation = await EstimationModel.create(estimationInput)
    estimation.loggedInUserRole = SC.ROLE_NEGOTIATOR
    return estimation
}


/**
 * Estimation is deleted by Negotiator
 * @param estimationInput
 */
estimationSchema.statics.deleteEstimationById = async (estimationID, negotiator) => {

    // enhance estimation input as per requirement
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
    let estimation = await EstimationModel.findById(estimationID)
    // enhance estimation input as per requirement
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_REVIEW_REQUESTED, SC.STATUS_INITIATED], estimation.status))
        throw new AppError('Only estimations with status [' + SC.STATUS_REVIEW_REQUESTED + ' or ' + SC.STATUS_INITIATED + '] can delete Estimation', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id != negotiator._id)
        throw new AppError('You are not a negotiator of this Estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    await MDL.EstimationTaskModel.remove({'estimation._id': estimationID})
    await MDL.EstimationFeatureModel.remove({'estimation._id': estimationID})
    await EstimationModel.remove({'_id': estimationID})
    return {estimationID}
}


/**
 * Estimation is Updated by Negotiator
 * @param estimationInput
 */
estimationSchema.statics.updateEstimationByNegotiator = async (estimationInput, negotiator) => {

    // validate input
    V.validate(estimationInput, V.estimationUpdationStruct)
    let estimation = await EstimationModel.findById(estimationInput._id)
    // enhance estimation input as per requirement
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (estimation.status != SC.STATUS_INITIATED)
        throw new AppError('Only estimations with status [' + SC.STATUS_INITIATED + '] can Edit', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let project = await MDL.ProjectModel.findById(estimationInput.project._id)
    if (!project)
        throw new AppError('Project not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimator = await MDL.UserModel.findById(estimationInput.estimator._id)
    if (!userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!estimator)
        throw new AppError('Estimator not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    estimation.status = SC.STATUS_INITIATED
    estimation.project = project
    estimation.client = project.client
    estimation.estimator = estimator
    estimation.description = estimationInput.description
    estimation.negotiator = negotiator
    estimation.technologies = estimationInput.technologies
    estimation.features = undefined
    estimation.tasks = undefined
    estimation.statusHistory = [{
        name: negotiator.firstName,
        status: SC.STATUS_INITIATED

    }]

    await estimation.save()
    let updatedEstimation = estimation.toObject()
    updatedEstimation.loggedInUserRole = SC.ROLE_NEGOTIATOR
    return updatedEstimation
}

estimationSchema.statics.request = async (estimationID, negotiator) => {
    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id != negotiator._id)
        throw new AppError('This estimation has different negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (estimation.status != SC.STATUS_INITIATED)
        throw new AppError('Only estimations with status [' + SC.STATUS_INITIATED + '] can be requested', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    estimation.status = SC.STATUS_ESTIMATION_REQUESTED
    estimation.statusHistory.push({
        name: estimation.negotiator.firstName,
        status: SC.STATUS_ESTIMATION_REQUESTED
    })
    await estimation.save()
    estimation = estimation.toObject()
    estimation.loggedInUserRole = SC.ROLE_NEGOTIATOR
    return estimation
}


/*
Task of feature are checked and updated by Estimator that ist can be approved or not
*/
estimationSchema.statics.canApprove = async (estimationID, estimator) => {
    try {
        let estimationTaskPromises
        let EstimationPendingFeatures

        let EstimationTasks = await MDL.EstimationTaskModel.find({'estimation._id': estimationID}, {'isDeleted': false})
        if (!EstimationTasks || !(EstimationTasks.length)) {
            return new Promise((resolve, reject) => {
                return resolve(false)
            })
        }

        let EstimationPendingTasks = await MDL.EstimationTaskModel.find({'estimation._id': estimationID}, {'isDeleted': false}, {'status': SC.STATUS_PENDING})
        let estimationTasks

        if (EstimationPendingTasks && (EstimationPendingTasks.length)) {
            estimationTaskPromises = EstimationPendingTasks.map(async task => {
                if (task.estimator.changeRequested
                    || (!task.estimator.estimatedHours || task.estimator.estimatedHours == 0)
                    || _.isEmpty(task.estimator.name)
                    || _.isEmpty(task.estimator.description)) {
                    return MDL.EstimationTaskModel.updateOne({_id: task._id}, {'canApprove': false})
                } else return MDL.EstimationTaskModel.updateOne({_id: task._id}, {'canApprove': true})

            })

            estimationTasks = await Promise.all(estimationTaskPromises)

        }
        if (EstimationPendingTasks && (EstimationPendingTasks.length)) {
            estimationTaskPromises = EstimationPendingTasks.map(async task => {
                if ((!task.estimator.estimatedHours || task.estimator.estimatedHours == 0)
                    || _.isEmpty(task.estimator.name)
                    || _.isEmpty(task.estimator.description)) {
                    return MDL.EstimationTaskModel.updateOne({_id: task._id}, {'hasError': true})
                } else return MDL.EstimationTaskModel.updateOne({_id: task._id}, {'hasError': false})

            })

            estimationTasks = await Promise.all(estimationTaskPromises)

        }
        if (EstimationTasks && EstimationTasks.length) {

            EstimationPendingFeatures = await MDL.EstimationFeatureModel.find({'estimation._id': estimationID}, {'isDeleted': false}, {'status': SC.STATUS_PENDING})
            if (EstimationPendingFeatures && EstimationPendingFeatures.length) {

                let estimationFeaturePromises = EstimationPendingFeatures.map(async feature => {
                    if (feature.estimator.changeRequested
                        || (!feature.estimator.estimatedHours || feature.estimator.estimatedHours == 0)
                        || _.isEmpty(feature.estimator.name)
                        || _.isEmpty(feature.estimator.description)) {
                        // console.log("bk 6")
                        return MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {'canApprove': false})
                    } else {

                        return new Promise((resolve, reject) => {
                            //  console.log("bk 7")
                            MDL.EstimationTaskModel.count({
                                'feature._id': feature._id,
                                'isDeleted': false,
                                'status': SC.STATUS_PENDING
                            }).then((count) => {
                                // console.log("count is ", count)
                                if (count) {
                                    // console.log("bk3")
                                    MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {'canApprove': false}).then(() => {
                                        resolve(true)
                                    })
                                }
                                else {
                                    // console.log("bk4")
                                    MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {'canApprove': true}).then(() => {
                                        resolve(true)
                                    })
                                }

                            }).catch(error => {

                            })
                        })
                    }
                })


                let estimationFeatures = await Promise.all(estimationFeaturePromises)

            }
        }
        let isEstimationTaskPending = await MDL.EstimationTaskModel.count({
            'estimation._id': estimationID,
            'isDeleted': false,
            'status': SC.STATUS_PENDING
        })
        let isEstimationFeaturePending = await MDL.EstimationFeatureModel.count({
            'estimation._id': estimationID,
            'isDeleted': false,
            'status': SC.STATUS_PENDING
        })
        if (isEstimationTaskPending == 0 && isEstimationFeaturePending == 0) {

            let a = await EstimationModel.updateOne({_id: estimationID}, {'canApprove': true}).then(() => {
                return new Promise((resolve, reject) => {
                    return resolve(true)
                })
            })

            return a
        }
        else return await EstimationModel.updateOne({_id: estimationID}, {'canApprove': false})
    }
    catch (e) {
        //  console.log("can approve error : ", e)
    }
}

estimationSchema.statics.requestReview = async (estimationID, estimator) => {

    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (estimation.estimator._id != estimator._id)
        throw new AppError('Not an estimator of this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError('Only estimations with status [' + SC.STATUS_ESTIMATION_REQUESTED + ',' + SC.STATUS_CHANGE_REQUESTED + '] can be requested for review', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)
    let result = await EstimationModel.canApprove(estimation._id, estimator)
    // console.log("can Approve Result", result)
    await MDL.EstimationTaskModel.update({
        'estimation._id': estimation._id,
        'owner': SC.OWNER_NEGOTIATOR
    }, {$set: {addedInThisIteration: false}}, {multi: true})

    // Reset change request by estimator, if edit was already granted
    await MDL.EstimationTaskModel.update({
        'estimation._id': estimation._id,
        'negotiator.changeGranted': true,
        'estimator.changeRequested': true,
    }, {$set: {'estimator.changeRequested': false}}, {multi: true})

    // Reset removal request by estimator, if negotiator has deleted that task
    await MDL.EstimationTaskModel.update({
        'estimation._id': estimation._id,
        'isDeleted': true,
        'estimator.removalRequested': true
    }, {$set: {'estimator.removalRequested': false}}, {multi: true})


    /**
     * Reset negotiator flags
     */
    await MDL.EstimationTaskModel.update({
        'estimation._id': estimation._id,
    }, {
        $set: {
            'negotiator.changedInThisIteration': false,
            'negotiator.changeSuggested': false,
            'negotiator.changeGranted': false,
            'negotiator.isMovedToFeature': false,
            'negotiator.isMovedOutOfFeature': false
        }
    }, {multi: true})

    // Add changed in this iteration flag of estimator to true if there are pending requests (change, removal)
    await MDL.EstimationTaskModel.update({
            $and: [{'estimation._id': estimation._id}, {
                $or: [
                    {'estimator.changeRequested': true},
                    {'estimator.removalRequested': true}
                ]
            }]
        },
        {
            $set:
                {'estimator.changedInThisIteration': true}
        }, {multi: true}
    )

    await
        MDL.EstimationFeatureModel.update({
            'estimation._id': estimation._id,
            'owner': SC.OWNER_NEGOTIATOR
        }, {$set: {addedInThisIteration: false}}, {multi: true})

// Reset change request by estimator, if edit was already granted
    await
        MDL.EstimationFeatureModel.update({
            'estimation._id': estimation._id,
            'negotiator.changeGranted': true,
            'estimator.changeRequested': true,
        }, {$set: {'estimator.changeRequested': false}}, {multi: true})

// Reset removal request by estimator, if negotiator has deleted that task
    await
        MDL.EstimationFeatureModel.update({
            'estimation._id': estimation._id,
            'isDeleted': true,
            'estimator.removalRequested': true
        }, {$set: {'estimator.removalRequested': false}}, {multi: true})


    /**
     * Reset negotiator flags
     */
    await
        MDL.EstimationFeatureModel.update({
            'estimation._id': estimation._id,
        }, {
            $set: {
                'negotiator.changedInThisIteration': false,
                'negotiator.changeSuggested': false,
                'negotiator.changeGranted': false
            }
        }, {multi: true})

// Add changed in this iteration flag of estimator to true if there are pending requests (change, removal)
    await
        MDL.EstimationFeatureModel.update({
            'estimation._id': estimation._id,
            '$or': [{'estimator.removalRequested': true, 'estimator.changeRequested': true}]
        }, {$set: {'estimator.changedInThisIteration': true}}, {multi: true})


    estimation = await
        EstimationModel.findOneAndUpdate({_id: estimation._id}, {
            $set: {status: SC.STATUS_REVIEW_REQUESTED},
            $push: {
                statusHistory: {
                    name: estimator.firstName,
                    status: SC.STATUS_REVIEW_REQUESTED
                }
            }
        }, {
            new: true,
            lean: true
        })
    estimation.loggedInUserRole = SC.ROLE_ESTIMATOR
    return estimation
}

estimationSchema.statics.requestChange = async (estimationID, negotiator) => {
    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id != negotiator._id)
        throw new AppError('Not a negotiator of this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError('Only estimations with status [' + SC.STATUS_REVIEW_REQUESTED + '] can be requested for change', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    await MDL.EstimationTaskModel.update({
        'estimation._id': estimation._id,
        'owner': SC.OWNER_ESTIMATOR
    }, {$set: {addedInThisIteration: false}}, {multi: true})

    await MDL.EstimationTaskModel.update({
            'estimation._id': estimation._id,
        },
        {
            $set: {
                'estimator.changedInThisIteration': false,
                'estimator.changedKeyInformation': false,
                'estimator.isMovedToFeature': false,
                'estimator.isMovedOutOfFeature': false
            }
        }, {multi: true})

    await MDL.EstimationFeatureModel.update({
        'estimation._id': estimation._id,
        'owner': SC.OWNER_ESTIMATOR
    }, {$set: {addedInThisIteration: false}}, {multi: true})

    await MDL.EstimationFeatureModel.update({
            'estimation._id': estimation._id
        },
        {
            $set: {
                'estimator.changedInThisIteration': false,
                'estimator.changedKeyInformation': false,
                'estimator.isMovedToFeature': false,
                'estimator.isMovedOutOfFeature': false
            }
        }, {multi: true}
    )

    estimation = await
        EstimationModel.findOneAndUpdate({_id: estimation._id}, {
            $set: {status: SC.STATUS_CHANGE_REQUESTED},
            $push: {
                statusHistory: {
                    name: negotiator.firstName,
                    status: SC.STATUS_CHANGE_REQUESTED
                }
            }
        }, {
            new: true,
            lean: true
        })
    estimation.loggedInUserRole = SC.ROLE_NEGOTIATOR
    return estimation
}


estimationSchema.statics.approveEstimation = async (estimationID, user) => {
    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let userRoleInEstimation = await EstimationModel.getUserRoleInEstimation(estimationID, user)

    logger.debug("EstimationModel(): user role in this estimation ", {userRoleInEstimation})

    if (userRoleInEstimation !== SC.ROLE_NEGOTIATOR)
        throw new AppError('Not a negotiator of this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError('Only estimations with status [' + SC.STATUS_REVIEW_REQUESTED + '] can be approved by the Negotiator', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let pendingTasksCount = await MDL.EstimationTaskModel.count({
        'estimation._id': estimation._id,
        'isDeleted': false,
        status: SC.STATUS_PENDING
    })
    let pendingFeaturesCount = await MDL.EstimationFeatureModel.count({
        'estimation._id': estimation._id,
        'isDeleted': false,
        status: SC.STATUS_PENDING
    })
    let availableTasksCount = await MDL.EstimationTaskModel.count({
        'estimation._id': estimation._id,
        'isDeleted': false
    })

    if (availableTasksCount == 0)
        throw new AppError('Estimation approve failed as there are no tasks available', EC.NO_TASKS_ERROR, EC.HTTP_BAD_REQUEST)

    if (pendingTasksCount > 0 || pendingFeaturesCount > 0 || !estimation.canApprove)
        throw new AppError('Estimation approve failed as there are still pending tasks/features', EC.STILL_PENDING_TASKS_AND_FEATURE_ERROR, EC.HTTP_BAD_REQUEST)


    if (estimation.estimatedHours == 0)
        throw new AppError('Estimation approve failed as there is no estimated hours for estimator tasks/features', EC.NO_ESTIMATED_HOUR_ERROR, EC.HTTP_BAD_REQUEST)


    let statusHistory = {}
    statusHistory.name = user.firstName + ' ' + user.lastName
    statusHistory.status = SC.STATUS_APPROVED
    statusHistory.date = Date.now()

    let existingEstimationStatusHistory = estimation.statusHistory
    if (existingEstimationStatusHistory && existingEstimationStatusHistory.length > 0)
        existingEstimationStatusHistory.push(statusHistory)
    else
        existingEstimationStatusHistory = [statusHistory]

    estimation.statusHistory = existingEstimationStatusHistory
    estimation.status = SC.STATUS_APPROVED
    estimation.canApprove = false
    estimation.updated = Date.now()

    await estimation.save()
    estimation = estimation.toObject()
    estimation.loggedInUserRole = SC.ROLE_NEGOTIATOR
    return estimation
}


estimationSchema.statics.canApproveEstimationByNegotiator = async (estimationID, negotiator) => {
    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id != negotiator._id)
        throw new AppError('Not a negotiator of this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError('Only estimations with status [' + SC.STATUS_REVIEW_REQUESTED + '] can approve by negotiator', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.estimatedHours == 0)
        throw new AppError('Estimation approve failed as there is no estimated hours for estimator tasks/features', EC.NO_ESTIMATED_HOUR_ERROR, EC.HTTP_BAD_REQUEST)

    let availableTasksCount = await MDL.EstimationTaskModel.count({
        'estimation._id': estimation._id,
        'isDeleted': false
    })

    if (availableTasksCount == 0)
        throw new AppError('Estimation approve failed as there are no tasks available', EC.NO_TASKS_ERROR, EC.HTTP_BAD_REQUEST)

    let pendingTasksCount = await MDL.EstimationTaskModel.count({
        'estimation._id': estimation._id,
        'isDeleted': false,
        status: SC.STATUS_PENDING
    })

    let pendingFeaturesCount = await MDL.EstimationFeatureModel.count({
        'estimation._id': estimation._id,
        'isDeleted': false,
        status: SC.STATUS_PENDING
    })


    if (pendingTasksCount > 0 || pendingFeaturesCount > 0)
        throw new AppError('Estimation approve failed as there are still pending tasks/features', EC.STILL_PENDING_TASKS_AND_FEATURE_ERROR, EC.HTTP_BAD_REQUEST)

    estimation.canApprove = true
    estimation.updated = Date.now()

    await estimation.save()
    estimation = estimation.toObject()
    estimation.loggedInUserRole = SC.ROLE_NEGOTIATOR
    return estimation
}


estimationSchema.statics.canNotApproveEstimationByNegotiator = async (estimationID, isGranted, user) => {

    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (isGranted && userHasRole(user, SC.ROLE_NEGOTIATOR && estimation.negotiator._id != user._id)) {
        estimation.status = SC.STATUS_REVIEW_REQUESTED
    }
    estimation.canApprove = false
    estimation.updated = Date.now()
    await estimation.save()
    estimation = estimation.toObject()
    estimation.loggedInUserRole = SC.ROLE_NEGOTIATOR
    return estimation
}

estimationSchema.statics.createReleaseFromEstimation = async (releaseInput, negotiator) => {
    V.validate(releaseInput, V.estimationCreateReleaseByNegotiatorStruct)
    let estimation = await EstimationModel.findById(releaseInput.estimation._id)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id.toString() !== negotiator._id.toString())
        throw new AppError('Not a negotiator of this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_APPROVED], estimation.status))
        throw new AppError('Only estimations with status [' + SC.STATUS_APPROVED + '] can project award by negotiator', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    releaseInput.estimation = estimation

    // Create new release
    const release = await MDL.ReleaseModel.createRelease(releaseInput, negotiator, estimation)
    if (!release)
        throw new AppError('Release not created', EC.SERVER_ERROR, EC.HTTP_SERVER_ERROR)

    // Find all the tasks from estimation so that we can add them against iteration of new release
    const taskList = await MDL.EstimationTaskModel.find({
        'estimation._id': estimation._id,
        'isDeleted': false
    })
    if (!taskList && !taskList.length > 0)
        throw new AppError('Task list not found for default release plan', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimationTasksCopyAndReadyForReleasePlanPromises = taskList.map(estimationTask => {
        return MDL.ReleasePlanModel.addEstimatedReleasePlan(release, 0, estimation, estimationTask)
    })

    await Promise.all(estimationTasksCopyAndReadyForReleasePlanPromises)

    let newStatusHistory = {
        name: negotiator.firstName + ' ' + negotiator.lastName,
        date: Date.now(),
        status: SC.STATUS_PROJECT_AWARDED
    }
    let existingStatusHistory = estimation.statusHistory
    if (existingStatusHistory && _.isArray(existingStatusHistory)) {
        existingStatusHistory.push(newStatusHistory)
    } else {
        existingStatusHistory = []
        existingStatusHistory.push(newStatusHistory)
    }
    estimation.release = release
    estimation.statusHistory = existingStatusHistory
    estimation.status = SC.STATUS_PROJECT_AWARDED
    estimation.updated = Date.now()

    await estimation.save()
    estimation = estimation.toObject()
    estimation.loggedInUserRole = SC.ROLE_NEGOTIATOR
    return estimation
}

estimationSchema.statics.addEstimationToExistingRelease = async (releaseInput, negotiator) => {
    V.validate(releaseInput, V.estimationAddToReleaseByNegotiatorStruct)
    let estimation = await EstimationModel.findById(releaseInput.estimation._id)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id.toString() !== negotiator._id.toString())
        throw new AppError('Not a negotiator of this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_APPROVED], estimation.status))
        throw new AppError('Only estimations with status [' + SC.STATUS_APPROVED + '] can be added to release', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    releaseInput.estimation = estimation
    const release = await  MDL.ReleaseModel.updateRelease(releaseInput, negotiator, estimation)

    const taskList = await MDL.EstimationTaskModel.find({
        'estimation._id': estimation._id,
        'isDeleted': false
    })

    if (!taskList && !taskList.length > 0)
        throw new AppError('Task list not found for default release plan', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimationTasksCopyAndReadyForReleasePlanPromises = taskList.map(estimationTask => {
        // Iteration corresponding to this would be added at last position so index would be last index
        return MDL.ReleasePlanModel.addEstimatedReleasePlan(release, release.iterations.length - 1, estimation, estimationTask)
    })

    await Promise.all(estimationTasksCopyAndReadyForReleasePlanPromises)

    let newStatusHistory = {
        name: negotiator.firstName + ' ' + negotiator.lastName,
        date: Date.now(),
        status: SC.STATUS_PROJECT_AWARDED
    }

    let existingStatusHistory = estimation.statusHistory
    if (existingStatusHistory && _.isArray(existingStatusHistory)) {
        existingStatusHistory.push(newStatusHistory)
    } else {
        existingStatusHistory = []
        existingStatusHistory.push(newStatusHistory)
    }
    estimation.release = release
    estimation.statusHistory = existingStatusHistory
    estimation.status = SC.STATUS_PROJECT_AWARDED
    estimation.updated = Date.now()

    await estimation.save()
    estimation = estimation.toObject()
    estimation.loggedInUserRole = SC.ROLE_NEGOTIATOR
    return estimation
}

estimationSchema.statics.reOpenEstimationByNegotiator = async (estimationID, negotiator) => {
    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id != negotiator._id)
        throw new AppError('Not a negotiator of this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_APPROVED], estimation.status))
        throw new AppError('Only estimations with status [' + SC.STATUS_APPROVED + '] can reopen by negotiator', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)


    let statusHistory = {}
    statusHistory.name = negotiator.firstName + ' ' + negotiator.lastName
    statusHistory.status = SC.STATUS_REVIEW_REQUESTED
    statusHistory.date = Date.now()

    let existingEstimationStatusHistory = estimation.statusHistory
    if (existingEstimationStatusHistory && existingEstimationStatusHistory.length > 0)
        existingEstimationStatusHistory.push(statusHistory)
    else
        existingEstimationStatusHistory = [statusHistory]

    estimation.statusHistory = existingEstimationStatusHistory
    estimation.status = SC.STATUS_REVIEW_REQUESTED
    estimation.canApprove = true
    estimation.updated = Date.now()

    await estimation.save()
    estimation = estimation.toObject()
    estimation.loggedInUserRole = SC.ROLE_NEGOTIATOR
    return estimation
}


estimationSchema.statics.hasErrorEstimationByEstimator = async (estimationID, estimator) => {
    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not a estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (estimation.estimator._id != estimator._id)
        throw new AppError('Not a estimator of this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (_.includes([SC.STATUS_APPROVED], estimation.status))
        throw new AppError('estimation with status [' + SC.STATUS_APPROVED + '] can not have any error no need to check', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)


    let errorTaskCount = await MDL.EstimationTaskModel.count({
        'estimation._id': estimation._id,
        'isDeleted': false,
        'hasError': true
    })
    let errorFeatureCount = await MDL.EstimationFeatureModel.count({
        'estimation._id': estimation._id,
        'isDeleted': false,
        'hasError': true
    })

    estimation.hasError = (errorTaskCount > 0 || errorFeatureCount > 0) ? true : false

    await estimation.save()
    estimation = estimation.toObject()
    estimation.loggedInUserRole = SC.ROLE_ESTIMATOR
    return estimation


}


const EstimationModel = mongoose.model('Estimation', estimationSchema)
export default EstimationModel