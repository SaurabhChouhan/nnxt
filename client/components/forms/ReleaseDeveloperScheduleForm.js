import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderSelect} from './fields'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'
import {NotificationManager} from 'react-notifications'

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
                <div className="col-md-offset-3 col-md-6 repositoryHeading releaseDevScheduleHeading">
                    <span className={"highlightText"}>Employee Work Calendar</span>
                </div>
                <div className="col-md-12">
                    <div className="col-md-offset-3 col-md-6 pad">
                        <Field name="employeeID"
                               onChange={(event, newValue, oldValue) => {
                                   props.getDeveloperSchedules(newValue, this.state.monthMoment.month(), this.state.monthMoment.year())
                               }}
                               component={renderSelect}
                               noneOptionText={"Select Employee..."}

                               options={team}
                        />

                    </div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-3">
                        <button className={"btn reportingArrow"}
                                style={{marginLeft: '-16px'}}
                                onClick={() => {
                                    if(!employeeID) {
                                        return NotificationManager.error('Please select employee!')
                                    }
                                    let newMonthMoment = this.state.monthMoment.clone().subtract(1, 'month')
                                    props.getDeveloperSchedules(employeeID, newMonthMoment.month(), newMonthMoment.year())
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
                                    if(!employeeID) {
                                        return NotificationManager.error('Please select employee!')
                                    }
                                    let newMonthMoment = this.state.monthMoment.clone().add(1, 'month')
                                    props.getDeveloperSchedules(employeeID, newMonthMoment.month(), newMonthMoment.year())
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