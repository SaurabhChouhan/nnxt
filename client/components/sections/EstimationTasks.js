import React from 'react'

import * as SC from "../../../server/serverconstants"
import * as logger from '../../clientLogger'


class EstimationTask extends React.PureComponent {

    render() {
        const {task, loggedInUserRole} = this.props
        logger.debug(logger.ESTIMATION_TASK_RENDER, this.props)
        return <div className="task">
            <div className="col-md-12 pad">
                <h4>{task.estimator.name}</h4>
            </div>
            <div className="col-md-12 pad">
                <p>{task.estimator.description}</p>
            </div>
            <div className="col-md-2 col-md-offset-1 pad">
                <h4>Est. Hrs:</h4> <h4>&nbsp;{task.estimator.estimatedHours}</h4>
            </div>
            <div className="col-md-3 pad">
                <h4>Sug. Hrs:</h4> <h4>&nbsp;{task.negotiator.estimatedHours}</h4>
            </div>

            <div className="col-md-6 text-right estimationActions pad">
                {
                    task.owner == SC.OWNER_ESTIMATOR && (task.addedInThisIteration &&
                        [<img key="est_task_edit" src="/images/edit.png"></img>,
                            <img key="est_task_delete" src="/images/delete.png"
                                 onClick={() => this.props.onTaskDelete(task._id)}></img>,
                            <img key="est_task_mvtofeature" src="/images/move_to_feature.png"></img>]
                        || !task.addedInThisIteration && (
                            !task.estimator.removalRequested ?
                                <img key="est_task_delete" src="/images/request_delete.png"
                                     onClick={() => this.props.onTaskDelete(task._id)}/> :
                                <img key="est_task_delete" src="/images/requested_delete.png"
                                     onClick={() => this.props.onTaskDelete(task._id)}/>

                        )
                    )

                }
            </div>

            {task.addedInThisIteration && <div className="newFlagStrip">
                <img src="/images/new_flag.png"></img>
            </div>}

            {!task.repo.addedFromThisEstimation &&
            <div className="repoFlagStrip">
                <img src="/images/repo_flag.png"></img>
            </div>
            }
        </div>

    }
}

let EstimationTasks = (props) =>
    props.tasks.map(t => <EstimationTask task={t} key={t._id} loggedInUserRole={props.loggedInUserRole}
                                         onTaskDelete={props.onTaskDelete}/>)

export default EstimationTasks