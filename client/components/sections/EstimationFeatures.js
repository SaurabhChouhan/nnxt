import React from 'react'
import {EstimationFeature} from "../"


let EstimationFeatures = (props) => {
    let childProps = Object.assign({}, props, {
        features: undefined
    })

    return Array.isArray(props.features) && props.features.map((f, idx) =>
        (props.expandedFeatureID === f._id) ?
            <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps} expanded="true"/> :
            <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
    )
}

export default EstimationFeatures