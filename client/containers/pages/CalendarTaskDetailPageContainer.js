import {connect} from 'react-redux'
import {CalendarTaskDetailPage} from "../../components"
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'


const mapDispatchToProps = (dispatch, ownProps) => ({
    calenderGoBack: (event) => dispatch(A.showComponentHideOthers(COC.CALENDAR_TASK_PAGE))
})

const mapStateToProps = (state, ownProps) => ({
    taskPlan: state.calendar.calendarTaskDetail.taskPlan,
    release: state.calendar.calendarTaskDetail.release,
    releasePlan: state.calendar.calendarTaskDetail.releasePlan,
    taskPlans: state.calendar.calendarTaskDetail.taskPlans,

})

const CalendarTaskDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarTaskDetailPage)

export default CalendarTaskDetailPageContainer