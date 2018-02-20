import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleaseList} from "../../components"

const mapDispatchToProps = (dispatch, ownProps) => ({
    changeReleseStatus: (status) => {
        dispatch(A.getAllReleaseFromServer(status))
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        releases: state.release.all
    }
}

const ReleaseListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseList)

export default ReleaseListContainer