import React from 'react'
import {EstimationFeature} from "../"
import * as SC from "../../../server/serverconstants";


let EstimationFeatures = (props) => {
    let childProps = Object.assign({}, props, {
        features: undefined
    })

    return Array.isArray(props.features) && props.features.map((f, idx) => {


        if (props.estimator && props.changeRequested && props.repository && props.grantPermission && props.suggestions && props.negotiator) {
            console.log("feature....", f)
            return (props.expandedFeatureID === f._id) ?
                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps} expanded={true}/> :
                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
        }
        else {
            if (props.estimator || props.changeRequested || props.repository || props.grantPermission || props.suggestions || props.negotiator) {

                if (props.loggedInUserRole == SC.ROLE_ESTIMATOR) {


                    //when feature owner is estimator
                    if (props.estimator) {
                        if (f.owner === SC.OWNER_ESTIMATOR)
                            return (props.expandedFeatureID === f._id) ?
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                   expanded="true"/> :
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>

                    }

                    //when negotiator grant the permission required
                    if (props.grantPermission) {
                        if (f.negotiator.changedInThisIteration && f.negotiator.changeGranted) {
                            return (props.expandedFeatureID === f._id) ?
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                   expanded="true"/> :
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                        }
                    }
                    if (props.suggestions) {
                        if (f.negotiator.changedInThisIteration && f.negotiator.changeSuggested) {
                            return (props.expandedFeatureID === f._id) ?
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                   expanded="true"/> :
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                        }
                    }

                    //feature added from repository
                    if (props.repository) {
                        if (!f.repo.addedFromThisEstimation) {
                            return (props.expandedFeatureID === f._id) ?
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                   expanded="true"/> :
                                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                        }
                    }
                }
                else {
                    if (props.loggedInUserRole == SC.ROLE_NEGOTIATOR) {

                        //feature owner is negotiator
                        if (props.negotiator) {
                            if (f.owner === SC.OWNER_NEGOTIATOR)
                                return (props.expandedFeatureID === f._id) ?
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                       expanded="true"/> :
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>

                        }

                        //when estimator asked for change request on feature
                        if (props.changeRequested) {
                            if (f.estimator.changedInThisIteration) {
                                if (f.estimator.changeRequested || f.estimator.removalRequested) {
                                    return (props.expandedFeatureID === f._id) ?
                                        <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                           expanded="true"/> :
                                        <EstimationFeature feature={f} index={idx}
                                                           key={"feature" + idx} {...childProps}/>
                                }
                            }

                        }

                        if (props.repository) {
                            if (!f.repo.addedFromThisEstimation) {
                                return (props.expandedFeatureID === f._id) ?
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                       expanded="true"/> :
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                            }
                        }
                        if (props.suggestions) {
                            if (f.estimator.changedInThisIteration && f.estimator.changedKeyInformation) {
                                return (props.expandedFeatureID === f._id) ?
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                       expanded="true"/> :
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                            }
                        }
                    }
                    else {
                        return (props.expandedFeatureID === f._id) ?
                            <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                               expanded="true"/> :
                            <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
                    }
                }

            }
            else {
                // by default show all
                return (props.expandedFeatureID === f._id) ?
                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps} expanded="true"/> :
                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
            }
        }





    })
}

export default EstimationFeatures