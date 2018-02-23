import React from 'react'
import {EstimationTask} from "../"
import * as SC from '../../../server/serverconstants'

let
    EstimationTasks = (props) => {
        // tasks array should not be passed to task as it keeps changes and will cause re-render
        let childProps = Object.assign({}, props, {
            tasks: undefined
        })
        return Array.isArray(props.tasks) && props.tasks.map((t, idx) => {

            if (props.estimator && props.changeRequested && props.repository && props.grantPermission && props.suggestions && props.negotiator) {
                // by default show all
                return (props.expandedTaskID === t._id) ?
                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                    expanded={true}/> :
                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
            }
            else {
                console.log("props.loggedInUserRole at task", props.loggedInUserRole)
                if (props.estimator || props.changeRequested || props.repository || props.grantPermission || props.suggestions || props.negotiator) {
                    if (props.loggedInUserRole == SC.ROLE_ESTIMATOR) {
                        console.log("estimation Role", t)
                        //when owner of task is estimator
                        console.log("props.estimator OWNER_ESTIMATOR", props.estimator)
                        if (props.estimator) {
                            if (t.owner === SC.OWNER_ESTIMATOR)
                                return (props.expandedTaskID === t._id) ?
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                    expanded="true"/> :
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />

                        }

                        console.log("suggestions", props.suggestions)
                        //when negotiator ask for suggestion
                        if (props.suggestions) {
                            if (t.negotiator.changedInThisIteration && t.negotiator.changeSuggested) {
                                return (props.expandedTaskID === t._id) ?
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                    expanded="true"/> :
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                            }
                        }

                        console.log("grantPermission", props.grantPermission)
                        //when negotiator grant the permission
                        if (props.grantPermission) {
                            if (t.negotiator.changedInThisIteration && t.negotiator.changeGranted) {
                                return (props.expandedTaskID === t._id) ?
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                    expanded="true"/> :
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                            }
                        }

                        console.log("repository", props.repository)
                        //added from repository
                        if (props.repository) {
                            if (!t.repo.addedFromThisEstimation) {
                                return (props.expandedTaskID === t._id) ?
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                    expanded="true"/> :
                                    <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                            }
                        }

                    }
                    else {
                        if (props.loggedInUserRole == SC.ROLE_NEGOTIATOR) {

                            console.log("negotiator OWNER_NEGOTIATOR ROLE_NEGOTIATOR", props.negotiator)
                            //task owner is negotiator
                            if (props.negotiator) {
                                if (t.owner === SC.OWNER_NEGOTIATOR)
                                    return (props.expandedTaskID === t._id) ?
                                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                        expanded="true"/> :
                                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />

                            }

                            console.log("negotiator changeRequested", props.changeRequested)
                            //when estimator asked for change request on task
                            if (props.changeRequested) {
                                if (t.estimator.changedInThisIteration) {
                                    if (t.estimator.changeRequested || t.estimator.removalRequested) {
                                        return (props.expandedTaskID === t._id) ?
                                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                            expanded="true"/> :
                                            <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                                    }
                                }

                            }
                            console.log("negotiator repository", props.repository)
                            if (props.repository) {
                                if (!t.repo.addedFromThisEstimation) {
                                    return (props.expandedTaskID === t._id) ?
                                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                        expanded="true"/> :
                                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                                }
                            }

                            if (props.suggestions) {
                                if (t.estimator.changedKeyInformation && t.estimator.changedInThisIteration) {
                                    return (props.expandedTaskID === t._id) ?
                                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                        expanded="true"/> :
                                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                                }
                            }
                        } else {
                            return (props.expandedTaskID === t._id) ?
                                <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                expanded="true"/> :
                                <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                        }
                    }
                } else {
                    // when all are false show all
                    console.log("show all task", t)
                    return (props.expandedTaskID === t._id) ?
                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps} expanded="true"/> :
                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                }
            }


        })


    }


export default EstimationTasks