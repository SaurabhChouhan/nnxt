import {connect} from 'react-redux'
import {ReleaseTaskDetailPage} from '../../components'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {initialize} from 'redux-form'
import {NotificationManager} from 'react-notifications'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    showTaskPlanningCreationForm: (releasePlan) => {
        console.log("releasePlan", releasePlan)
        dispatch(initialize("task-planning", {
            release: releasePlan.release,
            task: releasePlan.task,
            releasePlan: {
                _id: releasePlan._id,
            },
            flags: SC.REPORT_UNREPORTED,
            report: {
                status: SC.REPORT_PENDING
            }

        }))
        dispatch(A.showComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
    },
    showPlanTask: (release) => dispatch(A.getTaskDetailReleaseFromServer(release))


})


const mapStateToProps = (state) => ({
    loggedInUser: state.user.loggedIn,
    //release: state.release.selectedTask,
    releasePlan: state.release.selectedTask,
    taskPlanning: [],
    data: []
})

const ReleaseTaskDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskDetailPage)

export default ReleaseTaskDetailPageContainer
