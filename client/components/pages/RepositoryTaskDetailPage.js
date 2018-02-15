import React, {Component} from 'react'

class RepositoryTaskDetailPage extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        const {task} = this.props
        return (
            <div>
                <div>
                    <h3>Task Name:  {this.props.task.name} </h3>
                </div>
                <div>
                    <p>Task Description: {this.props.task.description} </p>
                </div>
            </div>
        )
    }

}

export default RepositoryTaskDetailPage