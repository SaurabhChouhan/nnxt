import {connect} from 'react-redux'
import {HolidayForm} from "../../components"
import * as A from '../../actions'
import * as EC from "../../../server/errorcodes";
import * as SC from "../../../server/serverconstants";
import {NotificationManager} from "react-notifications";
import {SubmissionError} from "redux-form";


const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (holiday) => {
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
})

const mapStateToProps = (state, ownProps) => {
    let monthNo = [
        {"monthNo": 1},
        {"monthNo": 2},
        {"monthNo": 3},
        {"monthNo": 4},
        {"monthNo": 5},
        {"monthNo": 6},
        {"monthNo": 7},
        {"monthNo": 8},
        {"monthNo": 9},
        {"monthNo": 10},
        {"monthNo": 11},
        {"monthNo": 12}

    ]
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