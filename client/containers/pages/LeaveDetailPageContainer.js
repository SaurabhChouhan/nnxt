import {connect} from 'react-redux'
import {LeaveDetailPage} from '../../components'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    leaveGoBack: (event) => dispatch(A.showComponentHideOthers(COC.LEAVE_LIST))
})


const mapStateToProps = (state) => ({
    leave: state.leave.selected
})

const LeaveDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LeaveDetailPage)

export default LeaveDetailPageContainer
