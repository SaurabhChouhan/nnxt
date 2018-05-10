import {connect} from 'react-redux'
import {ReportingDateNavBar} from "../../components"
import * as A from '../../actions/index'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onProjectSelect: (releaseID, planDate, taskStatus) => {
        if (releaseID && planDate && taskStatus)
            return dispatch(A.getProjectDeatilAndTaskPlanningsFromServer(releaseID, planDate, taskStatus))
        else {
            let dummyData = {
                taskPlans: []
            }
            dispatch(A.noProjectSelected(dummyData))
        }
    },
    setReportDate: (reportDate) => {
        return dispatch(A.setReportDate(reportDate))
    }
})

const mapStateToProps = (state, ownProps) => ({
    initialValues: {
        "dateOfReport": state.report.dateOfReport
    }
})

const ReportingDateNavBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingDateNavBar)

export default ReportingDateNavBarContainer