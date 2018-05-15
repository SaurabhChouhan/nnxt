import {connect} from 'react-redux'
import {CalendarTaskPage} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'

const mapDispatchToProps = (dispatch, ownProps) => {
    return (
        {
            taskSelected: (event) => {
                return dispatch(A.getTaskAndProjectDetailsForCalendarFromServer(event._id))
            },

            showTaskDetailPage: () => {
                return dispatch(A.dispatch(A.showComponentHideOthers(COC.CALENDAR_TASK_DETAIL_PAGE)))
            },

            changeViewAndDate: (view, date) => {
                dispatch(A.changeNavigationView(view, date))
            }
        }
    )
}

const mapStateToProps = (state) => {
    return {
        events: state.calendar.events,
        selectedView: state.calendar.selectedView,
        selectedDate: state.calendar.selectedDate
    }
}

const CalendarTaskPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarTaskPage)

export default CalendarTaskPageContainer


