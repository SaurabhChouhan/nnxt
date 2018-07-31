import React, {Component} from 'react'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import momentTZ from 'moment-timezone'
import * as SC from '../../../server/serverconstants'

moment.locale('en')
momentLocalizer()

class ReleaseDevelopersSchedules extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getEmployeeSettings()
    }

    render() {

        const {workCalendar, employeeSetting, from} = this.props
        let fromString = moment(from).format(SC.DATE_FORMAT)
        let fromMoment = momentTZ.tz(fromString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
        let startMoment = momentTZ.tz(fromString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
        let toMoment = fromMoment.clone().add(6, 'days')
        let weekArray = []
        while (startMoment.isSameOrBefore(toMoment)) {
            weekArray.push(startMoment.clone())
            startMoment = startMoment.clone().add(1, 'days')
        }


        let employee;

        if (workCalendar.employees && workCalendar.employees.length)
            employee = workCalendar.employees[0]

        if (!employee || !employee.schedule || !employee.schedule.length)
            return <div></div>


        return <div>
            <div key={'schedule_1'}
                 className="col-md-12 releaseSchedule">
                <div className="repository releaseDevInfo">
                    <div className="releaseDevHeading">
                        <h5>{employee.name}</h5>
                        <i className="glyphicon glyphicon-resize-full pull-right"></i>
                        <span
                            className="pull-right">{workCalendar.heading}</span>
                    </div>

                    <div className={"schCalendar"}>
                        <div className="schCalendarDayRow">
                            <div key={'monday'} className="schCalendarCell">
                                <h5>Mon</h5>
                            </div>
                            <div key={'tuesday'} className="schCalendarCell">
                                <h5>Tue</h5>
                            </div>
                            <div key={'wednesday'} className="schCalendarCell">
                                <h5>Wed</h5>
                            </div>
                            <div key={'thursday'} className="schCalendarCell">
                                <h5>Thu</h5>
                            </div>
                            <div key={'friday'} className="schCalendarCell">
                                <h5>Fri</h5>
                            </div>
                            <div key={'saturday'} className="schCalendarCell">
                                <h5>Sat</h5>
                            </div>
                            <div key={'sunday'} className="schCalendarCell">
                                <h5>Sun</h5>
                            </div>
                        </div>

                        {
                            employee.schedule.map((week, idx) => {
                                    return <div key={'week_' + idx} className="schCalendarDayRow">
                                        {
                                            week.map((day, dayIdx) => {
                                                let color = day.hours >= employeeSetting.superBusy ?
                                                    '#dd6c6c'
                                                    : day.hours >= employeeSetting.busy ?
                                                        '#91d861'
                                                        : day.hours >= employeeSetting.someWhatBusy ?
                                                            '#d645f7'
                                                            : day.hours >= employeeSetting.relativelyFree ?
                                                                '#76c0e2'
                                                                : '#e8c392'
                                                return <div key={'day_' + dayIdx} className="schCalendarCell">
                                                    <h5>{day.date > 0 ? day.date : ''}</h5>
                                                    <div className="releaseEmployee">
                                                        <span className={"schCalendarHour"} style={{
                                                            backgroundColor: color
                                                        }}>{day.hours >= 0 ? day.hours : ''}</span>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                }
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ReleaseDevelopersSchedules

/**
 import React, {Component} from 'react'
 import moment from 'moment'
 import momentLocalizer from 'react-widgets-moment'
 import momentTZ from 'moment-timezone'
 import * as SC from '../../../server/serverconstants'

 moment.locale('en')
 momentLocalizer()

 class ReleaseDevelopersSchedules extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getEmployeeSettings()
    }

    render() {

        const {schedules, employeeSetting, from} = this.props
        let fromString = moment(from).format(SC.DATE_FORMAT)
        let fromMoment = momentTZ.tz(fromString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
        let startMoment = momentTZ.tz(fromString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
        let toMoment = fromMoment.clone().add(6, 'days')
        let weekArray = []
        while (startMoment.isSameOrBefore(toMoment)) {
            weekArray.push(startMoment.clone())
            startMoment = startMoment.clone().add(1, 'days')
        }
        return <div>
            {
                schedules && schedules.length ? schedules.map((schedule, idx) => {


                        return <div key={'schedule' + idx}
                                    className="col-md-12 releaseSchedule">
                            <div className="repository releaseDevInfo">
                                <div className="releaseDevHeading">
                                    <h5>{schedule.employee && schedule.employee.name ? schedule.employee.name : "Employee"}</h5>
                                    <i className="glyphicon glyphicon-resize-full pull-right"></i>
                                    <span
                                        className="pull-right">{fromMoment.format(SC.DATE_MONTH_FORMAT) + ' to ' + toMoment.format(SC.DATE_MONTH_FORMAT)}</span>
                                </div>
                                <div className="releaseDayRow">
                                    {
                                        weekArray && weekArray.length ? weekArray.map((weekDate, index) => {
                                            let scheduleDay = schedule.days && schedule.days.length ? schedule.days.find(day => momentTZ.tz(day.dateString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).isSame(weekDate)) : undefined
                                            if (scheduleDay && scheduleDay != undefined) {
                                                let color = scheduleDay.plannedHours >= employeeSetting.superBusy ?
                                                    '#dd6c6c'
                                                    : scheduleDay.plannedHours >= employeeSetting.busy ?
                                                        '#91d861'
                                                        : scheduleDay.plannedHours >= employeeSetting.someWhatBusy ?
                                                            '#d645f7'
                                                            : scheduleDay.plannedHours >= employeeSetting.relativelyFree ?
                                                                '#76c0e2'

                                                                : '#e8c392'

                                                return <div key={'day' + index} className="releaseDayCell">
                                                    <h5> {moment(scheduleDay.dateString).format(SC.DATE_HALF_WEAK_MONTH_FORMAT)}</h5>
                                                    <div className="releaseEmployee" style={{backgroundColor: color}}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            width: '100%',
                                                            textAlign: 'center'
                                                        }}> {scheduleDay.plannedHours}</span>
                                                    </div>
                                                </div>
                                            } else return <div key={'day' + index} className="releaseDayCell">
                                                <h5> {moment(weekDate).format(SC.DATE_HALF_WEAK_MONTH_FORMAT)}</h5>
                                                <div className="releaseEmployee" style={{backgroundColor: '#e8c392'}}>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        width: '100%',
                                                        textAlign: 'center'
                                                    }}> 0</span>
                                                </div>
                                            </div>
                                        }) : null
                                    }
                                </div>
                            </div>
                        </div>
                    }) :
                    <div className="releaseEmployeeMsgText">
                        <label>Employee is not selected</label>
                    </div>
            }
        </div>
    }
}

 export default ReleaseDevelopersSchedules

 **/