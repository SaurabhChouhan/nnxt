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
        let fromMoment = momentTZ.tz(fromString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
        let startMoment = momentTZ.tz(fromString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
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
                                            let scheduleDay = schedule.days && schedule.days.length ? schedule.days.find(day => momentTZ.tz(day.dateString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).isSame(weekDate)) : undefined
                                            if (scheduleDay && scheduleDay != undefined) {
                                                return <div key={'day' + index} className="releaseDayCell">
                                                    <h5> {moment(scheduleDay.dateString).format(SC.DATE_HALF_WEAK_MONTH_FORMAT)}</h5>
                                                    <div>
                                                        <span>{scheduleDay.plannedHours <= employeeSetting.free ?
                                                            <img className="div-hover" key="free" src="/images/free.png"
                                                                 title="Free"
                                                            />
                                                            : scheduleDay.plannedHours <= employeeSetting.relativelyFree ?
                                                                <img className="div-hover" key="relatively-free"
                                                                     src="/images/relative_free.png"
                                                                     title="Relative Free"
                                                                />
                                                                : scheduleDay.plannedHours <= employeeSetting.busy ?
                                                                    <img className="div-hover" key="busy"
                                                                         src="/images/busy.png"
                                                                         title="Busy"
                                                                    />
                                                                    : <img className="div-hover" key="super_busy"
                                                                           src="/images/super_busy.png"
                                                                           title="Super Busy"
                                                                    />}</span>
                                                    </div>
                                                </div>
                                            } else return <div key={'day' + index} className="releaseDayCell">
                                                <h5> {moment(weekDate).format(SC.DATE_HALF_WEAK_MONTH_FORMAT)}</h5>
                                                <div>
                                                    <span> <img className="div-hover" key="free" src="/images/free.png"
                                                                title="Free"
                                                    /></span>
                                                </div>
                                            </div>

                                        }) : null
                                    }
                                </div>

                            </div>
                        </div>
                    }) :
                    <label>Employee is not selected</label>
            }
        </div>
    }
}

export default ReleaseDevelopersSchedules

/*{schedule.plannedHours <= employeeSetting.free ?
                                                            "F"
                                                            : schedule.plannedHours <= employeeSetting.relativelyFree ?
                                                                "RF"
                                                                : schedule.plannedHours <= employeeSetting.busy ?
                                                                    "B"
                                                                    : "SB"}*/