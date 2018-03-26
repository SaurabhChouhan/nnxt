import React from 'react'
import PropTypes from 'prop-types'
import * as SC from '../../../server/serverconstants'
import * as logger from '../../clientLogger'
import _ from 'lodash'
import {EstimationTask} from "../"
import {connect} from 'react-redux'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import {initialize} from 'redux-form'
import * as EC from "../../../server/errorcodes";
import {ConfirmationDialog} from "../index";
import * as CM from "../../clientMsg"


class EstimationFeature extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            showFeatureDeletionDialog: false,
            featureDeletion: undefined
        }

    }

    onClose() {
        this.setState({showFeatureDeletionDialog: false})
    }

    onConfirmFeatureDelete() {
        this.setState({showFeatureDeletionDialog: false})
        this.props.deleteFeature(this.state.featureDeletion);
    }


    render() {
        const {feature, loggedInUserRole, estimationStatus, index, expanded, expandedTaskID} = this.props

        let buttons = [];

        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'logged in user is ', loggedInUserRole)
        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'task owner ', feature.owner)
        logger.debug(logger.ESTIMATION_FEATURE_RENDER, this.props)

        let editView = false

        if (loggedInUserRole == SC.ROLE_NEGOTIATOR && _.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimationStatus) || loggedInUserRole == SC.ROLE_ESTIMATOR && _.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimationStatus))
            editView = true

        if (feature.status === SC.STATUS_APPROVED) {
            editView = false
        }
        if (loggedInUserRole == SC.ROLE_NEGOTIATOR) {


            /**
             * Negotiator would always be able to edit any task (would be considered as suggestions), first button hence would always be edit
             * He would also be able to delete any task
             */


            //condition for feature approval
            if (feature.status === SC.STATUS_PENDING && _.includes([SC.STATUS_REVIEW_REQUESTED], estimationStatus)) {

                if (feature.canApprove) {
                    buttons.push(editView ?
                        <img  className="div-hover" key="approve" src="/images/approve.png" title="Approve"
                             onClick={() => {
                                 this.props.approveFeature(feature)
                             }}/> :
                        <img key="approve_disable" src="/images/approve_disable.png" title="Approve"/>)
                }
            }

            if (feature.negotiator.changeSuggested) {
                // As negotiator has requested change, means he has added his suggestions during this iteration, show appropriate suggestion button
                buttons.push(editView ?
                    <img className="div-hover" key="suggestion_outgoing" src="/images/suggestion_outgoing.png" title="Suggestion-Outgoing"
                         onClick={() => {
                             this.props.showFeatureSuggestionForm(feature, loggedInUserRole)
                         }}/> :
                    <img key="suggestion_outgoing_disable" src="/images/suggestion_outgoing_disable.png" title="Suggestion-Outgoing"/>)
            } else {
                if (feature.estimator.changedKeyInformation) {
                    // Estimator has changed key information in previous iteration, so show that to negotiator
                    buttons.push(editView ?
                        <img className="div-hover" key="suggestion_incoming" src="/images/suggestion_incoming.png" title="Suggestion-Incoming"
                             onClick={() => {
                                 this.props.showFeatureSuggestionForm(feature, loggedInUserRole)
                             }}/> :
                        <img key="suggestion_incoming_disable" src="/images/suggestion_incoming_disable.png" title="Suggestion-Incoming"/>)
                }
                else if (feature.status !== SC.STATUS_APPROVED) {
                    buttons.push(editView && !feature.negotiator.changeSuggested ?
                        <img className="div-hover" key="suggestion_outgoing" src="/images/suggestion_outgoing.png"
                             title="Suggestion-Outgoing"
                             onClick={() => {
                                 this.props.showFeatureSuggestionForm(feature, loggedInUserRole)
                             }}/> :
                        <img key="suggestion_outgoing_disable" src="/images/suggestion_outgoing_disable.png"
                             title="Suggestion-Outgoing"/>)
                }
                else {
                    buttons.push(editView ?
                        <img className="div-hover" key="suggestion" src="/images/suggestion.png" title="Suggestion"
                             onClick={() => {
                                 this.props.showFeatureSuggestionForm(feature, loggedInUserRole)
                             }}/> :
                        <img key="suggestion_disable" src="/images/suggestion_disable.png" title="Suggestion"/>)
                }

            }
/*second button*/
            if (feature.estimator.removalRequested) {
                // Estimator has requested removal
                buttons.push(!editView ?
                    <img className="div-hover" key="he_requested_delete" src="/images/he_requested_delete.png" title="Delete-Requested"
                         onClick={() => {
                             this.props.deleteFeature(feature)
                         }}/> :
                    <img key="he_requested_delete_disable" src="/images/he_requested_delete_disable.png" title="Delete-Requested"/>)
            } else {
                buttons.push(editView ?
                    <img className="div-hover" key="delete" src="/images/delete.png" title="Delete"
                         onClick={() => {
                             this.setState({showFeatureDeletionDialog: true})
                             this.setState({featureDeletion: feature})
                             //this.props.deleteFeature(feature)
                         }}/> :
                    <img key="delete_disable" src="/images/delete_disable.png" title="Delete"/>)
            }
/*third button*/
    if (feature.estimator.changeRequested) {
        if (feature.negotiator.changeGranted) {
            // estimator has requested change which negotiator has granted
            buttons.push(!editView && feature.repo && feature.repo.addedFromThisEstimation ?
                <img className="div-hover" key="granted_edit" src="/images/granted_edit.png" title="Edit-Granted"
                     onClick={() => {
                         this.props.toggleGrantEdit(feature)
                     }}/> :
                <img key="granted_edit_disable" src="/images/granted_edit_disable.png" title="Edit-Granted"/>)
        } else {
            // estimator has requested change but negotiator has not granted it till now
            logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'changeRequested/not granted, heRequestedEditFeature')
            buttons.push(!editView && feature.repo && feature.repo.addedFromThisEstimation  ?
                <img className="div-hover" key="he_requested_edit" src="/images/he_requested_edit.png"
                     title="Edit-Requested"
                     onClick={() => {
                         this.props.toggleGrantEdit(feature)
                     }}/> :
                <img key="he_requested_edit_disable" src="/images/he_requested_edit_disable.png"
                     title="Edit-Requested"/>)
        }
    }

        }
        else if (loggedInUserRole == SC.ROLE_ESTIMATOR) {



            /**
             * First button show to estimator would always be edit or its variations
             **/

            if (feature.owner == SC.OWNER_ESTIMATOR) {
                if (feature.addedInThisIteration) {
                    logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'added in this iteration, edit button')
                    // Estimator would see plain edit button in case he has added task in this iteration
                    buttons.push(editView && feature.repo && feature.repo.addedFromThisEstimation ?
                        <img className="div-hover" key="edit" src="/images/edit.png" title="Edit"
                             onClick={() => {
                                 this.props.showEditFeatureForm(feature)
                             }}/> :
                        <img key="edit_disable" src="/images/edit_disable.png" title="Edit"/>)

                    buttons.push(editView ?
                        <img className="div-hover" key="delete" src="/images/delete.png" title="Delete"
                             onClick={() => {
                                 this.setState({showFeatureDeletionDialog: true})
                                 this.setState({featureDeletion: feature})
                                 // this.props.deleteFeature(feature)
                             }}/> :
                        <img key="delete_disable" src="/images/delete_disable.png" title="Delete"/>)

                } else {
                    // As feature is either not added by estimator or is not added in this iteration hence he has no direct permission to edit/delete task
                    if (feature.estimator.changedKeyInformation) {
                        // Estimator has changed key information so show estimator icon to notify that
                        buttons.push(editView && feature.repo.addedFromThisEstimation ?
                            <img className="div-hover" key="suggestion_outgoing" src="/images/suggestion_outgoing.png"
                                 title="Suggestion-Outgoing"
                                 onClick={() => {
                                     this.props.showFeatureSuggestionForm(feature, loggedInUserRole)
                                 }}/> :
                            <img key="suggestion_outgoing_disable" src="/images/suggestion_outgoing_disable.png"
                                 title="Suggestion-Outgoing"/>)
                    }
                    else if (feature.negotiator.changeSuggested) {
                        logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'negotiator requested change, he_requested_edit button')
                        // Negotiator has requested change
                        console.log("created by estimatorafter approved",editView)
                        console.log("created by estimatorapproved",feature.negotiator.changeSuggested )

                        buttons.push(editView ?
                            <img className="div-hover" key="suggestion_incoming"
                                 src="/images/suggestion_incoming.png" title="Suggestion-Incoming"
                                 onClick={() => {
                                     this.props.showFeatureSuggestionForm(feature, loggedInUserRole)
                                 }}/> :
                            <img key="suggestion_incoming_disable" src="/images/suggestion_incoming_disable.png"
                                 title="Suggestion-Incoming"/>)
                    }
                      else if ( feature.status !== SC.STATUS_APPROVED  ) {
                        console.log("created by estimator",editView)
                        console.log("created by estimator",feature.negotiator.changeSuggested )

                           buttons.push(editView && !feature.negotiator.changeSuggested   ?
                               <img className="div-hover" key="suggestion_incoming" src="/images/suggestion_incoming.png"
                                    title="Suggestion-Incoming"
                                    onClick={() => {
                                        this.props.showFeatureSuggestionForm(feature, loggedInUserRole)
                                    }}/> :
                               <img key="suggestion_incoming_disable" src="/images/suggestion_incoming_disable.png"
                                    title="Suggestion-Incoming"/>)
                       }

                    /*second button*/

                    if (feature.estimator.changeRequested) {
                        if (feature.negotiator.changeGranted) {
                            // estimator has requested change which negotiator has granted
                            logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'changeRequested/changeGranted, he_granted_edit')
                            buttons.push(!editView && feature.repo && feature.repo.addedFromThisEstimation ?
                                <img className="div-hover" key="he_granted_edit" src="/images/he_granted_edit.png"
                                     title="Edit-Granted"
                                     onClick={() => {
                                         this.props.showEditFeatureForm(feature)
                                     }}/> :
                                <img key="he_granted_edit_disable" src="/images/he_granted_edit_disable.png"
                                     title="Edit-Granted"/>)
                        } else {
                            // estimator has requested change but negotiator has not granted it till now
                            buttons.push(!editView && feature.repo && feature.repo.addedFromThisEstimation ?
                                <img className="div-hover" key="requested_edit" src="/images/requested_edit.png"
                                     title="Edit-Requested"
                                     onClick={() => {
                                         this.props.toggleEditRequest(feature)
                                     }}/> :
                                <img key="requested_edit_disable" src="/images/requested_edit_disable.png"
                                     title="Edit-Requested"/>)
                        }
                    } else {
                        // Estimator has not requested change and has no permission to change task either so he can request change
                        logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'can request edit, request_edit')
                        if (feature.status !== SC.STATUS_APPROVED) {
                            buttons.push(editView && feature.repo.addedFromThisEstimation ?
                                <img className="div-hover" key="edit" src="/images/edit.png" title="Edit"
                                     onClick={() => {
                                         this.props.showEditFeatureForm(feature)
                                     }}/> :
                                <img key="edit_disable" src="/images/edit_disable.png" title="Edit"/>)
                        }
                        else {
                            buttons.push(!editView && feature.repo && feature.repo.addedFromThisEstimation ?
                                <img className="div-hover" key="request_edit" src="/images/request_edit.png"
                                     title="Edit-Request"
                                     onClick={() => {
                                         this.props.toggleEditRequest(feature)
                                     }}/> :
                                <img key="request_edit_disable" src="/images/request_edit_disable.png"
                                                 title="Edit-Request"/>)
                        }
                    }
                    /*Third button*/
                    if (feature.status === SC.STATUS_APPROVED) {
                        if (feature.estimator.removalRequested) {
                            // Estimator has requested removal
                            buttons.push(!editView ?
                                <img className="div-hover" key="requested_delete" src="/images/requested_delete.png"
                                     title="Delete-Requested"
                                     onClick={() => {
                                         this.props.toggleDeleteRequest(feature)
                                     }}/> :
                                <img key="requested_delete_disable" src="/images/requested_delete_disable.png"
                                     title="Delete-Requested"/>)
                        } else {
                            // Estimator can request removal
                            buttons.push(!editView ?
                                <img className="div-hover" key="request_delete" src="/images/request_delete.png"
                                     title="Delete-Request"
                                     onClick={() => {
                                         this.props.toggleDeleteRequest(feature)
                                     }}/> : <img key="request_delete_disable" src="/images/request_delete_disable.png"
                                                 title="Delete-Request"/>)
                        }
                    }

                }
            }



            else if (feature.owner == SC.OWNER_NEGOTIATOR) {
                if (feature.estimator.changedKeyInformation) {
                    // Estimator has changed key information so show estimator icon to notify that
                    console.log("created by estimatornego ",editView)
                    console.log("created by estimatornego",feature.negotiator.changeSuggested )

                    buttons.push(editView ?
                        <img className="div-hover" key="suggestion_outgoing" src="/images/suggestion_outgoing.png" title="Suggestion-Outgoing"
                             onClick={() => {
                                 this.props.showFeatureSuggestionForm(feature, loggedInUserRole)
                             }}/> :
                        <img key="suggestion_outgoing_disable" src="/images/suggestion_outgoing_disable.png" title="Suggestion-Outgoing"/>)
                } else if (feature.negotiator.changeSuggested) {
                        logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'estimator suggestion_incoming change, suggestion_incoming button')
                        /* Negotiator has provided suggestions, clicking this button should show a window that would
                           allow estimator to see suggestions given by negotiator
                         */
                        buttons.push(editView ?
                            <img className="div-hover" key="suggestion_incoming" src="/images/suggestion_incoming.png" title="Suggestion-Incoming"
                                 onClick={() => {
                                     this.props.showFeatureSuggestionForm(feature, loggedInUserRole)
                                 }}/> :
                            <img key="suggestion_incoming_disable" src="/images/suggestion_incoming_disable.png" title="Suggestion-Incoming"/>)
                    }

            else if ( feature.status !== SC.STATUS_APPROVED  ) {
                    console.log("created by estimator nego",editView)
                    console.log("created by estimator nego",feature.negotiator.changeSuggested )
                    buttons.push(editView && !feature.negotiator.changeSuggested   ?
                        <img className="div-hover" key="suggestion_incoming" src="/images/suggestion_incoming.png"
                             title="Suggestion-Incoming"
                             onClick={() => {
                                 this.props.showFeatureSuggestionForm(feature, loggedInUserRole)
                             }}/> :
                        <img key="suggestion_incoming_disable" src="/images/suggestion_incoming_disable.png"
                             title="Suggestion-Incoming"/>)
                }
