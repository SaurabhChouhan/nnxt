import {connect} from 'react-redux'
import {EstimationTasks} from "../../components"

const mapStateToProps = (state, ownProps) => ({
    tasks: state.estimation.tasks,
    expandedTaskID: state.estimation.expandedTaskID,
    filter:state.estimation.filter

})


const EstimationTasksContainer = connect(
    mapStateToProps
)(EstimationTasks)

export default EstimationTasksContainer