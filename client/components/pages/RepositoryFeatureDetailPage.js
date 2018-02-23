import React, {Component} from 'react'

class RepositoryFeatureDetailPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showHistory: false
        }
        this.showHistoryDetail = this.showHistoryDetail.bind(this);
    }

    showHistoryDetail() {
        this.setState({showHistory: !this.state.showHistory})
    }


    render() {
        const {feature, estimationId} = this.props
        const {showHistory} = this.state
        return (
            <div className="col-md-12">
                <div className="col-md-6">
                    <h3>{feature.name} </h3>
                </div>
                <div className="col-md-6">
                    <h3>{feature.estimatedHours ? '(' + feature.estimatedHours + ')' : '(00)'} </h3>
                </div>
                <div className="col-md-12">
                    <p className="repositoryModalPara">Feature Description: {feature.description} </p>
                </div>
                <div className="col-md-12 pad">
                    <div className="col-md-3">
                        <button className="customBtn" type="button" onClick={
                            this.showHistoryDetail
                        }>History
                        </button>
                    </div>
                    <div className="col-md-4 pad">
                        <button className="customBtn" type="button" onClick={() => {
                            this.props.addFeature(estimationId, feature._id)
                        }}>Add to Estimation
                        </button>
                    </div>
                    <div className="col-md-5">
                        <button className="customBtn" type="button">Copy To Estimation</button>
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