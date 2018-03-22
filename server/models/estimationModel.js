import mongoose from 'mongoose'
import AppError from '../AppError'
import {
    EstimationFeatureModel,
    EstimationTaskModel,
    ProjectModel,
    ReleaseModel,
    ReleasePlanModel,
    UserModel
} from "./index"
import * as SC from '../serverconstants'
import * as EC from '../errorcodes'
import {userHasRole} from "../utils"
import * as V from '../validation'
import _ from 'lodash'

mongoose.Promise = global.Promise

let estimationSchema = mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: [SC.STATUS_INITIATED, SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_REVIEW_REQUESTED, SC.STATUS_CHANGE_REQUESTED, SC.STATUS_APPROVED, SC.STATUS_REOPENED, SC.STATUS_PROJECT_AWARDED]
    },
    technologies: [String],
    description: String,
    canApprove: {type: Boolean, default: false},
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


estimationSchema.statics.getAllActive = async (user) => {

    console.log("user id is ", user._id)
    let estimations = []
    if (userHasRole(user, SC.ROLE_ESTIMATOR)) {
        console.log("user has estimator role")
        // Estimator would only see those estimations that don't have initiated status and this user is estimator
        let estimatorEstimations = await EstimationModel.find({
            isArchived: false,
            isDeleted: false,
            "estimator._id": mongoose.Types.ObjectId(user._id),
            status: {$ne: SC.STATUS_INITIATED}
        }, {
            description: 1,
            project: 1,
            client: 1,
            technologies: 1,
            estimator: 1,
            negotiator: 1,
            status: 1
        })

        console.log("estimator estimations ", estimatorEstimations)

        estimations = [...estimatorEstimations]

    }

    if (userHasRole(user, SC.ROLE_NEGOTIATOR)) {
        console.log("user has negotiator role")
        // Negotiator would only see all estimations where he is negotiator
        let negotiatorEstimations = await EstimationModel.find({
            isArchived: false,
            isDeleted: false,
            "negotiator._id": mongoose.Types.ObjectId(user._id)
        }, {
            description: 1,
            project: 1,
            client: 1,
            technologies: 1,
            estimator: 1,
            negotiator: 1,
            status: 1
        })
        estimations = [...estimations, ...negotiatorEstimations]
    }
    return estimations
}

