import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderDateTimePickerString, renderSelect} from './fields'
import momentTZ from 'moment-timezone'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'
import * as SC from '../../../server/serverconstants'

moment.locale('en')
momentLocalizer()


class ReleaseDeveloperScheduleForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            monthMoment: moment()
        }
    }

    render() {
        let props = this.props
        const {handleSubmit, employeeID, team} = props
        return <div>
            <form onSubmit={handleSubmit}>
                <div className="col-md-12 repositoryHeading RepositorySideHeight releaseDevScheduleHeading">
                    <div className="col-md-6 pad">
                        <h5><b>Developers Schedules</b></h5>
                    </div>
                    <div className="col-md-6 pad text-right">
                        <Field name="employeeID"
                               placeholder={"Name of Developer"}
                               onChange={(event, newValue, oldValue) => {
                                   props.getDeveloperSchedules(newValue, this.state.monthMoment.month())
                               }}
                               component={renderSelect}
                               options={team}
                        />

                    </div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-3">
                        <button className={"btn reportingArrow"}
                                style={{marginLeft: '-16px'}}
                                onClick={() => {
                                    let newMonthMoment = this.state.monthMoment.clone().subtract(1, 'month')
                                    props.getDeveloperSchedules(employeeID, newMonthMoment.month())
                                    this.setState({
                                        monthMoment: newMonthMoment
                                    })
                                }}
                                type="button">
                            <i className="glyphicon glyphicon-arrow-left"></i>
                        </button>
                    </div>
                    <div className="col-md-6" style={{margin: "10px 0px", fontSize: "20", textAlign: 'center'}}>
                        {this.state.monthMoment.format('MMMM, YY')}
                    </div>
                    <div className="col-md-3">
                        <button className="btn reportingArrow"
                                style={{marginLeft: '27px'}}
                                onClick={() => {
                                    let newMonthMoment = this.state.monthMoment.clone().add(1, 'month')
                                    props.getDeveloperSchedules(employeeID, newMonthMoment.month())
                                    this.setState({
                                        monthMoment: newMonthMoment
                                    })
                                }}
                                type="button">
                            <i className="glyphicon glyphicon-arrow-right"></i>
                        </button>
                    </div>
                </div>

            </form>
        </div>
    }
}

ReleaseDeveloperScheduleForm = reduxForm({
    form: 'developer-Schedule'
})(ReleaseDeveloperScheduleForm)

const selector = formValueSelector('developer-Schedule')

ReleaseDeveloperScheduleForm = connect(
    state => {
        const {fromSchedule, employeeID} = selector(state, 'fromSchedule', "employeeID")
        return {
            fromSchedule,
            employeeID
        }
    }
)(ReleaseDeveloperScheduleForm)


export default ReleaseDeveloperScheduleForm