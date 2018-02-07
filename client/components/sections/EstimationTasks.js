import React from 'react'

import * as SC from "../../../server/serverconstants"
import * as logger from '../../clientLogger'
import {Estimation} from "../../containers"


class EstimationTask extends React.PureComponent {
    render() {
        const {task, loggedInUserRole} = this.props

        let buttons = [];

        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'logged in user is ', loggedInUserRole)
        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'task owner ', task.owner)

        if (loggedInUserRole == SC.ROLE_NEGOTIATOR) {
            /**
             * Negotiator would always be able to edit any task (would be considered as suggestions), first button hence would always be edit
             */
            buttons.push(<img key="edit" src="/images/edit.png"></img>)
            if (task.estimator.removalRequested) {
                // Estimator has requested removal
                buttons.push(<img key="he_requested_delete" src="/images/he_requested_delete.png"></img>)
            } else {
            buttons.push(<img key="delete" src="/images/delete.png"></img>)
            }

            if (task.estimator.changeRequested) {
                if (task.negotiator.changeGranted) {
                    // estimator has requested change which negotiator has granted
                    logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/changeGranted, he_granted_edit')
                    buttons.push(<img key="he_requested_edit" src="/images/granted_edit.png"></img>)
                } else {
                    // estimator has requested change but negotiator has not granted it till now
                    logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/not granted, requested_edit')
                    buttons.push(<img key="requested_edit" src="/images/he_requested_edit.png"></img>)
                }
            } else if (task.negotiator.changeRequested){
                buttons.push(<img key="requested_edit" src="/images/requested_edit.png"></img>)
            }


        } else if (loggedInUserRole == SC.ROLE_ESTIMATOR) {
            /**
             * First button show to estimator would always be edit or its variations
             **/

            if (task.owner == SC.OWNER_ESTIMATOR) {
                if (task.addedInThisIteration) {
                    logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'added in this iteration, edit button')
                    // Estimator would see plain edit button in case he has added task in this iteration
                    buttons.push(<img key="edit" src="/images/edit.png"></img>)
                    if (task.estimator.removalRequested) {
                        buttons.push(<img key="requested_delete" src="/images/requested_delete.png"></img>)
                    } else {
                    buttons.push(<img key="edit" src="/images/delete.png"></img>)
                    }

                } else {
                    if (task.negotiator.changeRequested) {
                        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'negotiator requested change, he_requested_edit button')
                        // Negotiator has requested change
                        buttons.push(<img key="he_requested_edit" src="/images/he_requested_edit.png"></img>)
                    } else if (task.estimator.changeRequested) {
                        if (task.negotiator.changeGranted) {
                            // estimator has requested change which negotiator has granted
                            logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/changeGranted, he_granted_edit')
                            buttons.push(<img key="he_requested_edit" src="/images/he_granted_edit.png"></img>)
                        } else {
                            // estimator has requested change but negotiator has not granted it till now
                            logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/not granted, requested_edit')
                            buttons.push(<img key="requested_edit" src="/images/requested_edit.png"></img>)
                        }
                    } else {
                        // Estimator has not requested change and has no permission to change task either so he can request change
                        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'can request edit, request_edit')
                        buttons.push(<img key="request_edit" src="/images/request_edit.png" onClick={()=>{this.props.requestTaskEdit(task)}} ></img>)
                    }

                    if (task.estimator.removalRequested) {
                        // Estimator has requested removal
                        buttons.push(<img key="requested_delete" src="/images/requested_delete.png"></img>)
                    } else {
                        // Estimator can request removal
                        buttons.push(<img key="request_delete" src="/images/request_delete.png"></img>)
                    }
                }
            } else if (task.owner == SC.OWNER_NEGOTIATOR) {
                if (task.negotiator.changeRequested) {
                    logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'negotiator requested change, he_requested_edit button')
                    // Negotiator has requested change
                    buttons.push(<img key="he_requested_edit" src="/images/he_requested_edit.png"></img>)
                } else if (task.estimator.changeRequested) {
                    if (task.negotiator.changeGranted) {
                        // estimator has requested change which negotiator has granted
                        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/changeGranted, he_granted_edit')
                        buttons.push(<img key="he_requested_edit" src="/images/he_granted_edit.png"></img>)
                    } else {
                        // estimator has requested change but negotiator has not granted it till now
                        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/not granted, requested_edit')
                        buttons.push(<img key="requested_edit" src="/images/requested_edit.png"></img>)
                    }
                } else {
                    // Estimator has not requested change and has no permission to change task either so he can request change
                    logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'can request edit, request_edit')
                    buttons.push(<img key="request_edit" src="/images/request_edit.png"></img>)
                }

                if (task.estimator.removalRequested) {
                    // Estimator has requested removal
                    buttons.push(<img key="requested_delete" src="/images/requested_delete.png"></img>)
                } else {
                    // Estimator can request removal
                    buttons.push(<img key="request_delete" src="/images/request_delete.png"></img>)
                }
            }
        }

        if (task.feature && task.feature._id) {
            // This task is part of some feature so add move out of feature button
            buttons.push(<img key="move_outof_feature" src="/images/move_outof_feature.png" onClick={()=>console.log("move_outof_feature clicked",this)}></img>)
        } else {
            // This task is an individual task so add move to feature button
            buttons.push(<img key="move_to_feature" src="/images/move_to_feature.png" onClick={()=>{this.props.showFeatureSelectionForm(this.props.task._id);
              console.log("On click called");
            }}></img>)
        }

        logger.debug(logger.ESTIMATION_TASK_RENDER, this.props)
        return <div className="task">
            <div className="col-md-12 pad">
                <h4>{task.estimator.name ? task.estimator.name : task.negotiator.name}</h4>
            </div>
            <div className="col-md-12 pad">
                <p>{task.estimator.description ? task.estimator.description : task.negotiator.description}</p>
            </div>
            <div className="col-md-2 col-md-offset-1 pad">
                <h4>Est. Hrs:</h4> <h4>&nbsp;{task.estimator.estimatedHours}</h4>
            </div>
            <div className="col-md-3 pad">
                <h4>Sug. Hrs:</h4> <h4>&nbsp;{task.negotiator.estimatedHours}</h4>
            </div>

            <div className="col-md-6 text-right estimationActions pad">
                {buttons}
            </div>

            {task.addedInThisIteration && <div className="newFlagStrip">
                <img src="/images/new_flag.png"></img>
            </div>}

            {!task.repo.addedFromThisEstimation &&
            <div className="repoFlagStrip">
                <img src="/images/repo_flag.png"></img>
            </div>
            }
        </div>

    }
}

let
    EstimationTasks = (props) =>
        Array.isArray(props.tasks) && props.tasks.map(t => <EstimationTask task={t} key={t._id}
                                                                           loggedInUserRole={props.loggedInUserRole}
                                                                           onTaskDelete={props.onTaskDelete}
                                                                           showFeatureSelectionForm={props.showFeatureSelectionForm}

        />)

export default EstimationTasks