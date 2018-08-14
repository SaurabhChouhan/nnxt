import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleaseList} from "../../components"
import * as COC from '../../components/componentConsts'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    changeReleaseStatus: (status) => dispatch(A.getAllReleasesFromServer(status)),
    releaseSelected: (release) => {
        dispatch(A.getReleaseFromServer(release._id)).then(json => {
            if (json.success) {
                dispatch(A.showComponentHideOthers(COC.RELEASE_PLAN_LIST))
                dispatch(A.getReleaseForDashboard(release._id))
            }
        })
        //dispatch(A.getReleasePlansFromServer(release._id, SC.ALL, SC.ALL))


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