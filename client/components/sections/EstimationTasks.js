import React from 'react'
import {EstimationTask} from "../"
import * as SC from '../../../server/serverconstants'

let EstimationTasks = (props) => {
    // tasks array should not be passed to task as it keeps changes and will cause re-render
    let childProps = Object.assign({}, props, {
        tasks: undefined
    })

    const {changedByNegotiator, changedByEstimator, permissionRequested, addedFromRepository, addedByNegotiator, addedByEstimator, hasError} = props.filter
    const {expandedTaskID} = props
    return Array.isArray(props.tasks) && props.tasks.map((t, idx) => {
            {
                if (changedByNegotiator && changedByEstimator && permissionRequested && addedFromRepository && addedByNegotiator && addedByEstimator && hasError) {
                    return (expandedTaskID === t._id) ?
                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                        expanded={true}/> :
                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                } else {
                    if (changedByNegotiator && t.negotiator && t.negotiator.changeSuggested) {
                        return (expandedTaskID === t._id) ?
                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                            expanded={true}/> :
                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                    } else if (changedByEstimator && t.estimator && t.estimator.changedKeyInformation) {
                        return (expandedTaskID === t._id) ?
                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                            expanded={true}/> :
                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                    } else if (permissionRequested && ((t.estimator && t.estimator.removalRequested) || (t.estimator && t.estimator.changeRequested))) {
                        return (expandedTaskID === t._id) ?
                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                            expanded={true}/> :
                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                    } else if (addedFromRepository && t.repo && !t.repo.addedFromThisEstimation) {
                        return (expandedTaskID === t._id) ?
                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                            expanded={true}/> :
                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                    } else if (addedByNegotiator && t.addedInThisIteration && t.owner == SC.OWNER_NEGOTIATOR) {
                        return (expandedTaskID === t._id) ?
                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                            expanded={true}/> :
                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                    } else if (addedByEstimator && t.addedInThisIteration && t.owner == SC.OWNER_ESTIMATOR) {
                        return (expandedTaskID === t._id) ?
                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                            expanded={true}/> :
                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                    } else if (hasError && t.hasError) {
                        return (expandedTaskID === t._id) ?
                            <EstimationTask task={t} index={idx} key={"task" + idx} {...childProps}
                                            expanded={true}/> :
                            <EstimationTask task={t} index={idx} key={"task" + idx} {...childProps}/>
                    }
                }
            }

        }
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