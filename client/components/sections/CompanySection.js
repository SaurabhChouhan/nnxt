import React, {Component} from 'react'
import {ReleaseDeveloperScheduleFormContainer, ReleaseDevelopersSchedulesContainer} from '../../containers'

class CompanySection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return [<div className={'col-md-6 col-md-offset-3'}><ReleaseDeveloperScheduleFormContainer key={"schedule-form"} developers={this.props.developers}/> </div>,
            <ReleaseDevelopersSchedulesContainer key={"schedules"} colMdClass={"col-md-4"}/>
        ]
    }
}

export default CompanySection