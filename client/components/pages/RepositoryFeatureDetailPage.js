import React, {Component} from 'react'

class RepositoryFeatureDetailPage extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        const {feature} = this.props
        return (
            <div className="col-md-12">
                <div className="col-md-6">
                    <h3>{feature.name} </h3>
                </div>
                <div className="col-md-6">
                    <h3>{feature.estimatedHours ? '(' + feature.estimatedHours + ')' : '(00)'} </h3>
                </div>
                <div className="col-md-12">
                    <p>Feature Description: {feature.description} </p>
                </div>
                <div className="col-md-12">
                    <div className="col-md-2">
                        <button type="button" onClick={
                            this.showHistoryDetail
                        }>History
                        </button>
                    </div>
                    <div className="col-md-4">
                        <button type="button" onClick={() => {
                            this.props.addFeature(feature._id, feature.estimation._id)
                        }}>Add to Estimation
                        </button>
                    </div>
                    <div className="col-md-4">
                        <button type="button">Copy To Estimation</button>
                    </div>
                </div>
                {showHistory &&
                <div>{feature.hasHistory ?
                    <div>
                        <lablel>under Construction</lablel>
                    </div>
                    :
                    <lablel>No History available</lablel>

                } </div>}
            </div>
        )
    }

}

export default RepositoryFeatureDetailPage