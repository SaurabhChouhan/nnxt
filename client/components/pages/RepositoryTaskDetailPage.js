import React, {Component} from 'react'

class RepositoryTaskDetailPage extends Component {
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
        const {task} = this.props
        const {showHistory} = this.state
        return (
            <div className="col-md-12">
                <div className="col-md-6">
                    <h3>{task.name} </h3>
                </div>
                <div className="col-md-6">
                    <h3>{task.estimatedHours ? '(' + task.estimatedHours + ')' : '(00)'} </h3>
                </div>
                <div className="col-md-12">
                    <p>Task Description: {task.description} </p>
                </div>
                <div className="col-md-12">
                    <div className="col-md-2">
                        <button type="button" onClick={
                            this.showHistoryDetail
                        }>History
                        </button>
                    </div>
                    <div className="col-md-4">
                        <button type="button">Add to Estimation</button>
                    </div>
                    <div className="col-md-4">
                        <button type="button">Copy To Estimation</button>
                    </div>
                </div>
                {showHistory &&
                <div>{task.hasHistory ?
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

export default RepositoryTaskDetailPage