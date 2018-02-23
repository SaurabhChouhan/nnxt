import {connect} from 'react-redux'
import {RepositoryTaskDetailPage} from '../../components'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as EC from '../../../server/errorcodes'

const mapDispatchToProps = (dispatch, ownProps) => ({
    addTask: (EstimationId, taskId) => dispatch(A.addTaskFromRepositoryToEstimationOnServer(EstimationId, taskId)).then(json => {
        if (json.success) {
            NotificationManager.success("Task Added")
            // hide dialog
            dispatch(A.hideComponent(COC.REPOSITORY_TASK_DETAIL_DIALOG))
        } else {
            if (json.code == EC.ALREADY_EXISTS)
                NotificationManager.error("Task Already Added ")
            else  NotificationManager.error("Task Addition Failed")
        }
    }),
    copyTask: (EstimationId, task) => dispatch(A.copyTaskFromRepositoryToEstimationOnServer(EstimationId, task)).then(json => {
        if (json.success) {
            NotificationManager.success("Task Copied")
            // hide dialog
            dispatch(A.hideComponent(COC.REPOSITORY_TASK_DETAIL_DIALOG))
        } else {
            if (json.code == EC.ALREADY_EXISTS)
                NotificationManager.error("Task Already Available ")
            else  NotificationManager.error("Task Addition Failed")
        }
    })
})


const mapStateToProps = (state) => ({
    task: state.repository.task,
    estimationId: state.estimation.selected && state.estimation.selected._id ? state.estimation.selected._id : undefined
})

const RepositoryTaskDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)( RepositoryTaskDetailPage)

export default RepositoryTaskDetailPageContainer
