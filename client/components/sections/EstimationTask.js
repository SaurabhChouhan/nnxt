import React from 'react'
import PropTypes from 'prop-types'

import * as logger from '../../clientLogger'
import * as SC from '../../../server/serverconstants'
import _ from 'lodash'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {connect} from 'react-redux'
import {initialize} from 'redux-form'
import {NotificationManager} from 'react-notifications'
import * as EC from "../../../server/errorcodes";

class EstimationTask extends React.PureComponent {

    render() {
        const {task, loggedInUserRole, estimationStatus, expanded, isFeatureTask} = this.props
        let buttons = [];

        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'logged in user is ', loggedInUserRole)
        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'task owner ', task.owner)
        logger.debug(logger.ESTIMATION_TASK_RENDER, this.props)

        let editView = false
        if (loggedInUserRole == SC.ROLE_NEGOTIATOR && _.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimationStatus) || loggedInUserRole == SC.ROLE_ESTIMATOR && _.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimationStatus))
            editView = true


        if (loggedInUserRole == SC.ROLE_NEGOTIATOR) {
            // First button shown to negotiator would be suggestion button (kind of edit button)
            if (task.negotiator.changeSuggested) {
                // Negotiator has suggested changes in this iteration so show that to negotiator,
                buttons.push(editView ? <img key="suggestion_outgoing" src="/images/suggestion_outgoing.png"
                                             onClick={() => {
                                                 this.props.openTaskSuggestionForm(task, loggedInUserRole)
                                             }}/> :
                    <img key="suggestion_outgoing" src="/images/suggestion_outgoing_disable.png"/>)
            } else if (task.estimator.changedKeyInformation) {
                // Estimator has changed key information in previous iteration, so show that to negotiator
                buttons.push(editView ? <img key="suggestion_incoming" src="/images/suggestion_incoming.png"
                                             onClick={() => {
                                                 this.props.openTaskSuggestionForm(task, loggedInUserRole)
                                             }}/> :
                    <img key="suggestion_incoming" src="/images/suggestion_incoming_disable.png"/>)
            } else {
                // Show normal suggestion button
                buttons.push(editView ? <img key="suggestion" src="/images/suggestion.png"
                                             onClick={() => {
                                                 this.props.openTaskSuggestionForm(task, loggedInUserRole)
                                             }}/> : <img key="suggestion" src="/images/suggestion_disable.png"/>)
            }

            // Second button shown to Negotiator would be related to edit requests (by estimator)/edit granted (by negotiator)
            if (task.estimator.changeRequested) {
                if (task.negotiator.changeGranted) {
                    // estimator has requested change which negotiator has granted
                    logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/changeGranted, he_granted_edit')
                    buttons.push(editView ? <img key="granted_edit" src="/images/granted_edit.png"
                                                 onClick={() => {
                                                     this.props.toggleGrantEdit(task)
                                                 }}/> :
                        <img key="granted_edit" src="/images/granted_edit_disable.png"/>)
                } else {
                    // estimator has requested change but negotiator has not granted it till now
                    logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/not granted, requested_edit')
                    buttons.push(editView ? <img key="he_requested_edit" src="/images/he_requested_edit.png"
                                                 onClick={() => {
                                                     this.props.toggleGrantEdit(task)
                                                 }}/> :
                        <img key="he_requested_edit" src="/images/he_requested_edit_disable.png"/>)
                }
            }

            // Third button shown to negotiator would be related to removal request (by estimator)/ delete button
            if (task.estimator.removalRequested) {
                // Estimator has requested removal, negotiator will directly delete task if he wants to
                buttons.push(editView ? <img key="he_requested_delete" src="/images/he_requested_delete.png"
                                             onClick={() => {
                                                 this.props.deleteTask(task)
                                             }}/> :
                    <img key="he_requested_delete" src="/images/he_requested_delete_disable.png"/>)
            } else {
                // Negotiator can delete any task during its review without getting permission from estimator
                buttons.push(editView ? <img key="delete" src="/images/delete.png"
                                             onClick={() => {
                                                 this.props.deleteTask(task)
                                             }}/> : <img key="delete" src="/images/delete_disable.png"/>)
            }

        } else if (loggedInUserRole === SC.ROLE_ESTIMATOR) {
            if (task.addedInThisIteration && task.owner === SC.OWNER_ESTIMATOR) {
                // As estimator has added this task in this iteration only, he/she would be able to edit/delete it without any restrictions
                buttons.push(editView ? <img key="edit" src="/images/edit.png"
                                             onClick={() => {
                                                 this.props.editTask(task, loggedInUserRole)
                                             }}/> : <img key="edit" src="/images/edit_disable.png"/>)
                buttons.push(editView ? <img key="delete" src="/images/delete.png"
                                             onClick={() => {
                                                 this.props.deleteTask(task)
                                             }}/> : <img key="delete" src="/images/delete_disable.png"/>)

            } else {
                // As task is either not added by estimator or is not added in this iteration hence he has no direct permission to edit/delete task
                if (task.estimator.changedKeyInformation) {
                    // Estimator has changed key information so show estimator icon to notify that
                    buttons.push(editView ? <img key="suggestion_outgoing" src="/images/suggestion_outgoing.png"
                                                 onClick={() => {
                                                     this.props.openTaskSuggestionForm(task, loggedInUserRole)
                                                 }}/> :
                        <img key="suggestion_incoming" src="/images/suggestion_outgoing_disable.png"/>)
                } else if (task.negotiator.changeSuggested) {
                    // Negotiator has suggested changes in previous iteration so show that
                    buttons.push(editView ? <img key="suggestion_incoming" src="/images/suggestion_incoming.png"
                                                 onClick={() => {
                                                     this.props.openTaskSuggestionForm(task, loggedInUserRole)
                                                 }}/> :
                        <img key="suggestion_outgoing" src="/images/suggestion_incoming_disable.png"/>)
                }

                /**
                 * Second button shown to estimator would be related to edit or its request/grants
                 */
                if (task.estimator.changeRequested) {
                    if (task.negotiator.changeGranted) {
                        // estimator has requested change which negotiator has granted
                        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/changeGranted, he_granted_edit')
                        buttons.push(editView ? <img key="he_granted_edit" src="/images/he_granted_edit.png"
                                                     onClick={() => {
                                                         this.props.editTask(task)
                                                     }}/> :
                            <img key="he_granted_edit" src="/images/he_granted_edit_disable.png"/>)
                    } else {
                        // estimator has requested change but negotiator has not granted it till now
                        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/not granted, requested_edit')
                        buttons.push(editView ? <img key="requested_edit" src="/images/requested_edit.png"
                                                     onClick={() => {
                                                         this.props.toggleEditRequest(task)
                                                     }}/> :
                            <img key="requested_edit" src="/images/requested_edit_disable.png"/>)
                    }
                } else {
                    // Estimator has not requested change and has no permission to change task either so he can request change
                    logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'can request edit, request_edit')
                    buttons.push(editView ? <img key="request_edit" src="/images/request_edit.png"
                                                 onClick={() => {
                                                     this.props.toggleEditRequest(task)
                                                 }}/> :
                        <img key="request_edit" src="/images/request_edit_disable.png"/>)
                }
                // Third button is related to removal request
                if (task.estimator.removalRequested) {
                    // Estimator has requested removal
                    buttons.push(editView ? <img key="requested_delete" src="/images/requested_delete.png"
                                                 onClick={() => {
                                                     this.props.toggleDeleteRequest(task)
                                                 }}/> :
                        <img key="requested_delete" src="/images/requested_delete_disable.png"/>)
                } else {
                    // Estimator can request removal
                    buttons.push(editView ? <img key="request_delete" src="/images/request_delete.png"
                                                 onClick={() => {
                                                     this.props.toggleDeleteRequest(task)
                                                 }}/> :
                        <img key="request_delete" src="/images/request_delete_disable.png"/>)
                }
            }
        }

        if (loggedInUserRole === SC.ROLE_NEGOTIATOR && _.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimationStatus) ||
            loggedInUserRole === SC.ROLE_ESTIMATOR && _.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimationStatus)) {
            if (task.feature && task.feature._id) {
                // This task is part of some feature so add move out of feature button
                buttons
                    .push(
                        <img key="move_outof_feature" src="/images/move_outof_feature.png"
                             onClick={() => this.props.moveTaskOutOfFeature(this.props.task)}/>)
            }

            else {
                // This task is an individual task so add move to feature button
                buttons.push(<img key="move_to_feature" src="/images/move_to_feature.png" onClick={() => {
                    this.props.moveToFeature(this.props.task);
                }}/>)
            }
        } else {
            if (task.feature && task.feature._id) {
                buttons.push(<img key="move_outof_feature" src="/images/move_outof_feature_disable.png"/>)
            } else {
                buttons.push(<img key="move_to_feature" src="/images/move_to_feature_disable.png"/>)

            }
        }

        return <div className={expanded ? 'task-expanded' : 'task'}>
            <div className="col-md-9">
                <h4>{task.estimator.name ? task.estimator.name : task.negotiator.name}</h4>
            </div>
            <div className="col-md-3">
                {task.owner == SC.OWNER_ESTIMATOR && task.addedInThisIteration && <div className="flagStrip">
                    <img src="/images/estimator_new_flag.png" title="Added by Estimator"/>
                </div>}

                {task.owner == SC.OWNER_NEGOTIATOR && task.addedInThisIteration && <div className="flagStrip">
                    <img src="/images/negotiator_new_flag.png" title="Added by Negotiator"/>
                </div>}

                {!task.repo.addedFromThisEstimation &&
                <div className="flagStrip">
                    <img src="/images/repo_flag.png" title="From Repository"/>
                </div>
                }

                {task.estimator.changedInThisIteration && <div className="flagStrip">
                    <img src="/images/estimator_edit_flag.png" title="Edited by Estimator"/>
                </div>}

                {task.negotiator.changedInThisIteration && <div className="flagStrip">
                    <img src="/images/negotiator_edit_flag.png" title="Edited by Negotiator"/>
                </div>}


            </div>
            <div className="col-md-12 short-description">
                <p>{task.estimator.description ? task.estimator.description : task.negotiator.description}</p>
            </div>
            <div className="col-md-3">
                <h4>Estimated:</h4>
                <h4>&nbsp;{task.estimator.estimatedHours} {task.estimator.estimatedHours && 'hrs.'}</h4>
            </div>
            <div className="col-md-3">
                <h4>Suggested:</h4>
                <h4>&nbsp;{task.negotiator.estimatedHours} {task.negotiator.estimatedHours && 'hrs.'}</h4>
            </div>


            <div className="col-md-6 text-right estimationActions">
                {buttons}
            </div>
        </div>
    }

}

