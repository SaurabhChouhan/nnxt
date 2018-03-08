import React from 'react'
import {EstimationFeature} from "../"
import * as SC from "../../../server/serverconstants";


let EstimationFeatures = (props) => {
    let childProps = Object.assign({}, props, {
        features: undefined
    })
    const {repository, estimator, negotiator, changeRequested, grantPermission, suggestions} = props.filter
    const {expandedFeatureID,loggedInUserRole} = props
       
    return Array.isArray(props.features) && props.features.map((f, idx) => {

        if (!f) {
            return <span></span>
        }
        if (estimator && changeRequested &&repository && grantPermission && suggestions && negotiator) {
            return (expandedFeatureID === f._id) ?
                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps} expanded={true}/> :
                <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
        }
        else {
            if (estimator || changeRequested ||repository || grantPermission || suggestions || negotiator) {

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
                    if (repository)
                    {
                        if(f.repo)
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
                            if(f.repo)
                            if (!f.repo.addedFromThisEstimation) {
                                return (expandedFeatureID === f._id) ?
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}
                                                       expanded="true"/> :
                                    <EstimationFeature feature={f} index={idx} key={"feature" + idx} {...childProps}/>
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





    })
}

export default EstimationFeatures