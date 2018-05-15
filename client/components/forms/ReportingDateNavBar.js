import React, {Component} from 'react'
import {renderDateTimePickerString} from "./fields"
import {Field, formValueSelector, reduxForm} from 'redux-form'
import moment from 'moment'
import {connect} from 'react-redux'

class ReportingDateNavBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {taskStatus, releaseID, dateOfReport} = this.props
        const {change} = this.props
        return (
            <form>
                <div className='col-md-12'>
                    <div className="col-md-2 div-hover">
                        <button className="btn reportingArrow"
                                style={{marginLeft: '117px'}}
                                onClick={() => {
                                    let prevDate = moment(dateOfReport).clone().subtract(1, 'days').format('YYYY-MM-DD')
                                    this.props.setReportDate(prevDate)
                                    this.props.onProjectSelect(releaseID, prevDate, taskStatus)
                                    change("dateOfReport", moment(prevDate).clone().toDate())

                                }}
                                type="button">
                            <i className="glyphicon glyphicon-arrow-left"></i>
                        </button>
                    </div>
                    <div className="col-md-3 reportingDatePicker">
                        <Field name='dateOfReport'
                               onChange={(event, newValue, oldValue) => {
                                   this.props.setReportDate(newValue)
                                   this.props.onProjectSelect(releaseID, newValue, taskStatus)
                               }}
                               label=''
                               component={renderDateTimePickerString}
                               showTime={false}
                        />
                    </div>
                    <div className="col-md-2 div-hover">
                        <button className="btn reportingArrow"
                                style={{marginLeft: '150px'}}
                                onClick={() => {
                                    let nextDate = moment(dateOfReport).clone().add(1, 'days').format('YYYY-MM-DD')

                                    this.props.setReportDate(nextDate)
                                    this.props.onProjectSelect(releaseID, nextDate, taskStatus)
                                    change("dateOfReport", moment(nextDate).clone().toDate())
                                }}
                                type="button">
                            <i className="glyphicon glyphicon-arrow-right"></i>
                        </button>
                    </div>
                    <hr/>
                </div>
            </form>
        )
    }
}

ReportingDateNavBar = reduxForm({
    form: 'reporting-date'
})(ReportingDateNavBar)

const selector = formValueSelector('reporting-date')

ReportingDateNavBar = connect(
    state => {
        const dateOfReport = selector(state, 'dateOfReport')
        return {
            dateOfReport
        }
    }
)(ReportingDateNavBar)


export default ReportingDateNavBar