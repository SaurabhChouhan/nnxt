import React, {Component} from 'react'
import {Field,formValueSelector, reduxForm} from 'redux-form'
import {renderDateTimePickerString, renderDateTimeStringShow, renderField} from './fields'
import {required} from "./validation"
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'
import * as SC from '../../../server/serverconstants'
import * as U from '../../../server/utils'

moment.locale('en')
momentLocalizer()
let UpdateReleaseDatesForm = (props) => {
    const {change, team, handleSubmit, submitting, pristine, reset, release, rePlanStartDate, rePlanEndDate, rePlanningClientReleaseDate} = props
    const todayMoment = U.nowMomentInTimeZone(SC.INDIAN_TIMEZONE)
    const startDateMoment = moment(rePlanStartDate).hour(0).minute(0).second(0).milliseconds(0)
    const endDateMoment = moment(rePlanEndDate).hour(0).minute(0).second(0).milliseconds(0)
    const clientReleaseDate = moment(rePlanningClientReleaseDate).hour(0).minute(0).second(0).milliseconds(0)


    return <form onSubmit={handleSubmit}>

        <div className="col-md-10">

            <Field name="release._id" component="input" type="hidden"/>

            { <label>Project Name : {release.project.name +' '+ release.name}</label>}
            <Field name="devStartDate"
                   placeholder={"Date"}
                   component={renderDateTimeStringShow}
                   showTime={false}
                   formate={SC.DATE_AND_DAY_SHOW_FORMAT}
                   label={"Start Date : "}
                   validate={[required]}
            />

            <div className="col-md-11">
                <Field name="rePlanStartDate"
                       placeholder={"Date"}
                       component={renderDateTimePickerString}
                       showTime={false}

                       label={"Re-Plan Start Date :"}
                       validate={[required]}
                />
            </div>

            <Field name="devEndDate"
                   placeholder={"Date"}
                   component={renderDateTimeStringShow}
                   showTime={false}

                   formate={SC.DATE_AND_DAY_SHOW_FORMAT}
                   label={"End Date : "}
                   validate={[required]}
            />

            <div className="col-md-11">
                <Field name="rePlanEndDate"
                       placeholder={"Date"}
                       component={renderDateTimePickerString}
                       showTime={false}

                       label={"Replanned End Date :"}
                       validate={[required]}
                />
            </div>

            <Field name="clientReleaseDate"
                   placeholder={"Date"}
                   component={renderDateTimeStringShow}
                   showTime={false}
                   formate={SC.DATE_AND_DAY_SHOW_FORMAT}
                   label={"Client Release Date : "}
                   validate={[required]}
            />


            <div className="col-md-11">
                <Field name="rePlanningClientReleaseDate"
                       placeholder={"Date"}
                       component={renderDateTimePickerString}
                       showTime={false}
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

UpdateReleaseDatesForm = reduxForm({
    form: 'update-release-dates'
})(UpdateReleaseDatesForm)

const selector = formValueSelector('update-release-dates')

UpdateReleaseDatesForm = connect(
    state => {
        const {rePlanStartDate, rePlanEndDate, rePlanningClientReleaseDate} = selector(state, 'rePlanStartDate', rePlanEndDate, 'rePlanningClientReleaseDate')
        return {
            rePlanStartDate,
            rePlanEndDate,
            rePlanningClientReleaseDate
        }
    }
)(UpdateReleaseDatesForm)

export default UpdateReleaseDatesForm