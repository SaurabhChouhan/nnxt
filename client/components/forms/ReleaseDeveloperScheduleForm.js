import React, { Component } from 'react'
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { renderSelect, renderMultiSelect } from './fields'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import { connect } from 'react-redux'
import { NotificationManager } from 'react-notifications'
import { ALL } from '../../../server/serverconstants'
import { RELEASE_TYPES, RELEASE_TYPE_CLIENT } from '../../clientconstants'

moment.locale('en')
momentLocalizer()


class ReleaseDeveloperScheduleForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            monthMoment: moment()
        }
    }

    componentDidMount() {
        // RELEASE_TYPE_CLIENT is passed to ensure that initially client work calendars are shown
        this.props.change('releaseTypes', [{ _id: RELEASE_TYPE_CLIENT, name: RELEASE_TYPE_CLIENT }])
        this.props.getDeveloperSchedules(ALL, [{ _id: RELEASE_TYPE_CLIENT }], this.state.monthMoment.month(), this.state.monthMoment.year(), this.props.releaseID)
    }

    render() {
        let props = this.props
        const { handleSubmit, employeeID, developers, releaseID, releaseTypes, totalPlannedHours, totalReportedHours } = props
        return <div>
            <form onSubmit={handleSubmit}>
                <div className="col-md-12">
                    <div className="col-md-4 pad">
                        <Field name="employeeID"
                            onChange={(event, newValue, oldValue) => {
                                props.getDeveloperSchedules(newValue, releaseTypes, this.state.monthMoment.month(), this.state.monthMoment.year(), releaseID)
                            }}
                            label={'Select Employee:'}
                            component={renderSelect}
                            showNoneOption={false}
                            options={developers}
                        />
                    </div>
                    <div className="col-md-4">
                        <Field name="releaseTypes"
                            onChange={(event, newValue, oldValue) => {
                                console.log("New value is ", newValue)
                                props.getDeveloperSchedules(employeeID, newValue, this.state.monthMoment.month(), this.state.monthMoment.year(), releaseID)
                            }}
                            component={renderMultiSelect}
                            data={RELEASE_TYPES}
                            label={'Select Release Type:'}
                        />
                    </div>
                    <div className="col-md-4">
                        <span className="work-calendar-label">Total Planned Hours: {totalPlannedHours}</span>
                        <span style={{ marginLeft: '30px' }} className="work-calendar-label">Total Reported Hours: {totalReportedHours}</span>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-3">
                        <button className={"btn reportingArrow"}
                            style={{ marginLeft: '-16px' }}
                            onClick={() => {
                                let newMonthMoment = this.state.monthMoment.clone().subtract(1, 'month')
                                console.log("new month moment is ", newMonthMoment)
                                props.getDeveloperSchedules(employeeID, releaseTypes, newMonthMoment.month(), newMonthMoment.year())
                                this.setState({
                                    monthMoment: newMonthMoment
                                })
                            }}
                            type="button">
                            <i className="glyphicon glyphicon-arrow-left"></i>
                        </button>
                    </div>
                    <div className="col-md-6" style={{ margin: "10px 0px", fontSize: "20", textAlign: 'center' }}>
                        {this.state.monthMoment.format('MMMM, YY')}
                    </div>
                    <div className="col-md-3">
                        <button className="btn reportingArrow"
                            style={{ marginLeft: '27px' }}
                            onClick={() => {
                                let newMonthMoment = this.state.monthMoment.clone().add(1, 'month')
                                console.log("new month moment is ", newMonthMoment)
                                props.getDeveloperSchedules(employeeID, releaseTypes, newMonthMoment.month(), newMonthMoment.year())
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
        const { fromSchedule, employeeID, releaseTypes } = selector(state, 'fromSchedule', "employeeID", "releaseTypes")
        return {
            fromSchedule,
            employeeID,
            releaseTypes
        }
    }
)(ReleaseDeveloperScheduleForm)


export default ReleaseDeveloperScheduleForm