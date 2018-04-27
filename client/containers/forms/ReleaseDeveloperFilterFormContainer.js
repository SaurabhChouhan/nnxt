import {connect} from 'react-redux'
import {ReleaseDeveloperFilterForm} from "../../components"
import * as A from "../../actions"
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    getDeveloperDetails: (employeeId, StartDate, EndDate) => {
        if (!employeeId) {
         return    NotificationManager.error("Please select employee")
        }
        else return dispatch(A.getDeveloperDetailsWithFilterOnServer(employeeId, StartDate, EndDate))
    }
})

const mapStateToProps = (state, ownProps) => {

    return {
        team: state.release.selectedProject && state.release.selectedProject.team && state.release.selectedProject.team.length ? state.release.selectedProject.team : [],
    }
}


const ReleaseDeveloperFilterFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperFilterForm)

export default ReleaseDeveloperFilterFormContainer