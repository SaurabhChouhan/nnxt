import {connect} from 'react-redux'
import {ReleasePlanDateNavBar} from "../../components/index"
import * as A from '../../actions/index'
import moment from 'moment'
import momentTZ from "moment-timezone";
import {DATE_FORMAT} from "../../../server/serverconstants";

const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchReleasePlans: (values) => {
        dispatch(A.searchReleasePlansOnServer(values))
    },
    expandReleasePlanDescription: (flag) => dispatch(A.expandDescriptionReleasePlanList(flag)),

})

const mapStateToProps = (state) => {
    return {
        initialValues: state.release.releasePlanFilters,
        devStartDate: state.release.selectedRelease.devStartDate,
        devEndDate: state.release.selectedRelease.devEndDate,
        releaseID: state.release.selectedRelease._id,
        expandDescription: state.release.expandDescriptionTaskList
    }
}

const ReleasePlanDateNavBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleasePlanDateNavBar)

export default ReleasePlanDateNavBarContainer