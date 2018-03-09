import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleaseDetailList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'


const mapDispatchToProps = (dispatch, ownProps) => ({
    taskPlanSelected: (taskPlanning) => {
        dispatch(A.releaseTaskPlanSelected(taskPlanning)),
            dispatch(A.addDeveloperFilteredData([])),
            dispatch(A.getAllTaskPlannedFromServer(taskPlanning.task._id))
        dispatch(A.showComponentHideOthers(COC.RELEASE_TASK_DETAIL_PAGE))
    }

})

const mapStateToProps = (state) => {
    return {
        loggedInUser: state.user.loggedIn,
        release: state.release.selected,
        releasePlans: state.release.allReleses
    }
}

const ReleaseDetailListContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDetailList))

export default ReleaseDetailListContainer