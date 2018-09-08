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

    let releaseStartMoment = moment(momentTZ.utc(state.release.selectedRelease.devStartDate).format(DATE_FORMAT))
    let releaseEndMoment = moment(momentTZ.utc(state.release.selectedRelease.devEndDate).format(DATE_FORMAT))
    let now = moment(moment().format(DATE_FORMAT), DATE_FORMAT)

    let startDate = undefined
    let endDate = undefined

    if (now.isAfter(releaseEndMoment) || now.isBefore(releaseStartMoment)) {
        // Show task plans of release date range
        startDate = releaseStartMoment.format(DATE_FORMAT)
        endDate = releaseEndMoment.format(DATE_FORMAT)
    } else {
        startDate = now.format(DATE_FORMAT)
    }


    return {
        initialValues: {
            "releaseID": state.release.selectedRelease._id,
            startDate,
            endDate,
            expandDescription: state.release.expandDescriptionTaskList
        },
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