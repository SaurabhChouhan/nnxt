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
            if (props.loggedInUserRole == SC.ROLE_ESTIMATOR) {


                if (props.estimator && props.changeRequested && props.repository && props.grantPermission && props.suggestions) {
                    // show all
                    return (props.expandedTaskID === t._id) ?
                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps} expanded="true"/> :
                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                }
                else {

                    //when owner of task is estimator
                    if (props.estimator) {
                        if (t.owner === SC.OWNER_ESTIMATOR)
                            return (props.expandedTaskID === t._id) ?
                                <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                expanded="true"/> :
                                <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />

                    }


                    if (props.suggestions) {
                        if (t.negotiator.changedInThisIteration && t.negotiator.changeSuggested) {
                            return (props.expandedTaskID === t._id) ?
                                <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                expanded="true"/> :
                                <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                        }
                    }
                    if (props.grantPermission) {
                        if (t.negotiator.changedInThisIteration && t.negotiator.changeGranted) {
                            return (props.expandedTaskID === t._id) ?
                                <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                expanded="true"/> :
                                <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                        }
                    }

                }
            }
            else {
                if (props.loggedInUserRole == SC.ROLE_NEGOTIATOR) {
                    if (props.negotiator) {
                        if (t.owner === SC.OWNER_NEGOTIATOR)
                            return (props.expandedTaskID === t._id) ?
                                <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}
                                                expanded="true"/> :
                                <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />

                    }
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

                } else {
                    return (props.expandedTaskID === t._id) ?
                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps} expanded="true"/> :
                        <EstimationTask task={t} index={idx} key={"task" + idx}  {...childProps}  />
                }
            }

            //when owner is negotiator


        })


    }


export default EstimationTasks