import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {EstimationDetail} from "../../components"

const mapDispatchToProps = (dispatch, ownProps) => ({
    showAddTaskForm: (estimationID) => {

    },
    sendToEstimator: (estimationID) => {

    }
})


const mapStateToProps = (state) => ({
    loggedInUser: state.user.loggedIn
})

const EstimationDetailContainer = withRouter(connect(
    mapStateToProps
)(EstimationDetail))

export default EstimationDetailContainer
