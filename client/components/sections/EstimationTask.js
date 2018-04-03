import React from 'react'
import PropTypes from 'prop-types'
import {ConfirmationDialog} from "../index";
import * as logger from '../../clientLogger'
import * as SC from '../../../server/serverconstants'
import * as CM from "../../clientMsg"
import _ from 'lodash'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {connect} from 'react-redux'
import {initialize} from 'redux-form'
import {NotificationManager} from 'react-notifications'
import * as EC from "../../../server/errorcodes";

class EstimationTask extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            showTaskDeletionDialog: false,
            showTaskDeletionRequestedDialog: false,
            taskDeletion: undefined
        }

    }

    onClose() {
        this.setState({showTaskDeletionDialog: false})
        this.setState({showTaskDeletionRequestedDialog: false})
    }

    onConfirmTaskDelete() {
        this.setState({showTaskDeletionDialog: false})
        this.props.deleteTask(this.state.taskDeletion);
    }

    onConfirmTaskDeleteRequest() {
        this.setState({showTaskDeletionRequestedDialog: false})
        this.props.deleteTask(this.props.task)

    }

    render() {
        const {task, loggedInUserRole, estimationStatus, expanded, isFeatureTask, fromRepoWithFeature} = this.props
        console.log("  this.state ", this.state)
        let buttons = [];

        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'logged in user is ', loggedInUserRole)
        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'task owner ', task.owner)
        logger.debug(logger.ESTIMATION_TASK_RENDER, this.props)
        let editView = false
        if (loggedInUserRole == SC.ROLE_NEGOTIATOR && _.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimationStatus) || loggedInUserRole == SC.ROLE_ESTIMATOR && _.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimationStatus))
            editView = true

        if (loggedInUserRole == SC.ROLE_NEGOTIATOR) {

            //condition for task approval

            if (task.status === SC.STATUS_PENDING && _.includes([SC.STATUS_REVIEW_REQUESTED, SC.STATUS_INITIATED, SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimationStatus)) {

                if (task.canApprove) {
                    buttons.push(editView ?
                        <img className="div-hover" key="approve" src="/images/approve.png" title="Approve"
                             onClick={() => {
                                 this.props.approveTask(task)
                             }}/> :
                        <img key="approve_disable" src="/images/approve_disable.png" title="Approve"/>)
                }


                // First button shown to negotiator would be suggestion button (kind of edit button)
                if (task.negotiator.changeSuggested || (task.addedInThisIteration && task.owner == SC.OWNER_NEGOTIATOR)) {
                    // Negotiator has suggested changes in this iteration so show that to negotiator,
                    buttons.push(editView && task.repo && task.repo.addedFromThisEstimation ?
                        <img className="div-hover" key="suggestion_outgoing" src="/images/suggestion_outgoing.png"
                             title="Suggestion-Outgoing "
                             onClick={() => {
                                 this.props.openTaskSuggestionForm(task, loggedInUserRole)
                             }}/> :
                        <img key="suggestion_outgoing_disable" src="/images/suggestion_outgoing_disable.png"
                             title="Suggestion-Outgoing "/>)
                } else if (task.estimator.changedKeyInformation || (task.addedInThisIteration && task.owner === SC.OWNER_ESTIMATOR)) {
                    // Estimator has changed key information in previous iteration, so show that to negotiator
                    buttons.push(editView && task.repo && task.repo.addedFromThisEstimation ?
                        <img className="div-hover" key="suggestion_incoming" src="/images/suggestion_incoming.png"
                             title="Suggestion-Incoming "
                             onClick={() => {
                                 this.props.openTaskSuggestionForm(task, loggedInUserRole)
                             }}/> :
                        <img key="suggestion_incoming_disable" src="/images/suggestion_incoming_disable.png"
                             title="Suggestion-Incoming"/>)
                } else {
                    // Show normal suggestion button
                    buttons.push(editView && task.repo && task.repo.addedFromThisEstimation ?
                        <img className="div-hover" key="suggestion" src="/images/suggestion.png" title="Suggestion"
                             onClick={() => {
                                 this.props.openTaskSuggestionForm(task, loggedInUserRole)
                             }}/> :
                        <img key="suggestion_disable" src="/images/suggestion_disable.png" title="Suggestion"/>)
                }

                // Second button shown to negotiator would be related to removal request (by estimator)/ delete button
                if (task.estimator.removalRequested) {
                    // Estimator has requested removal, negotiator will directly delete task if he wants to
                    buttons.push(editView && (!fromRepoWithFeature) ?
                        <img className="div-hover" key="he_requested_delete" src="/images/he_requested_delete.png"
                             title="Delete-Requested"
                             onClick={() => {
                                 this.setState({showTaskDeletionRequestedDialog: true})

                             }}/> :
                        <img key="he_requested_delete_disable" src="/images/he_requested_delete_disable.png"
                             title="Delete-Requested"/>)

                } else {
                    // Negotiator can delete any task during its review without getting permission from estimator
                    buttons.push(editView && (!fromRepoWithFeature) ?
                        <img className="div-hover" key="delete" src="/images/delete.png" title="Delete"
                             onClick={() => {
                                 this.setState({showTaskDeletionDialog: true})
                                 this.setState({taskDeletion: task})
                                 //this.props.deleteTask(task)
                             }}/> :
                        <img key="delete_disable" src="/images/delete_disable.png" title="Delete"/>)
                }

            }


            // If status is approved
            if (task.status === SC.STATUS_APPROVED) {
                // Single button shown to Negotiator would be related to Reopen requests (by estimator)/Reopen granted (by negotiator)
                if (task.estimator.changeRequested) {
                    if (task.negotiator.changeGranted) {
                        // estimator has requested Reopen which negotiator has granted
                        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/changeGranted, he_granted_Reopen')
                        buttons.push(editView ?
                            <img className="div-hover" key="granted_reopen" src="/images/reopen_granted.png"
                                 title="Reopen-Granted"
                                 onClick={() => {
                                     this.props.toggleGrantEdit(task)
                                 }}/> :
                            <img key="granted_reopen_disable" src="/images/reopen_granted_disable.png"
                                 title="Reopen-Granted"/>)
                    } else {
                        // estimator has requested Reopen but negotiator has not granted it till now
                        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/not granted, requested_edit')
                        buttons.push(editView && task.repo && task.repo.addedFromThisEstimation ?
                            <img className="div-hover" key="he_requested_reopen" src="/images/he_requested_reopen.png"
                                 title="Reopen-Requested"
                                 onClick={() => {
                                     this.props.toggleGrantEdit(task)
                                 }}/> :
                            <img key="he_requested_reopen_disable" src="/images/he_requested_reopen_disable.png"
                                 title="Reopen-Requested"/>)
                    }

                }
                else {
                    buttons.push(editView ?
                        <img className="div-hover" key="reopen" src="/images/reopen.png" title="Reopen"
                             onClick={() => {
                                 this.props.reOpenTask(task)
                             }}/> :
                        <img key="reopen_disable" src="/images/reopen_disable.png" title="Reopen"/>)

                }
            }


        } else if (loggedInUserRole === SC.ROLE_ESTIMATOR) {
            if (task.addedInThisIteration && task.owner === SC.OWNER_ESTIMATOR) {
                // As estimator has added this task in this iteration only, he/she would be able to edit/delete it without any restrictions
                buttons.push(editView && task.repo && task.repo.addedFromThisEstimation ?
                    <img className="div-hover" key="edit" src="/images/edit.png" title="Edit"
                         onClick={() => {
                             this.props.editTask(task, loggedInUserRole)
                         }}/> :
                    <img key="edit_disable" src="/images/edit_disable.png" title="Edit"/>)
                buttons.push(editView && (!fromRepoWithFeature) ?
                    <img className="div-hover" key="delete" src="/images/delete.png" title="Delete"
                         onClick={() => {
                             this.setState({showTaskDeletionDialog: true})
                             this.setState({taskDeletion: task})
                             //this.props.deleteTask(task)
                         }}/> :
                    <img key="delete_disable" src="/images/delete_disable.png" title="Delete"/>)

            } else {
                if (task.status === SC.STATUS_PENDING) {
                    if (task.estimator.changedKeyInformation || (task.addedInThisIteration && task.owner == SC.OWNER_ESTIMATOR)) {
                        // Estimator has changed key information so show estimator icon to notify that
                        buttons.push(editView && task.repo && task.repo.addedFromThisEstimation ?
                            <img className="div-hover" key="suggestion_outgoing" src="/images/suggestion_outgoing.png"
                                 title="Suggestion-Outgoing"
                                 onClick={() => {
                                     this.props.openTaskSuggestionForm(task, loggedInUserRole)
                                 }}/> :
                            <img key="suggestion_outgoing_disable" src="/images/suggestion_outgoing_disable.png"
                                 title="Suggestion-Outgoing"/>)
                    } else if (task.negotiator.changeSuggested || (task.addedInThisIteration && task.owner == SC.OWNER_NEGOTIATOR)) {
                        // Negotiator has suggested changes in previous iteration so show that
                        buttons.push(editView && task.repo && task.repo.addedFromThisEstimation ?
                            <img className="div-hover" key="suggestion_incoming" src="/images/suggestion_incoming.png"
                                 title="Suggestion-Incoming"
                                 onClick={() => {
                                     this.props.openTaskSuggestionForm(task, loggedInUserRole)
                                 }}/> :
                            <img key="suggestion_incoming_disable" src="/images/suggestion_incoming_disable.png"
                                 title="Suggestion-Incoming"/>)
                    }
                    else {
                        // Negotiator has not suggested any changes in this iteration so show that
                        buttons.push(editView && task.repo && task.repo.addedFromThisEstimation && !task.negotiator.changeSuggested ?
                            <img className="div-hover" key="suggestion" src="/images/suggestion.png"
                                 title="suggestion"
                                 onClick={() => {
                                     this.props.openTaskSuggestionForm(task, loggedInUserRole)
                                 }}/> :
                            <img key="suggestion_disable" src="/images/suggestion_disable.png"
                                 title="Suggestion"/>)
                    }

                    // Second button is related to removal request

                    if (task.estimator.removalRequested) {
                        // Estimator has requested removal
                        buttons.push(editView && (!fromRepoWithFeature) ?
                            <img className="div-hover" key="requested_delete" src="/images/requested_delete.png"
                                 title="Delete-Requested"
                                 onClick={() => {
                                     this.props.toggleDeleteRequest(task)
                                 }}/> :
                            <img key="requested_delete_disable" src="/images/requested_delete_disable.png"
                                 title="Delete-Requested"/>)
                    } else {
                        // Estimator can request removal
                        buttons.push(editView && (!fromRepoWithFeature) ?
                            <img className="div-hover" key="request_delete" src="/images/request_delete.png"
                                 title="Delete-Request"
                                 onClick={() => {
                                     this.props.toggleDeleteRequest(task)
                                 }}/> :
                            <img key="request_delete_disable" src="/images/request_delete_disable.png"
                                 title="Delete-Request"/>)
                    }


                }
                else if (task.status === SC.STATUS_APPROVED) {
                    // As task is approved by negotiator hence he has no direct permission to edit/delete task so estimator has to raise re-open request
                    /**
                     * Single button shown to estimator would be related to Reopen request/grants
                     */
                    if (task.estimator.changeRequested) {
                        if (task.negotiator.changeGranted) {
                            // estimator has requested change which negotiator has granted
                            logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/changeGranted, he_granted_re_open')
                            buttons.push(editView ?
                                <img className="div-hover" key="he_granted_reopen" src="/images/he_granted_reopen.png"
                                     title="Reopen-Granted"
                                     onClick={() => {
                                         //Re-Open
                                         this.props.editTask(task)
                                     }}/> :
                                <img key="he_granted_reopen_disable" src="/images/he_granted_reopen_disable.png"
                                     title="Reopen-Granted"/>)
                        } else {
                            // estimator has requested change but negotiator has not granted it till now
                            logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/not granted, requested_re_open')
                            buttons.push(editView ?
                                <img className="div-hover" key="requested_reopen" src="/images/reopen_requested.png"
                                     title="Reopen-Requested"
                                     onClick={() => {
                                         this.props.toggleEditRequest(task)
                                     }}/> :
                                <img key="requested_reopen_disable" src="/images/reopen_requested_disable.png"
                                     title="Reopen-Requested"/>)
                        }
                    } else {
                        //request for reopen by estimator on approved task
                        // Estimator can request Reopen
                        buttons.push(editView ?
                            <img className="div-hover" key="request_reopen" src="/images/reopen_request.png"
                                 title="Reopen-Request"
                                 onClick={() => {
                                     this.props.toggleEditRequest(task)
                                 }}/> :
                            <img key="request_reopen_disable" src="/images/reopen_request_disable.png"
                                 title="Reopen-Request"/>)
                    }
                }
            }
        }


        if (loggedInUserRole === SC.ROLE_NEGOTIATOR && _.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimationStatus) ||
            loggedInUserRole === SC.ROLE_ESTIMATOR && _.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimationStatus)) {

            if (editView) {
                if (task.feature && task.feature._id && task.repo && task.repo.addedFromThisEstimation && task.status !== SC.STATUS_APPROVED) {
                    // This task is part of some feature so add move out of feature button
                    buttons
                        .push(
                            <img className="div-hover" key="move_out_of_feature" src="/images/move_outof_feature.png"
                                 title="Move out of feature"
                                 onClick={() => this.props.moveTaskOutOfFeature(task)}/>)
                }
                else if (task.feature && task.feature._id) {
                    buttons.push(<img key="move_out_of_feature" src="/images/move_outof_feature_disable.png"
                                      title="Move out of feature"/>)
                }
                else {
                    if (task.status !== SC.STATUS_APPROVED) {
                        // This task is an individual task so add move to feature button
                        buttons.push(<img className="div-hover" key="move_to_feature" src="/images/move_to_feature.png"
                                          title="Move to feature"
                                          onClick={() => {
                                              this.props.moveToFeature(task);
                                          }}/>)
                    }
                    else {
                        buttons.push(<img key="move_to_feature" src="/images/move_to_feature_disable.png"
                                          title="Move to feature"/>)

                    }
                }
            }
            else {
                if (task.feature && task.feature._id) {
                    buttons.push(<img key="move_out_of_feature" src="/images/move_outof_feature_disable.png"
                                      title="Move out of feature"/>)
                } else {
                    buttons.push(<img key="move_to_feature" src="/images/move_to_feature_disable.png"
                                      title="Move to feature"/>)

                }
            }


        } else {
            if (task.feature && task.feature._id) {
                buttons.push(<img key="move_outof_feature" src="/images/move_outof_feature_disable.png"
                                  title="Move out of feature"/>)
            } else {
                buttons.push(<img key="move_to_feature" src="/images/move_to_feature_disable.png"
                                  title="Move to feature"/>)

            }
        }

        return <div className={expanded ? 'task-expanded' : 'task'}>
            <div className="col-md-9">
                <h4>{task.estimator.name ? task.estimator.name : task.negotiator.name}</h4>
            </div>
            <div className="col-md-3">

                <div>
                    {
                        this.state.showTaskDeletionRequestedDialog &&
                        <ConfirmationDialog show={true} onConfirm={this.onConfirmTaskDeleteRequest.bind(this)}
                                            title={CM.DELETE_TASK} onClose={this.onClose.bind(this)}
                                            body={CM.DELETE_TASK_BODY}/>
                    }
                    {this.state.showTaskDeletionDialog &&
                    <ConfirmationDialog show={true} onConfirm={this.onConfirmTaskDelete.bind(this)}
                                        title={CM.DELETE_TASK} onClose={this.onClose.bind(this)}
                                        body={CM.DELETE_TASK_BODY}/>
                    }
                    {task.owner == SC.OWNER_ESTIMATOR && task.addedInThisIteration && <div className="flagStrip">
                        <img key="estimator_new_flag" src="/images/estimator_new_flag.png" title="Added by Estimator"/>
                    </div>}

                    {task.owner == SC.OWNER_NEGOTIATOR && task.addedInThisIteration && <div className="flagStrip">
                        <img key="negotiator_new_flag" src="/images/negotiator_new_flag.png"
                             title="Added by Negotiator"/>
                    </div>}

                    {!task.repo.addedFromThisEstimation &&
                    <div className="flagStrip">
                        <img key="repo_flag" src="/images/repo_flag.png" title="From Repository"/>
                    </div>
                    }

                    {task.estimator.changedInThisIteration && <div className="flagStrip">
                        <img key="estimator_edit_flag" src="/images/estimator_edit_flag.png"
                             title="Edited by Estimator"/>
                    </div>}

                    {task.negotiator.changedInThisIteration && <div className="flagStrip">
                        <img key="negotiator_edit_flag" src="/images/negotiator_edit_flag.png"
                             title="Edited by Negotiator"/>
                    </div>}

                    {task.status === SC.STATUS_APPROVED &&
                    <div className="flagStrip">
                        <img key="approved_flag" src="/images/approved_flag.png"
                             title="Approved"/>
                    </div>}
                    {((task.negotiator.changedInThisIteration && task.negotiator.isMovedOutOfFeature) ||
                        (task.estimator.changedInThisIteration && task.estimator.isMovedOutOfFeature))
                    &&
                    <div className="flagStrip">
                        <img key="move_out_flag" src="/images/move_out_flag.png" title="Moved Out From Feature"/>
                    </div>}

                    {((task.negotiator.changedInThisIteration && task.negotiator.isMovedToFeature) ||
                        (task.estimator.changedInThisIteration && task.estimator.isMovedToFeature))
                    &&
                    <div className="flagStrip">
                        <img key="move_in_flag" src="/images/move_in_flag.png" title="Moved Into Feature"/>
                    </div>}
                </div>

            </div>
            <div className="col-md-12  div-hover short-description" onClick={() => {
                if (task && task._id && task.feature && task.feature._id) {
                    this.props.expandTaskAndFeature(task.feature._id, task._id)
                }
                else this.props.expandTask(task._id)
            }}>
                <p>{task.estimator.description ? task.estimator.description : task.negotiator.description}</p>
            </div>
            {task.estimator.estimatedHours ?
                <div className="col-md-3">
                    <h4>Estimated:</h4>
                    <h4>&nbsp;{task.estimator.estimatedHours} {task.estimator.estimatedHours && 'hrs.'}</h4>
                </div> :
                <div className="col-md-3 infoHighliter">
                    <h4>Estimated:</h4>
                    <h4>&nbsp;{task.estimator.estimatedHours} {task.estimator.estimatedHours && 'hrs.'}</h4>
                </div>
            }

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
    isFeatureTask: false,
    fromRepoWithFeature: false
}

