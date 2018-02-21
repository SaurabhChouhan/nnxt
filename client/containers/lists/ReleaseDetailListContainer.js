import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleaseDetailList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'


const mapDispatchToProps = (dispatch, ownProps) => ({
    changeReleseFlag: (flag) => {
        if (flag)
            return dispatch(A.getAllReleaseFromServer(flag))
    }

})

const mapStateToProps = (state) => {
    console.log("releaseDetail", state.release.selected)
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