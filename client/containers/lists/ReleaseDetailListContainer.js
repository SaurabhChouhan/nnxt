import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleaseDetailList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'


const mapDispatchToProps = (dispatch, ownProps) => ({
    changeReleaseFlag: (release, status, flag) => dispatch(A.getTaskReleaseFromServer(release, status, flag)),

    changeReleaseStatus: (release, status, flag) => dispatch(A.getTaskReleaseFromServer(release, status, flag)),

    taskSelected: (taskPlanning) => {
            dispatch(A.releaseTaskSelected(taskPlanning)),
            dispatch(A.getAllTaskPlannedFromServer(taskPlanning._id))
            dispatch(A.showComponentHideOthers(COC.RELEASE_TASK_DETAIL_PAGE))
    }

})

const mapStateToProps = (state) => {
    return {
        loggedInUser: state.user.loggedIn,
        release: state.release.selected,
        releasePlans: state.release.all
    }
}

const ReleaseDetailListContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDetailList))

export default ReleaseDetailListContainer