EstimationTask.propTypes = {
    task: PropTypes.object.isRequired,
    loggedInUserRole: PropTypes.string.isRequired,
    estimationStatus: PropTypes.string.isRequired,
    expanded: PropTypes.bool,
    isFeatureTask: PropTypes.bool
}

EstimationTask.defaultProps = {
    expanded: false,
    isFeatureTask: false
}

EstimationTask = connect(null, (dispatch, ownProps) => ({
    toggleEditRequest: (values) => {
        let task = {}
        task.task_id = values._id
        return dispatch(A.requestForTaskEditPermissionOnServer(task)).then(json => {
            if (json.success) {

                if (json.data && json.data.estimator && json.data.estimator.changeRequested)
                    NotificationManager.success("Edit request on Task raised...")
                else
                    NotificationManager.success("Edit request on Task cleared...")
            } else {
                NotificationManager.error("Unknown error occurred")
            }
        })
    },
    deleteTask: (values) => {
        return dispatch(A.deleteEstimationTaskOnServer(values.estimation._id, values._id)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Deleted successfully")
            }
            else
                NotificationManager.error("Task Deletion Failed !")

        })
    },
    toggleDeleteRequest: (values) => {
        let task = {}
        task.task_id = values._id
        return dispatch(A.requestForTaskDeletePermissionOnServer(task)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Delete requested successfully")
            } else {
                if (json.code == EC.INVALID_OPERATION)
                    NotificationManager.error("Task Delete already requested")
                else
                    NotificationManager.error("Unknown error occurred")
            }
        })
    },
    editTask: (values, loggedInUserRole) => {
        dispatch(A.showComponent(COC.ESTIMATION_TASK_DIALOG))
        let task = {}
        task._id = values._id
        task.estimation = values.estimation
        if (loggedInUserRole != SC.ROLE_NEGOTIATOR) {
            task.name = values.estimator.name
            task.description = values.estimator.description
            task.estimatedHours = values.estimator.estimatedHours
        }
        else {
            task.name = values.negotiator.name
            task.description = values.negotiator.description
            task.estimatedHours = values.negotiator.estimatedHours
        }
        task.feature = values.feature
        task.technologies = values.technologies
        dispatch(initialize("estimation-task", task))
    },
    moveToFeature: (values) => {
        let task = {}
        task.task_id = values._id
        dispatch(A.showComponent(COC.MOVE_TASK_TO_FEATURE_FORM_DIALOG))
        dispatch(initialize("MoveTaskInFeatureForm", task))
    },
    moveTaskOutOfFeature: (values) => {
        let task = {}
        task.task_id = values._id
        task.feature_id = values.feature._id
        dispatch(A.moveTaskOutOfFeatureOnServer(values)).then(json => {
            if (json.success) {
                NotificationManager.success('Task moved out of feature Successfully')
            } else {
                NotificationManager.success('Some error occurred')
            }

        })
        //dispatch(initialize("MoveTaskInFeatureForm", task))
    },
    toggleGrantEdit: (values) => {
        let task = {}
        task.task_id = values._id
        return dispatch(A.grantEditPermissionOfTaskOnServer(task))
    },
    openTaskSuggestionForm: (values, loggedInUserRole) => {
        let task = {
            loggedInUserRole: loggedInUserRole,
            readOnly: {}
        }
        task._id = values._id
        task.estimation = values.estimation
        if (loggedInUserRole == SC.ROLE_NEGOTIATOR) {
            /* Since negotiator is logged in, he would see details of negotiator section in editable form and details of estimator section in read only form  */
            task.name = values.negotiator.name
            task.description = values.negotiator.description
            task.estimatedHours = values.negotiator.estimatedHours

            task.readOnly.name = values.estimator.name
            task.readOnly.description = values.estimator.description
            task.readOnly.estimatedHours = values.estimator.estimatedHours

        } else if (loggedInUserRole == SC.ROLE_ESTIMATOR) {
            /* Since estimator is logged in, he would see details of  estimator section in editable form  */
            task.name = values.estimator.name
            task.description = values.estimator.description
            task.estimatedHours = values.estimator.estimatedHours

            task.readOnly.name = values.negotiator.name
            task.readOnly.description = values.negotiator.description
            task.readOnly.estimatedHours = values.negotiator.estimatedHours

        }

        dispatch(initialize("estimation-suggest-task", task))
        dispatch(A.showComponent(COC.ESTIMATION_SUGGEST_TASK_FORM_DIALOG))
    }
}))(EstimationTask)


export default EstimationTask