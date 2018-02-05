import React from 'react'

import * as SC from "../../../server/serverconstants"
import * as logger from '../../clientLogger'


class EstimationFeature extends React.PureComponent {

    render() {
        const {feature, loggedInUserRole} = this.props

        let buttons = [];

        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'logged in user is ', loggedInUserRole)
        logger.debug(logger.ESTIMATION_TASK_BUTTONS, 'task owner ', feature.owner)

        logger.debug(logger.ESTIMATION_FEATURE_RENDER, this.props)
        return <div className="feature">
            <div className="col-md-12 pad">
                <h4>{feature.estimator.name}</h4>
            </div>
            <div className="col-md-12 pad">
                <p>{feature.estimator.description}</p>
            </div>
            <div className="col-md-2 col-md-offset-1 pad">
                <h4>Est. Hrs:</h4> <h4>&nbsp;{feature.estimator.estimatedHours}</h4>
            </div>
            <div className="col-md-3 pad">
                <h4>Sug. Hrs:</h4> <h4>&nbsp;{feature.negotiator.estimatedHours}</h4>
            </div>

            <div className="col-md-6 text-right estimationActions pad">
                {buttons}
            </div>
            {feature.addedInThisIteration && <div className="newFlagStrip">
                <img src="/images/new_flag.png"></img>
            </div>}

            {!feature.repo.addedFromThisEstimation &&
            <div className="repoFlagStrip">
                <img src="/images/repo_flag.png"></img>
            </div>
            }
        </div>

    }
}

let
    EstimationFeatures = (props) =>
        Array.isArray(props.features) && props.features.map(f => <EstimationFeature feature={f} key={f._id}
                                                                                    loggedInUserRole={props.loggedInUserRole}/>)

export default EstimationFeatures