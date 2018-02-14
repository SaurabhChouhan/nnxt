import {connect} from 'react-redux'
import {EstimationTasks} from "../../components"

const mapStateToProps = (state, ownProps) => ({
    tasks: state.estimation.tasks
})


const EstimationTasksContainer = connect(
    mapStateToProps
)(EstimationTasks)

export default EstimationTasksContainer