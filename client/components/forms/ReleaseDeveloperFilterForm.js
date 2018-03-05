import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderDateTimePicker, renderSelect,} from './fields'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'

moment.locale('en')
momentLocalizer()
let ReleaseDeveloperFilterForm = (props) => {
    const {change, team, handleSubmit, startDate, endDate} = props

    return <form onSubmit={handleSubmit}>

        <div className="col-md-4">
            <Field name="employeeId" placeholder={"Name of Developer"}
                   onChange={(event, newValue, oldValue) =>
                   {
                       props.getDeveloperDetails(newValue, startDate, endDate)
                   }}
                   component={renderSelect} options={team}
                   label={"Developer Name:"} />

        </div>
        <div className="col-md-6">
            <div className="col-md-6">
                <Field name="startDate" placeholder={"Start Date"} component={renderDateTimePicker}
                       showTime={false}
                       label={" From :"} />
            </div>
            <div className="col-md-6">
                <Field name="endDate" placeholder={" End Date"} component={renderDateTimePicker}
                       showTime={false}
                       label={" To :"}/>
            </div>

        </div>
    </form>
}

ReleaseDeveloperFilterForm = reduxForm({
    form: 'developer-filter'
})(ReleaseDeveloperFilterForm)

const selector = formValueSelector('developer-filter')

ReleaseDeveloperFilterForm = connect(
    state => {
        const {startDate, endDate} = selector(state, 'startDate', 'endDate')
        return {
            startDate,
            endDate
        }
    }
)(ReleaseDeveloperFilterForm)


export default ReleaseDeveloperFilterForm