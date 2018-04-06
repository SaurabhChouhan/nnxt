import React from 'react'
import {EstimationTask} from "../"

let EstimationTasks = (props) => {
        // tasks array should not be passed to task as it keeps changes and will cause re-render
        let childProps = Object.assign({}, props, {
            tasks: undefined
        })
        const {estimator, changeRequested, repository, grantPermission, suggestions, negotiator} = props.filter
        const {expandedTaskID, loggedInUserRole} = props
    return Array.isArray(props.tasks) && props.tasks.map((t, idx) => (expandedTaskID === t._id) ?
        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                        expanded={true}/> :
        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
    )
}

export default EstimationTasks


{/*

        {

            if (estimator && changeRequested && repository && grantPermission && suggestions && negotiator) {
                // by default show all
                return
            }
            else {
                if (estimator || changeRequested || repository || grantPermission || suggestions || negotiator) {
                    if (loggedInUserRole == SC.ROLE_ESTIMATOR) {
                        //when owner of task is estimator
                        if (estimator) {
                            if (t.owner === SC.OWNER_ESTIMATOR)
                                return (expandedTaskID === t._id) ?
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                    expanded="true"/> :
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />

                        }

                        //when negotiator ask for suggestion
                        if (suggestions) {
                            if (t.negotiator.changedInThisIteration && t.negotiator.changeSuggested) {
                                return (expandedTaskID === t._id) ?
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                    expanded="true"/> :
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                            }
                        }

                        //when negotiator grant the permission
                        if (grantPermission) {
                            if (t.negotiator.changedInThisIteration && t.negotiator.changeGranted) {
                                return (expandedTaskID === t._id) ?
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                    expanded="true"/> :
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                            }
                        }

                        //added from repository
                        if (repository) {
                            if (t.repo)
                                if (!t.repo.addedFromThisEstimation) {
                                    return (expandedTaskID === t._id) ?
                                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                        expanded="true"/> :
                                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                                }
                        }

                    }
                    else {
                        if (loggedInUserRole == SC.ROLE_NEGOTIATOR) {

                            //task owner is negotiator
                            if (negotiator) {
                                if (t.owner === SC.OWNER_NEGOTIATOR)
                                    return (expandedTaskID === t._id) ?
                                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                        expanded="true"/> :
                                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />

                            }

                            //when estimator asked for change request on task
                            if (changeRequested) {
                                if (t.estimator.changedInThisIteration) {
                                    if (t.estimator.changeRequested || t.estimator.removalRequested) {
                                        return (expandedTaskID === t._id) ?
                                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                            expanded="true"/> :
                                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                                    }
                                }

                            }
                            if (repository) {
                                if (t.repo)
                                    if (!t.repo.addedFromThisEstimation) {
                                        return (expandedTaskID === t._id) ?
                                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                            expanded="true"/> :
                                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                                    }
                            }

                            if (suggestions) {
                                if (t.estimator.changedKeyInformation && t.estimator.changedInThisIteration) {
                                    return (expandedTaskID === t._id) ?
                                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                        expanded="true"/> :
                                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                                }
                            }
                        } else {
                            return (expandedTaskID === t._id) ?
                                <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                expanded="true"/> :
                                <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                        }
                    }
                } else {
                    // when all are false show all
                    return (expandedTaskID === t._id) ?
                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps} expanded="true"/> :
                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                }
            }


        })


    }

*/
}