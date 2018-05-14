import {connect} from 'react-redux'
import {ReportingDateNavBar} from "../../components"
import * as A from '../../actions/index'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onProjectSelect: (releaseID, planDate, taskStatus) => {
        if (!releaseID || _.isEmpty(releaseID) || releaseID === "Select Project" || releaseID === undefined || !planDate && !taskStatus) {
            let dummyData = {
                taskPlans: []
            }
            dispatch(A.noProjectSelected(dummyData))
        } else {
            dispatch(A.getProjectDeatilAndTaskPlanningsFromServer(releaseID, planDate, taskStatus))
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