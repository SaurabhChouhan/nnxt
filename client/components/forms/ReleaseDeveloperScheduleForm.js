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
let ReleaseDeveloperScheduleForm = (props) => {
    const {handleSubmit, change, fromSchedule, employeeID, team} = props
    let now = new Date()
    let nowMoment = moment(now)
    let nowString = moment(now).format(SC.DATE_FORMAT)
    let nowMomentTz = momentTZ.tz(nowString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    let fromScheduleString = moment(fromSchedule).format(SC.DATE_FORMAT)
    let fromScheduleTz = momentTZ.tz(fromScheduleString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    let canGoPrevious = fromScheduleTz.clone().subtract(7, 'days').isSameOrAfter(nowMomentTz)
    console.log("canGoPrevious", canGoPrevious)
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
                               props.getDeveloperSchedules(newValue, fromSchedule)
                           }}
                           component={renderSelect}
                           options={team}
                    />

                </div>
            </div>
            <div className="col-md-12">
                <div className="col-md-3">
                    <button className={canGoPrevious ? "btn reportingArrow" : "btn releaseDevArrowDisable"}
                            style={{marginLeft: '-16px'}}
                            onClick={() => {
                                if (canGoPrevious) {
                                    let prevDate = moment(fromSchedule).clone().subtract(7, 'days').format(SC.DATE_FORMAT)
                                    props.getDeveloperSchedules(employeeID, prevDate)
                                    change("fromSchedule", moment(prevDate).clone().toDate())
                                }
                            }}
                            type="button">
                        <i className="glyphicon glyphicon-arrow-left"></i>
                    </button>
                </div>
                <div className="col-md-6">

                    <Field name='fromSchedule'
                           onChange={(event, newValue, oldValue) => {
                               props.getDeveloperSchedules(employeeID, newValue)
                           }}
                           label=''
                           min={nowMoment.toDate()}
                           component={renderDateTimePickerString}
                           showTime={false}
                    />

                </div>
                <div className="col-md-3">
                    <button className="btn reportingArrow"
                            style={{marginLeft: '27px'}}
                            onClick={() => {
                                let nextDate = moment(fromSchedule).clone().add(7, 'days').format('YYYY-MM-DD')
                                props.getDeveloperSchedules(employeeID, nextDate)
                                change("fromSchedule", moment(nextDate).clone().toDate())
                            }}
                            type="button">
                        <i className="glyphicon glyphicon-arrow-right"></i>
                    </button>
                </div>
            </div>

        </form>
    </div>

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