EstimationTask = connect(null, (dispatch, ownProps) => ({
    toggleEditRequest: (values) => {
        return dispatch(A.requestForTaskEditPermissionOnServer(values._id)).then(json => {
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
            } else if (json.code && json.code == EC.INVALID_USER) {
                NotificationManager.error("Task Deletion Failed You are not owner of this task !")
            } else if (json.code && json.code == EC.ACCESS_DENIED) {
                NotificationManager.error("You are not allowed to delete this task !")
            }
            else
                NotificationManager.error("Task Deletion Failed !")

        })
    },
    toggleDeleteRequest: (values) => {
        return dispatch(A.requestForTaskDeletePermissionOnServer(values._id)).then(json => {
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
    moveToFeature: (task) => {
        dispatch(A.showComponent(COC.MOVE_TASK_TO_FEATURE_FORM_DIALOG))
        dispatch(initialize("move-task-in-feature", task))
    },
    moveTaskOutOfFeature: (task) => {
        dispatch(A.moveTaskOutOfFeatureOnServer(task)).then(json => {
            if (json.success) {
                NotificationManager.success('Task moved out of feature Successfully')
            } else {
                NotificationManager.success('Some error occurred')
            }

        })
        //dispatch(initialize("MoveTaskInFeatureForm", task))
    },
    toggleGrantEdit: (values) => {
        return dispatch(A.grantEditPermissionOfTaskOnServer(values._id)).then(json => {
            if (json.success) {
                if (json.data && json.data.negotiator && json.data.negotiator.changeGranted)
                    NotificationManager.success("Edit permission on task granted...")
                else
                    NotificationManager.success("Edit permission on task not granted...")
            }
            else {
                NotificationManager.error('Permission Grant Failed')
            }

        })
    },
    approveTask: (values) => {
        return dispatch(A.approveTaskByNegotiatorOnServer(values._id)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Approved ...")

            }
            else {
                if (json.code == EC.TASK_APPROVAL_ERROR) {
                    NotificationManager.error('Task cant be approved as Estimator has demanded some changes')
                }
                else {

                    NotificationManager.error('Task Not Approved')
                }

            }

        })
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
    },
    reOpenTask: (values) => {
        return dispatch(A.reOpenTaskOnServer(values._id)).then(json => {
            if (json.success) {
                NotificationManager.success("Task ReOpen")
            }
            else {
                NotificationManager.error('Task Not  ReOpen')
            }

        })
    },

    expandTask: (taskId) => {
        dispatch(A.expandTask(taskId))
    },
    expandTaskAndFeature: (featureID, taskID) => {
        dispatch(A.expandTaskAndFeature(featureID, taskID))
    }
}))(EstimationTask)


export default EstimationTask