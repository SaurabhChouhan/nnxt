import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderDateTimePickerString, renderDateTimeStringShow, renderField} from './fields'
import {required} from "./validation"
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import * as SC from '../../../server/serverconstants'

moment.locale('en')
momentLocalizer()
let ReleasePlanningUpdateForm = (props) => {
    const {change, team, handleSubmit, submitting, pristine, reset, initial} = props
    console.log("initial", initial)
    const today = new Date()
    const todayMoment = moment(today).hour(0).minute(0).second(0).milliseconds(0)
    const StartDate = moment(initial.devStartDate).hour(0).minute(0).second(0).milliseconds(0)
    const devEndDate = moment(initial.devEndDate).hour(0).minute(0).second(0).milliseconds(0)


    const min = StartDate.isSameOrAfter(todayMoment) ? StartDate.toDate() : todayMoment.toDate()
    const max = devEndDate.toDate()
    return <form onSubmit={handleSubmit}>

        <div className="col-md-10">

            <Field name="release._id" component="input" type="hidden"/>

            <Field name="project.name"
                   readOnly
                   component={renderField}
                   label={" Project Name : "}
                   validate={[required]}
            />

            <Field name="iterations[0].devStartDate"
                   placeholder={"Date"}
                   component={renderDateTimeStringShow}
                   showTime={false}
                   min={min}
                   max={max}
                   formate={SC.DATE_AND_DAY_SHOW_FORMAT}
                   label={"Start Date : "}
                   validate={[required]}
            />

            <div className="col-md-11">
                <Field name="rePlanningStartDate"
                       placeholder={"Date"}
                       component={renderDateTimePickerString}
                       showTime={false}
                       min={min}
                       max={max}
                       label={"Replanned Start Date :"}
                       validate={[required]}
                />
            </div>

            <Field name="iterations[0].devEndDate"
                   placeholder={"Date"}
                   component={renderDateTimeStringShow}
                   showTime={false}
                   min={min}
                   max={max}
                   formate={SC.DATE_AND_DAY_SHOW_FORMAT}
                   label={"End Date : "}
                   validate={[required]}
            />

            <div className="col-md-11">
                <Field name="rePlanningEndDate"
                       placeholder={"Date"}
                       component={renderDateTimePickerString}
                       showTime={false}
                       min={StartDate.toDate() ? StartDate.toDate() : todayMoment.toDate()}
                       max={max}
                       label={"Replanned End Date :"}
                       validate={[required]}
                />
            </div>

            <Field name="iterations[0].clientReleaseDate"
                   placeholder={"Date"}
                   component={renderDateTimeStringShow}
                   showTime={false}
                   min={min}
                   max={max}
                   formate={SC.DATE_AND_DAY_SHOW_FORMAT}
                   label={"Client Release Date : "}
                   validate={[required]}
            />


            <div className="col-md-11">
                <Field name="rePlanningClientReleaseDate"
                       placeholder={"Date"}
                       component={renderDateTimePickerString}
                       showTime={false}
                       min={devEndDate.toDate() ? devEndDate.toDate() : todayMoment.toDate()}
                       label={"Replanned Client Release Date :"}
                       validate={[required]}
                />
            </div>

        </div>

        <div className="col-md-12">
            <div className="col-md-4">
                <button type="submit" className="btn customBtn" disabled={submitting || pristine}>
                    Update Release
                </button>
            </div>
            <div className="col-md-4">
                <button type="button" className="btn customBtn" disabled={submitting || pristine} onClick={reset}>
                    Reset
                </button>
            </div>
        </div>


    </form>
}

ReleasePlanningUpdateForm = reduxForm({
    form: 'update-release-planning'
})(ReleasePlanningUpdateForm)

export default ReleasePlanningUpdateForm