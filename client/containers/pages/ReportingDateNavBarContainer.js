import {connect} from 'react-redux'
import {ReportingDateNavBar} from "../../components"
import * as A from '../../actions/index'
import moment from 'moment'

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
        "dateOfReport": moment(state.report.dateOfReport).toDate()
    }
})

const ReportingDateNavBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingDateNavBar)

export default ReportingDateNavBarContainer