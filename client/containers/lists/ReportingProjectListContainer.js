import {connect} from 'react-redux'
import {ReportingProjectList} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'

const mapDispatchToProps = (dispatch, ownProps) => ({})

const mapStateToProps = (state, ownProps) => ({})

const ReportingProjectListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingProjectList)

export default ReportingProjectListContainer