import {connect} from 'react-redux'
import * as A from '../../actions'
import {WarningList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    changeWarningFlag: (warnings, status, flag) => dispatch(A.getWarningsFromServer(warnings.type,status, flag)),
    changeWarningStatus: (warnings, status, flag) => dispatch(A.getWarningsFromServer(warnings.type, status, flag)),
})

const mapStateToProps = (state) => ({
    warnings: state.warning.all
})

const WarningListContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(WarningList))

export default WarningListContainer