/*Second button*/

    if (feature.estimator.changeRequested) {
        if (feature.negotiator.changeGranted) {
            // estimator has requested change which negotiator has granted
            buttons.push(!editView && feature.repo && feature.repo.addedFromThisEstimation ?
                <img className="div-hover" key="granted_edit" src="/images/he_granted_edit.png" title="Edit-Granted"
                     onClick={() =>
                         this.props.showEditFeatureForm(feature)
                     }/> :
                <img key="he_granted_edit_disable" src="/images/he_granted_edit_disable.png" title="Edit-Granted"/>)
        } else {
            // estimator has requested change but negotiator has not granted it till now
            buttons.push(!editView && feature.repo && feature.repo.addedFromThisEstimation ?
                <img className="div-hover" key="requested_edit" src="/images/requested_edit.png" title="Edit-Requested"
                     onClick={() => {
                         this.props.toggleEditRequest(feature)
                     }}/> :
                <img key="requested_edit_disable" src="/images/requested_edit_disable.png" title="Edit-Requested"/>)

        }
   }
    /*feature added by estimator has permission to edit directly without permission of negotiator*/
              else {
                    // Estimator has not requested change and has no permission to change task either so he can request change
                    logger.debug(logger.ESTIMATION_FEATURE_BUTTONS, 'can request edit, request_edit')
                    if(feature.status === SC.STATUS_APPROVED){
                    buttons.push(!editView && feature.repo.addedFromThisEstimation ?
                        <img className="div-hover" key="request_edit" src="/images/request_edit.png" title="Edit-Request"
                             onClick={() => {
                                 this.props.toggleEditRequest(feature)
                             }}/>
                       : <img key="request_edit_disable" src="/images/request_edit_disable.png" title="Edit-Request"/>

                     )}
                        else {
                        buttons.push(editView && feature.repo.addedFromThisEstimation ?
                            <img className="div-hover" key="edit" src="/images/edit.png" title="Edit"
                                 onClick={() => {
                                     this.props.showEditFeatureForm(feature)
                                 }}/> :
                            <img key="edit_disable" src="/images/edit_disable.png" title="Edit"/>)
                    }
                }

                /*third button*/
                if(feature.status === SC.STATUS_APPROVED) {
                    if (feature.estimator.removalRequested) {
                        // Estimator has requested removal
                        buttons.push(!editView ?
                            <img className="div-hover" key="he_requested_delete" src="/images/requested_delete.png"
                                 title="Delete-Requested"
                                 onClick={() => {
                                     this.props.toggleDeleteRequest(feature)
                                 }}/> :
                            <img key="he_requested_delete_disable" src="/images/requested_delete_disable.png"
                                 title="Delete-Requested"/>)
                    } else {
                        // Estimator can request removal
                        buttons.push(!editView ?
                            <img className="div-hover" key="request_delete" src="/images/request_delete.png"
                                 title="Delete-Request"
                                 onClick={() => {
                                     this.props.toggleDeleteRequest(feature)
                                 }}/> :
                            <img key="request_delete_disable" src="/images/request_delete_disable.png"
                                 title="Delete-Request"/>)
                    }
                }
            }
        }

        return <div className={expanded ? 'feature-expanded' : 'feature'}>
            <div className="col-md-12 pad">
                <div className="col-md-9 div-hover" onClick={() => {
                    this.props.expandFeature(feature._id)
                }}>
                    <h4>{feature.estimator.name ? feature.estimator.name : feature.negotiator.name}</h4>
                </div>

                <div className="col-md-3">
                    <div>{this.state.showFeatureDeletionDialog &&
                    <ConfirmationDialog show={true} onConfirm={this.onConfirmFeatureDelete.bind(this)}
                                        title={CM.DELETE_FEATURE} onClose={this.onClose.bind(this)}
                                        body={CM.DELETE_FEATURE_BODY}/>
                    }

                        {feature.owner == SC.OWNER_ESTIMATOR && feature.addedInThisIteration &&
                        <div className="flagStrip">
                            <img key="estimator_new_flag" src="/images/estimator_new_flag.png" title="Added by Estimator"></img>
                        </div>}

                        {feature.owner == SC.OWNER_NEGOTIATOR && feature.addedInThisIteration &&
                        <div className="flagStrip">
                            <img key="negotiator_new_flag" src="/images/negotiator_new_flag.png" title="Added by Negotiator"></img>
                        </div>}

                        {feature.estimator.changedInThisIteration && <div className="flagStrip">
                            <img key="estimator_edit_flag" src="/images/estimator_edit_flag.png" title="Edited by Estimator"></img>
                        </div>}

                        {feature.negotiator.changedInThisIteration && <div className="flagStrip">
                            <img key="negotiator_edit_flag" src="/images/negotiator_edit_flag.png" title="Edited by Negotiator"></img>
                        </div>}

                        {feature.status === SC.STATUS_APPROVED &&
                        <div className="flagStrip">
                            <img key="approved_flag" src="/images/approved_flag.png"
                                 title="Approved"/>
                        </div>}

                        {feature.repo && !feature.repo.addedFromThisEstimation &&
                        <div className="flagStrip">
                            <img key="repo_flag" src="/images/repo_flag.png" title="From Repository"></img>
                        </div>
                        }
                    </div>
                </div>

            </div>
            <div className="col-md-12 short-description" onClick={() => {
                this.props.expandFeature(feature._id)
            }}>
                <p>{feature.estimator.description ? feature.estimator.description : feature.negotiator.description}</p>
            </div>
            <div className="col-md-3">
                <h4>Estimated:</h4>
                <h4>&nbsp;{feature.estimator.estimatedHours} {feature.estimator.estimatedHours && 'Hours'}</h4>
            </div>
            <div className="col-md-3">
                <h4>Suggested:</h4>
                <h4>&nbsp;{feature.negotiator.estimatedHours} {feature.negotiator.estimatedHours && 'Hours'}</h4>
            </div>

            <div className="col-md-6 text-right estimationActions">
                {buttons}
            </div>
            {expanded && <div className="col-md-11 col-md-offset-1">
                {
                    Array.isArray(feature.tasks) && feature.tasks.length > 0 &&
                    feature.tasks.map((t, idx) => (expandedTaskID && expandedTaskID === t._id) ?
                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...{
                            estimationStatus,
                            loggedInUserRole
                        }}
                                        expanded={true}/> :
                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...{
                            estimationStatus,
                            loggedInUserRole
                        }} />)
                }
            </div>
            }


        </div>

    }
}

