import {connect} from 'react-redux'
import * as A from '../../actions'
import {TaskReportList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({})

const mapStateToProps = (state) => ({
    reports: state.report.releasesReports
})

const TaskReportListContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskReportList))

export default TaskReportListContainer