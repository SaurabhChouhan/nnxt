import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleaseList} from "../../components"
import * as COC from '../../components/componentConsts'

const mapDispatchToProps = (dispatch, ownProps) => ({
    changeReleaseStatus: (status) => dispatch(A.getAllReleasesFromServer(status)),
    releaseSelected: (release) => {
        dispatch(A.getReleaseFromServer(release._id))
        dispatch(A.getReleasePlansFromServer(release._id, "all", "all"))
        dispatch(A.showComponentHideOthers(COC.RELEASE_PLAN_LIST))
    }
})

const mapStateToProps = (state, ownProps) => ({
    releases: state.release.all
})

const ReleaseListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseList)

export default ReleaseListContainer