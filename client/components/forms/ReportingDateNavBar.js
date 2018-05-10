import React, {Component} from 'react'
import {renderDateTimePicker} from "./fields"
import {Field, reduxForm} from 'redux-form'

class ReportingDateNavbar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {taskStatus, releaseID} = this.props
        return (
            <form>
                <div className='col-md-12'>
                    <div className="col-md-2 div-hover">
                        <button className="btn reportingArrow"
                                style={{marginLeft: '117px'}}
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
                               component={renderDateTimePicker}
                               showTime={false}
                        />
                    </div>
                    <div className="col-md-2 div-hover">
                        <button className="btn reportingArrow"
                                style={{marginLeft: '150px'}}
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

ReportingDateNavbar = reduxForm({
    form: 'reporting-date'
})(ReportingDateNavbar)

export default ReportingDateNavbar