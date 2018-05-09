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

const mapStateToProps = (state, ownProps) => ({
    team: state.user && state.user.allDevelopers && state.user.allDevelopers.length ? state.user.allDevelopers : []
})


const ReleaseDeveloperFilterFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperFilterForm)

export default ReleaseDeveloperFilterFormContainer