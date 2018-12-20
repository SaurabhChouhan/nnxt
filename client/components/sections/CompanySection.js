import React, {Component} from 'react'
import {ReleaseDeveloperScheduleFormContainer, ReleaseDevelopersSchedulesContainer} from '../../containers'

class CompanySection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return [<ReleaseDeveloperScheduleFormContainer key={"schedule-form"} developers={this.props.developers}/>,
            <ReleaseDevelopersSchedulesContainer key={"schedules"} colMdClass={"col-md-4"}/>
        ]
    }
}

export default CompanySection