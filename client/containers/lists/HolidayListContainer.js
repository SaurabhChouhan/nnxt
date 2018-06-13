import {connect} from 'react-redux'
import {HolidayList} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts";
import {initialize, SubmissionError} from 'redux-form'
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    editHoliday: (holiday) => {
        dispatch(A.showComponentHideOthers(COC.HOLIDAY_FORM)),
            dispatch(initialize('holiday-form', holiday))
    },
    deleteHoliday: (holidayId) => dispatch(A.deleteHolidayOnServer(holidayId)).then(json => {
        if (json.success) {
            NotificationManager.success('Holiday  Deleted Successfully')
        } else {
            NotificationManager.error('Holiday Not Deleted!')
            throw new SubmissionError({Holidays: "Holiday Deletion Failed"})
        }
    }),
    showHolidayForm: () => dispatch(A.showComponentHideOthers(COC.HOLIDAY_FORM))
})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        holidays: state.holiday.all,
        allYears: state.holiday.allYears
    }
}

const HolidayListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(HolidayList)

export default HolidayListContainer