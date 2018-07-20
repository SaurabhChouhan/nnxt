import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {EstimationDetail} from "../../components"
import * as A from '../../actions'
import {NotificationManager} from 'react-notifications'
import * as EC from '../../../server/errorcodes'
import * as COC from '../../components/componentConsts'
import {initialize} from 'redux-form'

const mapDispatchToProps = (dispatch, ownProps) => ({
    showAddTaskForm: (estimation) => {
        dispatch(A.showComponent(COC.ESTIMATION_TASK_DIALOG))
        // initialize
        dispatch(initialize('estimation-task', {
            estimation: {
                _id: estimation._id
            }
        }))
    },

    showAddFeatureForm: (estimation) => {
        dispatch(A.showComponent(COC.ESTIMATION_FEATURE_DIALOG))
        // initialize
        dispatch(initialize('estimation-feature', {
            estimation: {
                _id: estimation._id
            }
        }))
    },

    showProjectAwardForm: (estimation) => {
        dispatch(A.getUsersWithRoleCategoryFromServer())
        dispatch(A.showComponent(COC.ESTIMATION_PROJECT_AWARD_FORM_DIALOG))
        // initialize
        dispatch(initialize('estimation-project-award', {
            estimation: {
                _id: estimation._id
            }
        }))
    },


    sendEstimationRequest: (estimation) => {
        return dispatch(A.requestEstimationOnServer(estimation._id)).then(json => {
            if (json.success) {
                NotificationManager.success("Estimation requested successfully")
            } else {
                if (json.code === EC.INVALID_OPERATION)
                    NotificationManager.error("Estimation already requested")
                else
                    NotificationManager.error("Unknown error occurred")
            }
        })
    },

    sendReviewRequest: (estimation) => {
        return dispatch(A.requestReviewOnServer(estimation._id)).then(json => {
            if (json.success) {
                NotificationManager.success("Review requested successfully")
            } else {
                if (json.code === EC.INVALID_OPERATION)
                    NotificationManager.error("Review already requested")
                else
                    NotificationManager.error("Unknown error occurred")
            }
        })
    },
    hasErrorInEstimation: (estimation) => {
        return dispatch(A.checkHasErrorInEstimationOnServer(estimation._id))
    },


    sendChangeRequest: (estimation) => {
        return dispatch(A.requestChangeOnServer(estimation._id)).then(json => {
            if (json.success) {
                NotificationManager.success("Review requested successfully")
            } else {
                if (json.code === EC.INVALID_OPERATION)
                    NotificationManager.error("Change already requested")
                else
                    NotificationManager.error("Unknown error occurred")
            }
        })
    },

    onTaskDelete: (taskID) => dispatch(A.estimationTaskDelete(taskID)),

    estimationFilterForm: () => dispatch(A.showComponent(COC.ESTIMATION_FILTER_DIALOG)),

    editEstimationInitiateForm: (estimation) => {
        dispatch(A.getAllProjectsFromServer())
        dispatch(A.getAllUsersFromServer())
        dispatch(A.getAllTechnologiesFromServer())
        dispatch(A.showComponent(COC.ESTIMATION_INITIATE_DIALOG))
        dispatch(initialize('estimation-initiate', estimation))
    },

    estimationGoBack: (event) => {
        dispatch(A.getAllEstimationsFromServer('all', 'all')),
            dispatch(A.showComponentHideOthers(COC.ESTIMATION_LIST))
    },

    estimationApprove: (estimation) => dispatch(A.approveEstimationOnServer(estimation._id)).then(json => {
        if (json.success) {
            NotificationManager.success("Estimation approved successfully")
        } else {
            if (json.code === EC.STILL_PENDING_TASKS_AND_FEATURE_ERROR)
                NotificationManager.error("Estimation has some pending request")
            else
                NotificationManager.error("Estimation approve failed")
        }
    }),

    reopenEstimation: (estimation) => dispatch(A.reopenEstimationOnServer(estimation._id)).then(json => {
        if (json.success) {
            NotificationManager.success("Estimation Reopen successfully")
        }
        else {
            NotificationManager.error("Estimation not reopened")
        }
    }),


    deleteEstimation: (estimation) => dispatch(A.deleteEstimationOnServer(estimation._id)).then(json => {
        if (json.success) {
            NotificationManager.success("Estimation Deleted successfully")
        }
        else {
            NotificationManager.error("Estimation Deletion failed")
        }
        return json
    }),

    showAddToReleaseForm: (estimation) => {
        dispatch(A.showComponent(COC.ESTIMATION_ADD_TO_RELEASE_FORM_DIALOG))
        // initialize
        dispatch(initialize('estimation-add-to-release', {
            estimation: {
                _id: estimation._id
            }
        }))
    },


})


const mapStateToProps = (state) => ({

    userRoleInThisEstimation: state.estimation && state.estimation.selected.loggedInUserRole ? state.estimation.selected.loggedInUserRole : null,
    estimation: state.estimation.selected

})

const EstimationDetailContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationDetail))

export default EstimationDetailContainer
