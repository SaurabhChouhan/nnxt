import {connect} from 'react-redux'
import {RepositoryTaskDetailPage} from '../../components'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    addTask: (EstimationId, taskId) => dispatch(A.addTaskFromRepositoryToEstimationOnServer(EstimationId, taskId)).then(json => {
        if (json.success) {
            NotificationManager.success("Task Added")
            // hide dialog
            dispatch(A.hideComponent(COC.REPOSITORY_TASK_DETAIL_DIALOG))
        } else {
            NotificationManager.error("Task Addition Failed")
        }
    })
})


const mapStateToProps = (state) => ({
    task: state.repository.task
})

const RepositoryTaskDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)( RepositoryTaskDetailPage)

export default RepositoryTaskDetailPageContainer
