import {connect} from 'react-redux'
import {LeaveDetailPage} from '../../components'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
})


const mapStateToProps = (state) => ({
    leave: state.leave.selected
})

const LeaveDetailContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LeaveDetailPage)

export default LeaveDetailContainer
