import {connect} from 'react-redux'
import {CalendarPage} from "../../components"
import * as A from '../../actions'

const mapDispatchToProps = (dispatch, ownProps) => {
    return (
    {
        showSelectedTaskDetail: (event) => dispatch(A.showSelectedTaskDetail(event)),
        showCalendarView: (event) => dispatch(A.showCalendarView()),
        projectSelected: (data) => {
            dispatch(A.calendarDataFetchInProgress())
            dispatch(A.fetchAllProjectTaskListFromServer(data._id)).then(() => {
                dispatch(A.calendarDataFetchCompleted())
                dispatch(A.changeNavigationView(null,null))
            })
        },
        changeViewAndDate:(view,date)=>{
            dispatch(A.changeNavigationView(view,date))
        }
    }
)}

const mapStateToProps = (state) => {
    return {
    calendar: state.calendar.loggedInUser,
    events: state.calendar.events,
    visibility: state.calendar.visibility,
    selectedTaskDetail: state.calendar.selectedTaskDetail,
    fetchInProgress: state.calendar.fetchInProgress,
    selectedView:state.calendar.selectedView,
    selectedDate:state.calendar.selectedDate
}}

const CalendarPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarPage)

export default CalendarPageContainer


