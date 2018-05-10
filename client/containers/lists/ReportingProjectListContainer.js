import {connect} from 'react-redux'
import {ReportingProjectList} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'

const mapDispatchToProps = (dispatch, ownProps) => ({})

const mapStateToProps = (state, ownProps) => ({
    projectList:state.report.all,
    selectedProject: state.report.selectedProject,
})

const ReportingProjectListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingProjectList)

export default ReportingProjectListContainer