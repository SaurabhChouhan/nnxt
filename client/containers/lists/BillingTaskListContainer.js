import { connect } from 'react-redux'
import { BillingTaskList } from '../../components'
import { getInReviewBillingPlansFromServer, addBillingTaskCriteria, addInReviewBillingPlans, hideLoader, clearInReviewBillingPlans, showLoader, fetchCurrentDescriptionFromState, updateBillingTaskOnServer } from '../../actions'
import moment from 'moment'
import { DATE_DISPLAY_FORMAT } from '../../clientconstants'
import { NotificationManager } from "react-notifications";


const mapDispatchToProps = (dispatch, ownProps) => ({
    reviewDescription: (data) => {
        dispatch(fetchCurrentDescriptionFromState({
            "_id": data._id,
            "billingDate": moment(data.billedDate).format(DATE_DISPLAY_FORMAT),
            "releasePlanName": data.releasePlan.name,
            "employeeName": data.billingEmployee.name
        }))
    },
    saveBillingTask: (data) => {
        return dispatch(updateBillingTaskOnServer(data)).then((json) => {
            if (json.success) {
                NotificationManager.success('Changes saved!')
            } else
                NotificationManager.error(json.message)
            return json
        })
    },
    getInReviewBillingPlans: (criteria) => {
        dispatch(addBillingTaskCriteria(criteria))
        dispatch(showLoader())
        dispatch(clearInReviewBillingPlans())
        dispatch(getInReviewBillingPlansFromServer(criteria)).then(json => {
            if (json.success)
                dispatch(addInReviewBillingPlans(json.data.release, json.data.releasePlans))
            dispatch(hideLoader())
        })
    },
    projectUnselected: (criteria) => {
        dispatch(addBillingTaskCriteria(Object.assign({}, criteria, {
            projectID: undefined,
            releaseID: undefined
        })))
        dispatch(clearInReviewBillingPlans())
    }
})

const mapStateToProps = (state, ownProps) => {
    let projectTeam = []
    if (state.billing.inReviewBillingRelease) {
        if (state.billing.inReviewBillingRelease.team && state.billing.inReviewBillingRelease.team.length)
            projectTeam = [...state.billing.inReviewBillingRelease.team]

        if (state.billing.inReviewBillingRelease.nonProjectTeam && state.billing.inReviewBillingRelease.nonProjectTeam.length)
            projectTeam = [...projectTeam, ...state.billing.billingRelease.nonProjectTeam]
    }

    return {
        inReviewBillingPlans: state.billing.inReviewBillingPlans,
        projectTeam,
        billingProjects: state.billing.billingProjects,
        criteria: state.billing.billingTaskCriteria,
        showLoader: state.app.showLoader
    }
}

const BillingTaskListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BillingTaskList)


export default BillingTaskListContainer