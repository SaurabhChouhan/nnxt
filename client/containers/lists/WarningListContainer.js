import {connect} from 'react-redux'
import * as A from '../../actions'
import {WarningList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchWarningOnFlags: (warningType, release) => dispatch(A.getAllWarningsOfThisReleaseFromServer(warningType, release._id)),
    getAllWarnings: (release) => dispatch(A.getAllWarningsOfThisReleaseFromServer(SC.ALL, release._id))
})

const mapStateToProps = (state) => ({
    warnings: state.warning.all,
    release: state.release.selectedRelease
})

const WarningListContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(WarningList))

export default WarningListContainer