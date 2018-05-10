import {connect} from 'react-redux'
import {CalendarPage} from "../../components"
import * as A from '../../actions'

const mapDispatchToProps = (dispatch, ownProps) => {
    return (
    {
        showSelectedTaskDetail: (event) => dispatch(A.showSelectedTaskDetail(event)),
        changeViewAndDate:(view,date)=>{
            dispatch(A.changeNavigationView(view,date))
        },
        showCalendarView: (event) => dispatch(A.showCalendarView()),
    }
)}

const mapStateToProps = (state) => {
    return {
    calendar: state.calendar.loggedInUser,
    events: state.calendar.events,
    visibility: state.calendar.visibility,
    selectedTaskDetail: state.calendar.selectedTaskDetail,
    selectedView:state.calendar.selectedView,
    selectedDate:state.calendar.selectedDate
}}

const CalendarPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarPage)

export default CalendarPageContainer


