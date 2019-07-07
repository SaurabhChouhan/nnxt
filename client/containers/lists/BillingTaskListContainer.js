import { connect } from 'react-redux'
import { BillingTaskList } from '../../components'
import { BILLING_TASK_DESCRIPTION_DIALOG } from '../../components/componentConsts'
import {showComponent} from '../../actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
    reviewDescription: (data) => {
        console.log("review description called with data as ", data)

        /*
        let reportData = {
            _id: task._id,
            reportedHours: parseFloat(task.reportedHours),
            status: iterationType == SC.ITERATION_TYPE_PLANNED ? task.status : SC.STATUS_PENDING,
            reportedDate: date,
            iterationType: iterationType,
            taskName: task.task.name,
            reportDescription: task.report.description
        }

        dispatch(initialize('report-task-description', reportData))
        */

        dispatch(showComponent(BILLING_TASK_DESCRIPTION_DIALOG))


        /*
        return dispatch(A.reportTaskToServer(inputTask)).then((json) => {
            if (json.success) {
                NotificationManager.success('Task report submitted.')
                dispatch(A.taskReported(json.data.taskPlan))
            } else
                NotificationManager.error(json.message)
            return json
        })
        */
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
        projectTeam
    }
}

const BillingTaskListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BillingTaskList)


export default BillingTaskListContainer