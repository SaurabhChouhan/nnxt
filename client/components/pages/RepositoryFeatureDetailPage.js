import React, {Component} from 'react'

class RepositoryFeatureDetailPage extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        const {feature} = this.props
        return (
            <div>
                <div>
                    <h3>Feature Name:  {this.props.feature.name} </h3>
                </div>
                <div>
                    <p>Feature Description: {this.props.feature.description} </p>
                </div>
            </div>
        )
    }

}

export default RepositoryFeatureDetailPage