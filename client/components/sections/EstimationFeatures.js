import React from 'react'

import * as SC from "../../../server/serverconstants"
import * as logger from '../../clientLogger'


class EstimationFeature extends React.PureComponent {

    render() {
        const {feature, loggedInUserRole} = this.props

        let buttons = [];

        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'logged in user is ', loggedInUserRole)
        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'task owner ', feature.owner)
        logger.debug(logger.ESTIMATION_FEATURE_RENDER, this.props)

        if (loggedInUserRole == SC.ROLE_NEGOTIATOR) {
            /**
             * Negotiator would always be able to edit any task (would be considered as suggestions), first button hence would always be edit
             * He would also be able to delete any task
             */
            buttons.push(<img key="edit" src="/images/edit.png"></img>)
            if (feature.estimator.removalRequested) {
                // Estimator has requested removal
                buttons.push(<img key="he_requested_delete" src="/images/he_requested_delete.png"></img>)
            } else {
                buttons.push(<img key="delete" src="/images/delete.png"></img>)
            }

            if (feature.estimator.changeRequested) {
                if (feature.negotiator.changeGranted) {
                    // estimator has requested change which negotiator has granted
                    logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/changeGranted, he_granted_edit')
                    buttons.push(<img key="granted_edit" src="/images/granted_edit.png"></img>)
                } else {
                    // estimator has requested change but negotiator has not granted it till now
                    logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/not granted, requested_edit')
                    buttons.push(<img key="he_requested_edit" src="/images/he_requested_edit.png"></img>)
                }
            } else if (feature.negotiator.changeRequested) {
                buttons.push(<img key="requested_edit" src="/images/requested_edit.png"></img>)
            }
        } else if (loggedInUserRole == SC.ROLE_ESTIMATOR) {
            /**
             * First button show to estimator would always be edit or its variations
             **/

            if (feature.owner == SC.OWNER_ESTIMATOR) {
                if (feature.addedInThisIteration) {
                    logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'added in this iteration, edit button')
                    // Estimator would see plain edit button in case he has added task in this iteration
                    buttons.push(<img key="edit" src="/images/edit.png" onClick={() => {
                        this.props.showEditFeatureForm(feature)
                    }}></img>)
                    buttons.push(<img key="delete" src="/images/delete.png" onClick={() => {
                        this.props.deleteFeature(feature)
                    }}></img>)
                } else {
                    if (feature.negotiator.changeRequested) {
                        logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'negotiator requested change, he_requested_edit button')
                        // Negotiator has requested change
                        buttons.push(<img key="he_requested_edit" src="/images/he_requested_edit.png"></img>)
                    } else if (feature.estimator.changeRequested) {
                        if (feature.negotiator.changeGranted) {
                            // estimator has requested change which negotiator has granted
                            logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'changeRequested/changeGranted, he_granted_edit')
                            buttons.push(<img key="he_requested_edit" src="/images/he_granted_edit.png"></img>)
                        } else {
                            // estimator has requested change but negotiator has not granted it till now
                            logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'changeRequested/not granted, requested_edit')
                            buttons.push(<img key="requested_edit" src="/images/requested_edit.png"></img>)
                        }
                    } else {
                        // Estimator has not requested change and has no permission to change task either so he can request change
                        logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'can request edit, request_edit')
                        buttons.push(<img key="request_edit" src="/images/request_edit.png"></img>)
                    }

                    if (feature.estimator.removalRequested) {
                        // Estimator has requested removal
                        buttons.push(<img key="requested_delete" src="/images/requested_delete.png"></img>)
                    } else {
                        // Estimator can request removal
                        buttons.push(<img key="request_delete" src="/images/request_delete.png"></img>)
                    }
                }
            } else if (feature.owner == SC.OWNER_NEGOTIATOR) {
                if (feature.negotiator.changeRequested) {
                    logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'negotiator requested change, he_requested_edit button')
                    // Negotiator has requested change
                    buttons.push(<img key="he_requested_edit" src="/images/he_requested_edit.png"></img>)
                } else if (feature.estimator.changeRequested) {
                    if (feature.negotiator.changeGranted) {
                        // estimator has requested change which negotiator has granted
                        logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'changeRequested/changeGranted, he_granted_edit')
                        buttons.push(<img key="granted_edit" src="/images/he_granted_edit.png"></img>)
                    } else {
                        // estimator has requested change but negotiator has not granted it till now
                        logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'changeRequested/not granted, requested_edit')
                        buttons.push(<img key="requested_edit" src="/images/requested_edit.png"></img>)
                    }
                } else {
                    // Estimator has not requested change and has no permission to change task either so he can request change
                    logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'can request edit, request_edit')
                    buttons.push(<img key="request_edit" src="/images/request_edit.png"></img>)
                }

                if (feature.estimator.removalRequested) {
                    // Estimator has requested removal
                    buttons.push(<img key="requested_delete" src="/images/he_requested_delete.png"></img>)
                } else {
                    // Estimator can request removal
                    buttons.push(<img key="request_delete" src="/images/request_delete.png"></img>)
                }
            }
        }

        return <div className="feature">
            <div className="col-md-12 pad">
                <h4>{feature.estimator.name ? feature.estimator.name : feature.negotiator.name}</h4>
            </div>
            <div className="col-md-12 pad">
                <p>{feature.estimator.description ? feature.estimator.description : feature.negotiator.description}</p>
            </div>
            <div className="col-md-2 col-md-offset-1 pad">
                <h4>Est. Hrs:</h4> <h4>&nbsp;{feature.estimator.estimatedHours}</h4>
            </div>
            <div className="col-md-3 pad">
                <h4>Sug. Hrs:</h4> <h4>&nbsp;{feature.negotiator.estimatedHours}</h4>
            </div>

            <div className="col-md-6 text-right estimationActions pad">
                {buttons}
            </div>
            {feature.addedInThisIteration && <div className="newFlagStrip">
                <img src="/images/new_flag.png"></img>
            </div>}

            {!feature.repo.addedFromThisEstimation &&
            <div className="repoFlagStrip">
                <img src="/images/repo_flag.png"></img>
            </div>
            }
        </div>

    }
}

let
    EstimationFeatures = (props) =>
        Array.isArray(props.features) && props.features.map(f => <EstimationFeature feature={f} key={f._id}
                                                                                    showEditFeatureForm={props.showEditFeatureForm}
                                                                                    deleteFeature={props.deleteFeature}
                                                                                    loggedInUserRole={props.loggedInUserRole}/>)

export default EstimationFeatures