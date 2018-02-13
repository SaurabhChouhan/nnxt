import React from 'react'
import {EstimationTask} from "../"

let
    EstimationTasks = (props) => {
        // tasks array should not be passed to task as it keeps changes and will cause re-render
        let childProps = Object.assign({}, props, {
            tasks: undefined
        })
        return Array.isArray(props.tasks) && props.tasks.map(t => <EstimationTask task={t}
                                                                                  key={t._id}  {...childProps}/>)
    }


export default EstimationTasks