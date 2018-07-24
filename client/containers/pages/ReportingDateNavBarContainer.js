import {connect} from 'react-redux'
import {ReportingDateNavBar} from "../../components"
import * as A from '../../actions/index'
import moment from 'moment'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onReleaseSelected: (releaseID, planDate, taskStatus) => {
        if (releaseID && planDate) {
            dispatch(A.getReportingTasksForDate(releaseID, planDate, taskStatus))

        }
    },
    setReportDate: (reportDate) => {
        return dispatch(A.setReportDate(reportDate))
    }
})

const mapStateToProps = (state, ownProps) => ({
    reportedStatus: state.report.reportedStatus,
    releaseID: state.report.releaseID,
    initialValues: {
        "dateOfReport": moment(state.report.dateStringOfReport).toDate()
    }
})

const ReportingDateNavBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingDateNavBar)

export default ReportingDateNavBarContainer