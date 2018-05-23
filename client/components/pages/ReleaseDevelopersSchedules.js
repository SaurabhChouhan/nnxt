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
        let toMoment = fromMoment.clone().add(7, 'days')
        let weekArray = []
        while (startMoment.isBefore(toMoment)) {
            weekArray.push(startMoment.clone())
            startMoment = startMoment.clone().add(1, 'days')
        }
        return (
            <div>
                {
                    schedules && schedules.length ? schedules.map((schedule, idx) => <div key={'schedule' + idx}
                                                                                          className="col-md-12 releaseSchedule">
                            <div className="repository releaseDevInfo">
                                <div className="releaseDevHeading">
                                    <h5>{schedule.employee && schedule.employee.name ? schedule.employee.name : "Employee"}</h5>
                                    <i className="glyphicon glyphicon-resize-full pull-right"></i>
                                    <span
                                        className="pull-right">{fromMoment.format(SC.DATE_MONTH_FORMAT) + ' to ' + toMoment.format(SC.DATE_MONTH_FORMAT)}</span>
                                </div>
                                <div className="releaseDayRow">
                                    {weekArray && weekArray.length ? weekArray.map((weekDate, index) =>
                                        <div key={'day' + index} className="releaseDayCell"><h5>Mon</h5>
                                            <div className="estimationuser"><span>E</span></div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                        </div>
                    ) : <label>Employee is not selected</label>
                }

            </div>
        )
    }
}

export default ReleaseDevelopersSchedules