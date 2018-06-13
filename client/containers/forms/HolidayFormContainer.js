import {connect} from 'react-redux'
import {HolidayForm} from "../../components"
import * as A from '../../actions'
import * as EC from "../../../server/errorcodes";
import * as SC from "../../../server/serverconstants";
import {NotificationManager} from "react-notifications";
import {SubmissionError} from "redux-form";
import * as COC from "../../components/componentConsts";


const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (holiday) => {
        if (!holiday._id) {
            return dispatch(A.addHolidayOnServer(holiday)).then(json => {
                if (json.success) {
                    NotificationManager.success('Holiday Added Successfully')
                } else {
                    NotificationManager.error('Holiday Not Added!')
                    if (json.code == EC.ALREADY_EXISTS)
                        throw new SubmissionError({name: "Holiday Already Exists"})
                }
                return json
            })
        }
        else {
            return dispatch(A.editHolidayOnServer(holiday)).then((json) => {
                    if (json.success) {
                        dispatch(A.showComponentHideOthers(COC.HOLIDAY_LIST))
                        NotificationManager.success('Holiday Updated Successful');
                    } else {
                        NotificationManager.error('Holiday Updated Failed')
                    }
                }
            )
        }
    },
    showHolidayList: () => dispatch(A.showComponentHideOthers(COC.HOLIDAY_LIST))
})

const mapStateToProps = (state, ownProps) => {
    return {
        holidays: state.leaveRequest.all,
        MONTHS_WITH_MONTH_NUMBER: SC.MONTHS_WITH_MONTH_NUMBER,
        HOLIDAY_TYPE_LIST: SC.HOLIDAY_TYPE_LIST_WITH_NAME
    }
}

const HolidayFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(HolidayForm)

export default HolidayFormContainer