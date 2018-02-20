import {connect} from 'react-redux'
import {EstimationTasks} from "../../components"

const mapStateToProps = (state, ownProps) => ({
    tasks: state.estimation.tasks,
    expandedTaskID: state.estimation.expandedTaskID,
    repository:state.estimation.repository,
    estimator:state.estimation.estimator,
    negotiator:state.estimation.negotiator,
    changeRequested:state.estimation.changeRequested,
    grantPermission:state.estimation.grantPermission,
    suggestions:state.estimation.suggestions,

})


const EstimationTasksContainer = connect(
    mapStateToProps
)(EstimationTasks)

export default EstimationTasksContainer