estimationSchema.statics.getById = async estimationID => {

    console.log("finding estimation with id ", estimationID)
    //return await EstimationModel.findById(estimationID)
    // this API would return more details about selected estimation
    let estimations = await EstimationModel.aggregate({
        $match: {
            _id: mongoose.Types.ObjectId(estimationID)
        },
    }, {
        $lookup: {
            from: 'estimationtasks',
            let: {estimationID: "$_id"},
            pipeline: [{
                $match: {
                    $expr: {
                        $and: [
                            {$eq: ["$estimation._id", "$$estimationID"]},
                            {$eq: [{$ifNull: ["$feature._id", true]}, true]}
                        ]
                    }
                }
            }],
            as: 'tasks'
        }
    }, {
        $lookup: {
            from: 'estimationfeatures',
            let: {estimationID: "$_id"},
            pipeline: [{
                $match: {
                    $expr: {
                        $and: [
                            {$eq: ["$estimation._id", "$$estimationID"]}
                        ]
                    }
                }

            }, {
                $lookup: {
                    from: 'estimationtasks',
                    localField: "_id",
                    foreignField: "feature._id",
                    as: "tasks"
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

    let project = await ProjectModel.findById(estimationInput.project._id)
    if (!project)
        throw new AppError('Project not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimator = await UserModel.findById(estimationInput.estimator._id)
    if (!userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!estimator)
        throw new AppError('Estimator not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    estimationInput.status = SC.STATUS_INITIATED
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
        throw new AppError('Only estimations with status [' + SC.STATUS_INITIATED + "] can Edit", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let project = await ProjectModel.findById(estimationInput.project._id)
    if (!project)
        throw new AppError('Project not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimator = await UserModel.findById(estimationInput.estimator._id)
    if (!userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!estimator)
        throw new AppError('Estimator not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    estimation.status = SC.STATUS_INITIATED
    estimation.project = project
    estimation.client = project.client
    estimation.estimator = estimator
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
        throw new AppError('Only estimations with status [' + SC.STATUS_INITIATED + "] can be requested", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

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

        let EstimationTasks = await EstimationTaskModel.find({"estimation._id": estimationID}, {"isDeleted": false})
        if (!EstimationTasks || !(EstimationTasks.length)) {
            return new Promise((resolve, reject) => {
                return resolve(false)
            })
        }

        let EstimationPendingTasks = await EstimationTaskModel.find({"estimation._id": estimationID}, {"isDeleted": false}, {"status": SC.STATUS_PENDING})
        let estimationTasks

        if (EstimationPendingTasks && (EstimationPendingTasks.length)) {
            estimationTaskPromises = EstimationPendingTasks.map(async task => {
                if (task.estimator.changeRequested
                    || task.estimator.removalRequested
                    || (!task.estimator.estimatedHours || task.estimator.estimatedHours == 0)
                    || _.isEmpty(task.estimator.name)
                    || _.isEmpty(task.estimator.description)) {
                    return EstimationTaskModel.updateOne({_id: task._id}, {"canApprove": false})
                } else return EstimationTaskModel.updateOne({_id: task._id}, {"canApprove": true})

            })
            console.log("bk1 before ")
            estimationTasks = await Promise.all(estimationTaskPromises)
            console.log("estimation tasks found bk 1", estimationTasks)
        }
        if (EstimationTasks && EstimationTasks.length) {

            EstimationPendingFeatures = await EstimationFeatureModel.find({"estimation._id": estimationID}, {"isDeleted": false}, {"status": SC.STATUS_PENDING})
            if (EstimationPendingFeatures && EstimationPendingFeatures.length) {
                console.log("bk2 before ")
                let estimationFeaturePromises = EstimationPendingFeatures.map(async feature => {
                    if (feature.estimator.changeRequested
                        || feature.estimator.removalRequested
                        || (!feature.estimator.estimatedHours || feature.estimator.estimatedHours == 0)
                        || _.isEmpty(feature.estimator.name)
                        || _.isEmpty(feature.estimator.description)) {
                        console.log("bk 6")
                        return EstimationFeatureModel.updateOne({_id: feature._id}, {"canApprove": false})
                    } else {
                        console.log("bk 5")
                        return new Promise((resolve, reject) => {
                            console.log("bk 7")
                            EstimationTaskModel.count({
                                "feature._id": feature._id,
                                "isDeleted": false,
                                "status": SC.STATUS_PENDING
                            }).then((count) => {
                                console.log("count is ", count)
                                if (count) {
                                    console.log("bk3")
                                    EstimationFeatureModel.updateOne({_id: feature._id}, {"canApprove": false}).then(() => {
                                        resolve(true)
                                    })
                                }
                                else {
                                    console.log("bk4")
                                    EstimationFeatureModel.updateOne({_id: feature._id}, {"canApprove": true}).then(() => {
                                        resolve(true)
                                    })
                                }

                            }).catch(error => {
                                console.log("count has errors ", error)
                            })
                        })
                    }
                })
                console.log("estimationFeaturePromises----", estimationFeaturePromises)

                let estimationFeatures = await Promise.all(estimationFeaturePromises)

            }
        }
        let isEstimationTaskPending = await EstimationTaskModel.count({
            "estimation._id": estimationID,
            "isDeleted": false,
            "status": SC.STATUS_PENDING
        })
        let isEstimationFeaturePending = await EstimationFeatureModel.count({
            "estimation._id": estimationID,
            "isDeleted": false,
            "status": SC.STATUS_PENDING
        })
        if (isEstimationTaskPending == 0 && isEstimationFeaturePending == 0) {
            console.log("Estimation Can approve Before")
           let a =  await EstimationModel.updateOne({_id: estimationID}, {"canApprove": true}).then(() => {
                return new Promise((resolve, reject) => {
                    return resolve(true)
                })
            })
            console.log("Estimation Can approve After", a)
            return a
        }
        else return EstimationPendingFeatures
    }
    catch (e) {
        console.log("can approve error : ", e)
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
        throw new AppError('Only estimations with status [' + SC.STATUS_ESTIMATION_REQUESTED + "," + SC.STATUS_CHANGE_REQUESTED + "] can be requested for review", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)
    let result = await EstimationModel.canApprove(estimation._id, estimator)
    console.log("can Approve Result", result)
    await EstimationTaskModel.update({
        "estimation._id": estimation._id,
        "owner": SC.OWNER_NEGOTIATOR
    }, {$set: {addedInThisIteration: false}}, {multi: true})

    // Reset change request by estimator, if edit was already granted
    await EstimationTaskModel.update({
        "estimation._id": estimation._id,
        "negotiator.changeGranted": true,
        "estimator.changeRequested": true,
    }, {$set: {"estimator.changeRequested": false}}, {multi: true})

    // Reset removal request by estimator, if negotiator has deleted that task
    await EstimationTaskModel.update({
        "estimation._id": estimation._id,
        "isDeleted": true,
        "estimator.removalRequested": true
    }, {$set: {"estimator.removalRequested": false}}, {multi: true})


    /**
     * Reset negotiator flags
     */
    await EstimationTaskModel.update({
        "estimation._id": estimation._id,
    }, {
        $set: {
            "negotiator.changedInThisIteration": false,
            "negotiator.changeSuggested": false,
            "negotiator.changeGranted": false,
            "negotiator.isMovedToFeature": false,
            "negotiator.isMovedOutOfFeature": false
        }
    }, {multi: true})

    // Add changed in this iteration flag of estimator to true if there are pending requests (change, removal)
    await EstimationTaskModel.update({
            $and: [{"estimation._id": estimation._id}, {
                $or: [
                    {"estimator.changeRequested": true},
                    {"estimator.removalRequested": true}
                ]
            }]
        },
        {
            $set:
                {"estimator.changedInThisIteration": true}
        }, {multi: true}
    )

    await
        EstimationFeatureModel.update({
            "estimation._id": estimation._id,
            "owner": SC.OWNER_NEGOTIATOR
        }, {$set: {addedInThisIteration: false}}, {multi: true})

// Reset change request by estimator, if edit was already granted
    await
        EstimationFeatureModel.update({
            "estimation._id": estimation._id,
            "negotiator.changeGranted": true,
            "estimator.changeRequested": true,
        }, {$set: {"estimator.changeRequested": false}}, {multi: true})

// Reset removal request by estimator, if negotiator has deleted that task
    await
        EstimationFeatureModel.update({
            "estimation._id": estimation._id,
            "isDeleted": true,
            "estimator.removalRequested": true
        }, {$set: {"estimator.removalRequested": false}}, {multi: true})


    /**
     * Reset negotiator flags
     */
    await
        EstimationFeatureModel.update({
            "estimation._id": estimation._id,
        }, {
            $set: {
                "negotiator.changedInThisIteration": false,
                "negotiator.changeSuggested": false,
                "negotiator.changeGranted": false
            }
        }, {multi: true})

// Add changed in this iteration flag of estimator to true if there are pending requests (change, removal)
    await
        EstimationFeatureModel.update({
            "estimation._id": estimation._id,
            "$or": [{"estimator.removalRequested": true, "estimator.changeRequested": true}]
        }, {$set: {"estimator.changedInThisIteration": true}}, {multi: true})


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
        throw new AppError("Only estimations with status [" + SC.STATUS_REVIEW_REQUESTED + "] can be requested for change", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    await EstimationTaskModel.update({
        "estimation._id": estimation._id,
        "owner": SC.OWNER_ESTIMATOR
    }, {$set: {addedInThisIteration: false}}, {multi: true})

    await EstimationTaskModel.update({
            "estimation._id": estimation._id,
        },
        {
            $set: {
                "estimator.changedInThisIteration": false,
                "estimator.changedKeyInformation": false,
                "estimator.isMovedToFeature": false,
                "estimator.isMovedOutOfFeature": false
            }
        }, {multi: true})

    await EstimationFeatureModel.update({
        "estimation._id": estimation._id,
        "owner": SC.OWNER_ESTIMATOR
    }, {$set: {addedInThisIteration: false}}, {multi: true})

    await EstimationFeatureModel.update({
            "estimation._id": estimation._id
        },
        {
            $set: {
                "estimator.changedInThisIteration": false,
                "estimator.changedKeyInformation": false,
                "estimator.isMovedToFeature": false,
                "estimator.isMovedOutOfFeature": false
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


estimationSchema.statics.approveEstimationByNegotiator = async (estimationID, negotiator) => {
    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id != negotiator._id)
        throw new AppError('Not a negotiator of this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Only estimations with status [" + SC.STATUS_REVIEW_REQUESTED + "] can approve by negotiator", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let pendingTasksCount = await EstimationTaskModel.count({
        "estimation._id": estimation._id,
        "isDeleted" :false,
        status: SC.STATUS_PENDING
    })
    let pendingFeaturesCount = await EstimationFeatureModel.count({
        "estimation._id": estimation._id,
        "isDeleted" :false,
        status: SC.STATUS_PENDING
    })


    if (pendingTasksCount > 0 || pendingFeaturesCount > 0 || !estimation.canApprove)
        throw new AppError('Estimation approve failed as there are still pending tasks/features', EC.STILL_PENDING_TASKS_AND_FEATURE_ERROR, EC.HTTP_BAD_REQUEST)

    let statusHistory = {}
    statusHistory.name = negotiator.firstName + ' ' + negotiator.lastName
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

    return await estimation.save()
}

estimationSchema.statics.projectAwardByNegotiator = async (projectAwardData, negotiator) => {

    if (!userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findById(projectAwardData.estimation._id)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!estimation.negotiator._id == negotiator._id)
        throw new AppError('Not a negotiator of this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_APPROVED], estimation.status))
        throw new AppError("Only estimations with status [" + SC.STATUS_APPROVED + "] can project award by negotiator", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    projectAwardData.estimation = estimation
    const release = await  ReleaseModel.addRelease(projectAwardData, negotiator)
    if (!release)
        throw new AppError('No such release', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let releasePlanInput = {}
    releasePlanInput.estimation = estimation
    releasePlanInput.status = SC.STATUS_PLAN_REQUESTED
    releasePlanInput.release = release
    releasePlanInput.owner = SC.OWNER_MANAGER
    releasePlanInput.flags = [SC.FLAG_UNPLANNED]

    const taskList = await EstimationTaskModel.find({"estimation._id": estimation._id})
    if (!taskList && !taskList.length > 0)
        throw new AppError('Task list not found for default release plan', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimationTasksCopyAndReadyForReleasePlanPromises = taskList.map(task => {
        let updateTask = {}
        let report = {}
        updateTask._id = task._id
        updateTask.name = task.negotiator.name
        updateTask.estimatedHours = task.negotiator.estimatedHours
        releasePlanInput.task = updateTask
        report.finalStatus = SC.STATUS_UNPLANNED
        releasePlanInput.report = report
        const releasePlan = ReleasePlanModel.addReleasePlan(releasePlanInput)
    })

    let releasePlans = await Promise.all(estimationTasksCopyAndReadyForReleasePlanPromises)

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

    return await estimation.save()
}

const EstimationModel = mongoose.model("Estimation", estimationSchema)
export default EstimationModel