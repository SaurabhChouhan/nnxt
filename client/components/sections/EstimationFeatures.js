import React from 'react'
import {EstimationFeature} from "../"
import * as SC from '../../../server/serverconstants'

let EstimationFeatures = (props) => {
    let childProps = Object.assign({}, props, {
        features: undefined
    })
    const {changedByNegotiator, changedByEstimator, permissionRequested, addedFromRepository, addedByNegotiator, addedByEstimator, hasError} = props.filter
    const {expandedFeatureID} = props

    return Array.isArray(props.features) && props.features.map((f, idx) => {
            if (!f) {
                return <span></span>
            }
            if (changedByNegotiator && changedByEstimator && permissionRequested && addedFromRepository && addedByNegotiator && addedByEstimator && hasError) {
                return (expandedFeatureID === f._id) ?
                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                       expanded={true}/> :
                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
            } else {
                if (changedByNegotiator && f.negotiator && ( f.negotiator.changeSuggested || f.negotiator.changedInThisIteration) && (!f.addedInThisIteration)) {
                    return (expandedFeatureID === f._id) ?
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                           expanded={true}/> :
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                }
                if (changedByEstimator && f.estimator && ( f.estimator.changedKeyInformation || f.estimator.changedInThisIteration)) {
                    return (expandedFeatureID === f._id) ?
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                           expanded={true}/> :
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                }
                if (permissionRequested && f.estimator && ((f.estimator.removalRequested) || (f.estimator.changeRequested) || (f.tasks && Array.isArray(f.tasks) && f.tasks.length && f.tasks.findIndex(t => ((t.estimator && t.estimator.removalRequested) || (t.estimator && t.estimator.changeRequested))) != -1))) {
                    return (expandedFeatureID === f._id) ?
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                           expanded={true}/> :
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                }
                if (addedFromRepository && (( f.repo && !f.repo.addedFromThisEstimation) || (f.tasks && Array.isArray(f.tasks) && f.tasks.length && f.tasks.findIndex(t => t.repo && !t.repo.addedFromThisEstimation) != -1))) {
                    return (expandedFeatureID === f._id) ?
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                           expanded={true}/> :
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                }


                if (addedByNegotiator && ((f.addedInThisIteration && f.owner == SC.OWNER_NEGOTIATOR) || (f.tasks && Array.isArray(f.tasks) && f.tasks.length && f.tasks.findIndex(t => t.addedInThisIteration && t.owner == SC.OWNER_NEGOTIATOR) != -1))) {
                    return (expandedFeatureID === f._id) ?
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                           expanded={true}/> :
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                }
                if (addedByEstimator && ((f.addedInThisIteration && f.owner == SC.OWNER_ESTIMATOR) || (f.tasks && Array.isArray(f.tasks) && f.tasks.length && f.tasks.findIndex(t => t.addedInThisIteration && t.owner == SC.OWNER_ESTIMATOR) != -1))) {
                    return (expandedFeatureID === f._id) ?
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                           expanded={true}/> :
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                }
                if (hasError && f.hasError) {
                    return (expandedFeatureID === f._id) ?
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                           expanded={true}/> :
                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                }


            }
        }
    )
}

export default EstimationFeatures


{/*

        if (!f) {
            return <span></span>
        }
        if (estimator && changeRequested && repository && grantPermission && suggestions && negotiator) {

        }
        else {
            if (estimator || changeRequested || repository || grantPermission || suggestions || negotiator) {

                if (loggedInUserRole == SC.ROLE_ESTIMATOR) {


                    //when feature owner is estimator
                    if (estimator) {
                        if (f.owner === SC.OWNER_ESTIMATOR)
                            return (expandedFeatureID === f._id) ?
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                   expanded="true"/> :
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>

                    }

                    //when negotiator grant the permission required
                    if (grantPermission) {
                        if (f.negotiator.changedInThisIteration && f.negotiator.changeGranted) {
                            return (expandedFeatureID === f._id) ?
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                   expanded="true"/> :
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                        }
                    }
                    if (suggestions) {
                        if (f.negotiator.changedInThisIteration && f.negotiator.changeSuggested) {
                            return (expandedFeatureID === f._id) ?
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                   expanded="true"/> :
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                        }
                    }

                    //feature added from repository
                    if (repository) {
                        if (f.repo)
                            if (!f.repo.addedFromThisEstimation) {
                                return (expandedFeatureID === f._id) ?
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                       expanded="true"/> :
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                            }
                    }
                }
                else {
                    if (loggedInUserRole == SC.ROLE_NEGOTIATOR) {

                        //feature owner is negotiator
                        if (negotiator) {
                            if (f.owner === SC.OWNER_NEGOTIATOR)
                                return (expandedFeatureID === f._id) ?
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                       expanded="true"/> :
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>

                        }

                        //when estimator asked for change request on feature
                        if (changeRequested) {
                            if (f.estimator.changedInThisIteration) {
                                if (f.estimator.changeRequested || f.estimator.removalRequested) {
                                    return (expandedFeatureID === f._id) ?
                                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                           expanded="true"/> :
                                        <EstimationFeature feature={f} index={idx}
                                                           key={"feature" + idx} {...childProps}/>
                                }
                            }

                        }

                        if (repository) {
                            if (f.repo)
                                if (!f.repo.addedFromThisEstimation) {
                                    return (expandedFeatureID === f._id) ?
                                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                           expanded="true"/> :
                                        <EstimationFeature feature={f} index={idx}
                                                           key={"feature" + idx} {...childProps}/>
                                }
                        }
                        if (suggestions) {
                            if (f.estimator.changedInThisIteration && f.estimator.changedKeyInformation) {
                                return (expandedFeatureID === f._id) ?
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                       expanded="true"/> :
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                            }
                        }
                    }
                    else {
                        return (expandedFeatureID === f._id) ?
                            <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                               expanded="true"/> :
                            <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                    }
                }

            }
            else {
                // by default show all
                return (expandedFeatureID === f._id) ?
                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps} expanded="true"/> :
                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
            }
        }


   */

}