EstimationFeature.propTypes = {
    feature: PropTypes.object.isRequired,
    loggedInUserRole: PropTypes.string.isRequired,
    estimationStatus: PropTypes.string.isRequired,
    expanded: PropTypes.bool
}

EstimationFeature.defaultProps = {
    expanded: false
}


EstimationFeature = connect(null, (dispatch, ownProps) => ({

        showEditFeatureForm: (values) => {
            // would always be called by estimator
            dispatch(A.showComponent(COC.ESTIMATION_FEATURE_DIALOG))
            // initialize
            let feature = {}
            feature.estimation = values.estimation
            feature._id = values._id
            feature.name = values.estimator.name
            feature.description = values.estimator.description
            dispatch(initialize('estimation-feature', feature))
        },


        showFeatureSuggestionForm: (values, loggedInUserRole) => {
            console.log("showFeatureSuggestionForm feature", values)
            // Can be called by both estimator and negotiator
            let feature = {
                loggedInUserRole: loggedInUserRole,
                readOnly: {}
            }
            feature._id = values._id
            feature.estimation = values.estimation
            if (loggedInUserRole == SC.ROLE_NEGOTIATOR) {
                /* Since negotiator is logged in, he would see details of negotiator section in editable form and details of estimator section in read only form  */
                feature.name = values.negotiator.name
                feature.description = values.negotiator.description

                feature.readOnly.name = values.estimator.name
                feature.readOnly.description = values.estimator.description

            } else if (loggedInUserRole == SC.ROLE_ESTIMATOR) {
                /* Since estimator is logged in, he would see details of  estimator section in editable form  */
                feature.name = values.estimator.name
                feature.description = values.estimator.description

                feature.readOnly.name = values.negotiator.name
                feature.readOnly.description = values.negotiator.description

            }
            console.log("feature", feature)

            dispatch(initialize("estimation-suggest-feature", feature))
            dispatch(A.showComponent(COC.ESTIMATION_SUGGEST_FEATURE_FORM_DIALOG))

        },


        deleteFeature: (feature) => {
            console.log("delete feature", feature)
            return dispatch(A.deleteFeatureByEstimatorOnServer(feature.estimation._id, feature._id)).then(json => {
                if (json.success) {
                    NotificationManager.success("Feature Deleted successfully")
                }
                else if (json.code && json.code == EC.INVALID_USER) {
                    NotificationManager.error("Feature Deletion Failed You are not owner of this feature !")
                } else if (json.code && json.code == EC.ACCESS_DENIED) {
                    NotificationManager.error("You are not allowed to delete this feature !")
                }
                else
                    NotificationManager.error("Feature Deletion Failed !")

            })
        },


        toggleEditRequest: (values) => {
            return dispatch(A.requestForFeatureEditPermissionOnServer(values._id)).then(json => {
                if (json.success) {

                    if (json.data && json.data.estimator && json.data.estimator.changeRequested)
                        NotificationManager.success("Edit request on Feature raised...")
                    else
                        NotificationManager.success("Edit request on Feature cleared...")
                } else {
                    NotificationManager.error("Unknown error occurred")
                }
            })

        },


        toggleGrantEdit: (values) => {
            return dispatch(A.grantEditPermissionOfFeatureOnServer(values._id)).then(json => {
                if (json.success) {
                    if (json.data && json.data.negotiator && json.data.negotiator.changeGranted)
                        NotificationManager.success("Edit permission on Feature granted...")
                    else
                        NotificationManager.success("Edit permission on Feature not granted...")
                }
                else {
                    NotificationManager.error('Permission Grant Failed')
                }
            })
        },

        toggleDeleteRequest: (values) => {
            return dispatch(A.requestForFeatureDeletePermissionOnServer(values._id)).then(json => {
                if (json.success) {
                    NotificationManager.success("Feature Delete requested successfully")
                } else {
                    if (json.code == EC.INVALID_OPERATION)
                        NotificationManager.error("Feature Delete already requested")
                    else
                        NotificationManager.error("Unknown error occurred")
                }
            })
        },
        approveFeature: (values) => {
            return dispatch(A.approveFeatureByNegotiatorOnServer(values._id)).then(json => {
                if (json.success) {
                    NotificationManager.success("Feature Approved ...")
                }
                else {
                    if (json.code == EC.TASK_APPROVAL_ERROR) {
                        NotificationManager.error('First All the task of feature should be approved')
                    }
                    else {
                        NotificationManager.error('Feature Not Approved')
                    }

                }


            })
        },
        expandFeature: (featureID) => {
            dispatch(A.expandFeature(featureID))
        }

    })
)(EstimationFeature)

export default EstimationFeature